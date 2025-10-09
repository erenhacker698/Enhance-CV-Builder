import { NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"
import crypto from "crypto"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Snapshot = {
  id: string
  timestamp: number
  name?: string
  resume: {
    header: any
    sections: any[]
  }
  settings: any
  editHistory?: { past: any[]; future: any[] }
}

type CvDocument = {
  id: string
  createdAt: number
  updatedAt: number
  current: Snapshot
  history: Snapshot[]
}

const dataDir = path.join(process.cwd(), "data", "cv")

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true })
}

export async function GET() {
  try {
    await ensureDir()
  const files = await fs.readdir(dataDir).catch(() => [])
  const docs: Array<{ id: string; createdAt: number; updatedAt: number; name?: string; timestamp: number; sectionsCount: number }>= []
    for (const f of files) {
      if (!f.endsWith('.json')) continue
      try {
        const raw = await fs.readFile(path.join(dataDir, f), 'utf-8')
        const doc = JSON.parse(raw)
        // Only include documents that have been manually saved and named
        if (doc?.current?.name) {
          docs.push({
            id: doc.id,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            name: doc.current?.name,
            timestamp: doc.current?.timestamp,
            sectionsCount: Array.isArray(doc.current?.resume?.sections) ? doc.current.resume.sections.length : 0,
          })
        }
      } catch {}
    }
    // sort by updatedAt desc
    docs.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
    return NextResponse.json({ documents: docs })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to list documents' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
  const { resume, settings, name, resumeHistory } = body || {}
    if (!resume?.header || !Array.isArray(resume?.sections)) {
      return NextResponse.json({ error: "Invalid payload: missing resume.header or resume.sections" }, { status: 400 })
    }

    await ensureDir()

    const id = crypto.randomUUID()
    const now = Date.now()

    const snapshot: Snapshot = {
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
      snapshot.editHistory = {
        past: resumeHistory.past.slice(-50),
        future: resumeHistory.future.slice(-50),
      }
    }

    const doc: CvDocument = {
      id,
      createdAt: now,
      updatedAt: now,
      current: snapshot,
      history: [],
    }

    const filePath = path.join(dataDir, `${id}.json`)
    await fs.writeFile(filePath, JSON.stringify(doc, null, 2), "utf-8")

    return NextResponse.json({ id, doc })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create CV" }, { status: 500 })
  }
}
