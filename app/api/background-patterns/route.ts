import { NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "background-patterns")
    let entries: string[] = []
    try {
      const files = await fs.readdir(dir, { withFileTypes: true })
      entries = files
        .filter((f) => f.isFile())
        .map((f) => f.name)
        .filter((n) => /\.(png|svg|jpg|jpeg|webp)$/i.test(n))
    } catch (e: any) {
      // directory may not exist; return empty list
      entries = []
    }
    const files = entries.map((name) => ({ name, path: `/background-patterns/${name}` }))
    return NextResponse.json({ files })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to list patterns" }, { status: 500 })
  }
}
