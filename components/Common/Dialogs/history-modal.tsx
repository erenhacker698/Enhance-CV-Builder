"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil, RotateCcw as RestoreIcon } from "lucide-react"
import type { RootState } from "@/lib/store"
import { getCv, renameSnapshot, deleteSnapshot } from "@/lib/client/api"
import { hydrateFromSnapshot, setHistory } from "@/lib/features/resume/resumeSlice"
import { hydrateSettings, setShowHistoryModal, setCurrentCvId } from "@/lib/features/settings/settingsSlice"

export default function HistoryModal() {
  const dispatch = useDispatch()
  const { currentCvId, showHistoryModal } = useSelector((s: RootState) => s.settings)
  const editHistory = useSelector((s: RootState) => s.resume.history)
  const [snapshots, setSnapshots] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const run = async () => {
      if (!showHistoryModal || !currentCvId) return
      setLoading(true)
      setError(null)
      try {
        const doc = await getCv(currentCvId)
        const list = [doc.current, ...(doc.history || [])]
        setSnapshots(list)
      } catch (e: any) {
        // Treat any load error as "no history" for UX simplicity
        setError('NO_HISTORY')
        // Clear currentCvId if the doc cannot be loaded (likely deleted)
        try { dispatch(setCurrentCvId(null)) } catch {}
        setSnapshots([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [showHistoryModal, currentCvId])

  const restore = (snap: any) => {
    dispatch(hydrateFromSnapshot({ header: snap.resume.header, sections: snap.resume.sections }))
    dispatch(hydrateSettings(snap.settings || {}))
    // If snapshot carries persisted edit history, load it too
    if (snap.editHistory && Array.isArray(snap.editHistory.past) && Array.isArray(snap.editHistory.future)) {
      dispatch(setHistory({ past: snap.editHistory.past, future: snap.editHistory.future }))
    } else {
      // Otherwise reset history to a clean state
      dispatch(setHistory({ past: [], future: [] }))
    }
    dispatch(setShowHistoryModal(false))
  }

  const rename = async (snap: any) => {
    const name = prompt('Name this snapshot:', snap.name || '')
    if (!name || !currentCvId) return
    try {
      const doc = await renameSnapshot(currentCvId, snap.id, name)
      setSnapshots([doc.current, ...(doc.history || [])])
    } catch (e: any) {
      alert(e?.message || 'Rename failed')
    }
  }

  const del = async (snap: any) => {
    if (!currentCvId) return
    if (!confirm('Delete this snapshot?')) return
    try {
      const doc = await deleteSnapshot(currentCvId, snap.id)
      setSnapshots([doc.current, ...(doc.history || [])])
      setSelected({})
    } catch (e: any) {
      alert(e?.message || 'Delete failed')
    }
  }

  const restoreEditStep = (index: number) => {
    if (!editHistory || !Array.isArray(editHistory.past)) return
    const preservedHistory = { past: [...editHistory.past], future: [...editHistory.future] }
    const step = editHistory.past[index]
    if (!step) return
    // Restore content to the chosen step but DO NOT mutate the list of steps shown
    dispatch(hydrateFromSnapshot({ header: step.header, sections: step.sections }))
    // Re-apply the preserved editHistory because hydrateFromSnapshot resets history
    dispatch(setHistory(preservedHistory))
    dispatch(setShowHistoryModal(false))
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const deleteSelected = async () => {
    if (!currentCvId) return
    const ids = Object.keys(selected).filter((k) => selected[k])
    if (ids.length === 0) return
    if (!confirm(`Delete ${ids.length} selected snapshot(s)?`)) return
    try {
      let doc: any | null = null
      for (const id of ids) {
        doc = await deleteSnapshot(currentCvId, id)
      }
      if (doc) setSnapshots([doc.current, ...(doc.history || [])])
      setSelected({})
    } catch (e: any) {
      alert(e?.message || 'Bulk delete failed')
    }
  }

  const clearAllHistory = async () => {
    if (!currentCvId) return
    if (!confirm('Remove all history snapshots? This keeps the current version.')) return
    try {
      // load doc to get list of history snapshot ids
      const doc = await getCv(currentCvId)
      const ids: string[] = (doc.history || []).map((s: any) => s.id)
      let latest: any = null
      for (const id of ids) {
        latest = await deleteSnapshot(currentCvId, id)
      }
      if (latest) setSnapshots([latest.current, ...(latest.history || [])])
      setSelected({})
    } catch (e: any) {
      alert(e?.message || 'Clear history failed')
    }
  }

  return (
    <Dialog open={showHistoryModal} onOpenChange={(open) => dispatch(setShowHistoryModal(open))}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>History</DialogTitle>
        </DialogHeader>
        {loading && <div className="text-sm text-gray-500">Loading…</div>}
        {!loading && (
          <>
            {/* Session edit steps (persisted per snapshot and hydrated on load) */}
            <div className="mb-4">
              <div className="text-sm font-semibold mb-1">Edit steps (this version)</div>
              {(!editHistory || (editHistory.past.length === 0 && editHistory.future.length === 0)) ? (
                <div className="text-xs text-gray-500">No edit steps recorded for this version.</div>
              ) : (
                <>
                  <div className="text-xs text-gray-600 mb-2">
                    {editHistory.past.length} step(s) available to undo • {editHistory.future.length} step(s) available to redo
                  </div>
                  <div className="space-y-1 max-h-[30vh] overflow-auto pr-1">
                    {editHistory.past.map((s: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between rounded border p-2 gap-2">
                        <div className="min-w-0">
                          <div className="text-xs font-medium">Step {editHistory.past.length - idx}</div>
                          <div className="text-[11px] text-gray-500 truncate">{s.createdAt ? new Date(s.createdAt).toLocaleString() : 'time unknown'}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="default" size="sm" onClick={() => restoreEditStep(idx)} title="Use this step"><RestoreIcon size={14} /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="mt-2 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!editHistory || (editHistory.past.length === 0 && editHistory.future.length === 0)}
                  onClick={async () => {
                    try {
                      if (currentCvId) {
                        const res = await fetch(`/api/cv/${currentCvId}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ action: 'clear-edit-history' })
                        })
                        if (!res.ok) throw new Error(await res.text())
                        const doc = await getCv(currentCvId)
                        dispatch(setHistory(doc.current?.editHistory || { past: [], future: [] }))
                      } else {
                        // No CV yet: clear in-memory steps only
                        dispatch(setHistory({ past: [], future: [] }))
                      }
                    } catch (e: any) {
                      alert(e?.message || 'Failed to remove steps')
                    }
                  }}
                >
                  Remove all steps
                </Button>
              </div>
            </div>

            {/* Server snapshots list: only when a document is open */}
            {currentCvId ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600">{snapshots.length} snapshot(s)</div>
                  {snapshots.length > 1 && (
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm" onClick={deleteSelected} disabled={Object.values(selected).every(v => !v)}>Remove selected</Button>
                      <Button variant="outline" size="sm" onClick={clearAllHistory}>Remove all snapshots</Button>
                    </div>
                  )}
                </div>
                {snapshots.length <= 1 ? (
                  <div className="text-sm text-gray-600">No history snapshots yet for this document.</div>
                ) : (
                  <div className="space-y-2 max-h-[60vh] overflow-auto scrollbar-none">
                    {snapshots.map((s, idx) => {
                      const isCurrent = idx === 0
                      return (
                        <div key={s.id || idx} className="flex items-center justify-between rounded border p-2 gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {isCurrent ? (
                              <input type="checkbox" disabled className="opacity-40" />
                            ) : (
                              <input type="checkbox" checked={!!selected[s.id]} onChange={() => toggleSelect(s.id)} />
                            )}
                            <div>
                              <div className="text-sm font-medium truncate">{s.name || new Date(s.timestamp).toLocaleString()} {isCurrent && <span className="text-xs text-gray-500">(current)</span>}</div>
                              <div className="text-xs text-gray-500">{new Date(s.timestamp).toLocaleString()} • {s.resume.sections?.length || 0} sections</div>
                              {s.editHistory && (Array.isArray(s.editHistory.past) || Array.isArray(s.editHistory.future)) && (
                                <div className="text-[11px] text-gray-500">steps: {(s.editHistory.past?.length || 0)} undo • {(s.editHistory.future?.length || 0)} redo</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => rename(s)} title="Rename"><Pencil size={16} /></Button>
                            {!isCurrent && <Button variant="ghost" size="icon" onClick={() => del(s)} title="Delete"><Trash2 size={16} />
                            </Button>}
                            {!isCurrent && <Button variant="default" size="icon" onClick={() => restore(s)} title="Use"><RestoreIcon size={16} /></Button>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-600">Open a saved document to manage its snapshots.</div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
