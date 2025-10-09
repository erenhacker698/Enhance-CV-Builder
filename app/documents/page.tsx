"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import DocumentCard, { type DocSummary } from "@/components/Common/Documents/document-card"

interface DocCard extends DocSummary { timestamp: number }

export default function DocumentsPage() {
  const router = useRouter()
  const [docs, setDocs] = useState<DocCard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cols, setCols] = useState<2 | 3 | 4>(4)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/cv', { cache: 'no-store' })
        const data = await res.json()
        setDocs(data.documents || [])
      } catch (e: any) {
        setError(e?.message || 'Failed to load documents')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const refresh = async () => {
    try {
      const res = await fetch('/api/cv', { cache: 'no-store' })
      const data = await res.json()
      setDocs(data.documents || [])
    } catch {}
  }

  const deleteAll = async () => {
    if (!docs.length) return
    if (!confirm(`Delete all ${docs.length} document(s)? This cannot be undone.`)) return
    try {
      // Delete sequentially to keep it simple; can be parallelized later
      for (const d of docs) {
        await fetch(`/api/cv/${d.id}`, { method: 'DELETE' })
      }
      await refresh()
    } catch (e) {
      console.warn('Delete all failed', e)
      await refresh()
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Documents</h1>
        <div className="flex items-center gap-2">
          <Button variant="destructive" onClick={deleteAll} disabled={!docs.length} className="cursor-pointer">Delete all</Button>
          <Button variant="outline" onClick={() => setCols((c) => (c === 4 ? 3 : c === 3 ? 2 : 4))} title={`Cards per row: ${cols}`} className="cursor-pointer">
            {cols} / row
          </Button>
          <Button variant="outline" onClick={() => router.push('/')} className="cursor-pointer">Back to Editor</Button>
        </div>
      </div>
      {loading && <div className="text-sm text-gray-500">Loading…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {!loading && !error && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols === 2 ? 'xl:grid-cols-2' : cols === 3 ? 'xl:grid-cols-3' : 'xl:grid-cols-4'} gap-6`}>
          {docs.length === 0 && (
            <div className="text-sm text-gray-500">No saved documents yet.</div>
          )}
          {docs.map((d) => (
            <DocumentCard key={d.id} doc={d} onChange={refresh} />
          ))}
        </div>
      )}
    </div>
  )
}
