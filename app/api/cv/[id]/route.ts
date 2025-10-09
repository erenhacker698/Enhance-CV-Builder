import { NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"
import crypto from "crypto"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const dataDir = path.join(process.cwd(), "data", "cv")

async function readDoc(id: string) {
  const filePath = path.join(dataDir, `${id}.json`)
  const raw = await fs.readFile(filePath, "utf-8")
  return JSON.parse(raw)
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const doc = await readDoc(id)
    return NextResponse.json(doc)
  } catch (err: any) {
    const status = err?.code === 'ENOENT' ? 404 : 500
    return NextResponse.json({ error: err?.message || "Failed to read CV" }, { status })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const filePath = path.join(dataDir, `${id}.json`)
    const raw = await fs.readFile(filePath, "utf-8").catch((e) => {
      if (e?.code === 'ENOENT') return null
      throw e
    })
    if (!raw) return NextResponse.json({ error: "Document not found" }, { status: 404 })

  const doc = JSON.parse(raw)
  const body = await req.json()
  const { resume, settings, resumeHistory, name } = body || {}
    if (!resume?.header || !Array.isArray(resume?.sections)) {
      return NextResponse.json({ error: "Invalid payload: missing resume.header or resume.sections" }, { status: 400 })
    }

    const now = Date.now()
    // append previous current to history (keep last 50)
    if (doc.current) {
      doc.history = doc.history || []
      doc.history.unshift(doc.current)
      // retention trimming is applied after writing new current below
    }

    const newCurrent: any = {
      id: crypto.randomUUID(),
      timestamp: now,
      name: name || undefined,
      resume: {
        header: resume.header,
        sections: resume.sections,
      },
      settings: settings ?? {},
    }
    if (resumeHistory && Array.isArray(resumeHistory.past) && Array.isArray(resumeHistory.future)) {
      newCurrent.editHistory = {
        past: resumeHistory.past.slice(-50),
        future: resumeHistory.future.slice(-50),
      }
    }
    doc.current = newCurrent
    doc.updatedAt = now

    // Retention policy
    // - keep all named snapshots
    // - for snapshots without a name (autosaves):
    //    - keep up to 10 for today
    //    - keep at most 1 per previous day
    // - hard cap total (history + current) to 100 entries
    const isSameDay = (a: number, b: number) => new Date(a).toDateString() === new Date(b).toDateString()
    const today = Date.now()
    const named: any[] = []
    const autos: any[] = []
    for (const s of doc.history || []) {
      (s?.name ? named : autos).push(s)
    }
    // group autos by day
    const byDay = new Map<string, any[]>()
    for (const s of autos) {
      const key = new Date(s.timestamp).toDateString()
      if (!byDay.has(key)) byDay.set(key, [])
      byDay.get(key)!.push(s)
    }
    const prunedAutos: any[] = []
    for (const [day, list] of byDay.entries()) {
      // sort desc by time
      list.sort((a, b) => b.timestamp - a.timestamp)
      if (day === new Date(today).toDateString()) {
        // keep top 10 for today
        prunedAutos.push(...list.slice(0, 10))
      } else {
        // keep only most recent for previous days
        prunedAutos.push(list[0])
      }
    }
    // rebuild history: named first (most recent first), then pruned autos (most recent first)
    named.sort((a, b) => b.timestamp - a.timestamp)
    prunedAutos.sort((a, b) => b.timestamp - a.timestamp)
    doc.history = [...named, ...prunedAutos]
    // apply hard cap (excluding current but considering total reasonable bound)
    if (doc.history.length > 99) doc.history = doc.history.slice(0, 99)

    await fs.writeFile(filePath, JSON.stringify(doc, null, 2), "utf-8")
    return NextResponse.json(doc)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update CV" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const filePath = path.join(dataDir, `${id}.json`)
    const raw = await fs.readFile(filePath, "utf-8")
    const doc = JSON.parse(raw)
    const { action, snapshotId, name } = await req.json()
    if (action === 'rename') {
      if (!snapshotId || !name) return NextResponse.json({ error: 'snapshotId and name required' }, { status: 400 })
      if (doc.current?.id === snapshotId) {
        doc.current.name = name
      } else {
        const s = (doc.history || []).find((x: any) => x.id === snapshotId)
        if (!s) return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 })
        s.name = name
      }
    } else if (action === 'delete') {
      if (!snapshotId) return NextResponse.json({ error: 'snapshotId required' }, { status: 400 })
      if (doc.current?.id === snapshotId) {
        // Deleting current promotes most recent history as current
        const next = (doc.history || []).shift()
        if (!next) return NextResponse.json({ error: 'Cannot delete last remaining snapshot' }, { status: 400 })
        doc.current = next
      } else {
        doc.history = (doc.history || []).filter((x: any) => x.id !== snapshotId)
      }
    } else if (action === 'clear-edit-history') {
      // Clear persisted edit steps for the current snapshot only
      if (doc.current) {
        doc.current.editHistory = { past: [], future: [] }
        doc.updatedAt = Date.now()
      }
    } else {
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
    }
    await fs.writeFile(filePath, JSON.stringify(doc, null, 2), 'utf-8')
    return NextResponse.json(doc)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update snapshot" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const filePath = path.join(dataDir, `${id}.json`)
    await fs.unlink(filePath)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    const status = err?.code === 'ENOENT' ? 404 : 500
    return NextResponse.json({ error: err?.message || "Failed to delete CV" }, { status })
  }
}
