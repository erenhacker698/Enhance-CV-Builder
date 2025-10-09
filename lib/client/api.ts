import type { RootState } from "@/lib/store"

export type Snapshot = {
  id: string
  timestamp: number
  resume: {
    header: any
    sections: any[]
  }
  settings: any
  editHistory?: { past: Array<{ header: any; sections: any[]; createdAt?: number }>; future: Array<{ header: any; sections: any[]; createdAt?: number }> }
}

export type CvDocument = {
  id: string
  createdAt: number
  updatedAt: number
  current: Snapshot
  history: Snapshot[]
}

export async function createCv(state: RootState, name?: string): Promise<{ id: string; doc: CvDocument }> {
  const res = await fetch("/api/cv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resume: state.resume,
      settings: state.settings,
      name,
      resumeHistory: state.resume.history,
    }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function saveCv(id: string, state: RootState, name?: string): Promise<CvDocument> {
  const res = await fetch(`/api/cv/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resume: state.resume,
      settings: state.settings,
      name,
      resumeHistory: state.resume.history,
    }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getCv(id: string): Promise<CvDocument> {
  const res = await fetch(`/api/cv/${id}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function renameSnapshot(cvId: string, snapshotId: string, name: string): Promise<CvDocument> {
  const res = await fetch(`/api/cv/${cvId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'rename', snapshotId, name }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function deleteSnapshot(cvId: string, snapshotId: string): Promise<CvDocument> {
  const res = await fetch(`/api/cv/${cvId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', snapshotId }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
  export async function deleteCv(id: string): Promise<CvDocument> {
    const res = await fetch(`/api/cv/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete CV')
    return res.json()
  }
