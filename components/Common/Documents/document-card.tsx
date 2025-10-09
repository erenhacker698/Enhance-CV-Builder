"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Provider, useDispatch } from "react-redux"
import { configureStore, type ReducersMapObject } from "@reduxjs/toolkit"
import resumeReducer from "@/lib/features/resume/resumeSlice"
import settingsReducer from "@/lib/features/settings/settingsSlice"
import { hydrateFromSnapshot } from "@/lib/features/resume/resumeSlice"
import { hydrateSettings } from "@/lib/features/settings/settingsSlice"
import ResumeTemplateDoubleColumn from "@/components/ResumeTemplates/resume-template-double-column"
import ResumeTemplateElegant from "@/components/ResumeTemplates/resume-template-elegant"
import ResumeTemplateLeftSidebar from "@/components/ResumeTemplates/resume-template-left-sidebar"
// no need to import app RootState here; preview store is isolated per card

export interface DocSummary {
  id: string
  name?: string
  createdAt: number
  updatedAt: number
  sectionsCount: number
}

// Lightweight isolated store so preview doesn't affect the main editor store
function createPreviewStore(previewState: any) {
  const reducerMap: ReducersMapObject = {
    resume: resumeReducer as any,
    settings: settingsReducer as any,
  }
  return configureStore({
    reducer: reducerMap as any,
    preloadedState: previewState as any,
    middleware: (gDM: any) => gDM({ serializableCheck: false }),
  } as any)
}

export default function DocumentCard({ doc, onChange }: { doc: DocSummary; onChange?: () => void }) {
  const router = useRouter()
  const [full, setFull] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const resumeRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)

  // Track container width to compute responsive scale that preserves A4 aspect ratio
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width
      setContainerWidth(w)
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const SCALE = containerWidth > 0 ? containerWidth / 794 : 0.35
  const PREVIEW_W = Math.round(794 * SCALE)
  const PREVIEW_H = Math.round(1123 * SCALE)

  useEffect(() => {
    let alive = true
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/cv/${doc.id}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`Failed to fetch document ${doc.id}`)
        const data = await res.json()
        if (alive) setFull(data)
      } catch (e: any) {
        if (alive) setError(e?.message || 'Failed to load')
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => { alive = false }
  }, [doc.id])

  const previewStore = useMemo(() => {
    if (!full) return null
    const preloaded: any = {
      // Use reducer defaults for resume (includes history)
      settings: {
        ...(full.current?.settings || {}),
        editorZoom: 1,
      },
    }
    return createPreviewStore(preloaded)
  }, [full])

  const PreviewInit = ({ data }: { data: any }) => {
    const dispatch = useDispatch()
    useEffect(() => {
      if (!data?.current) return
      // Ensure settings and resume snapshot are hydrated into the preview store
      dispatch(hydrateSettings(data.current.settings || {}))
      dispatch(hydrateFromSnapshot({
        header: data.current.resume?.header || {},
        sections: Array.isArray(data.current.resume?.sections) ? data.current.resume.sections : [],
      }))
    }, [data, dispatch])
    return null
  }

  // Picker for template
  const TemplateRenderer = ({ resumeRef }: { resumeRef: React.RefObject<HTMLDivElement | null> }) => {
    const template = (full?.current?.settings?.template as string) || 'double-column'
    switch (template) {
      case 'elegant':
        return <ResumeTemplateElegant resumeRef={resumeRef} />
      case 'left-sidebar':
        return <ResumeTemplateLeftSidebar resumeRef={resumeRef} />
      default:
        return <ResumeTemplateDoubleColumn resumeRef={resumeRef} />
    }
  }

  const open = () => router.push(`/?cv=${doc.id}`)
  const onRename = async () => {
    const name = prompt("Rename document", doc.name || "Untitled Document")
    if (!name || !full) return
    try {
      await fetch(`/api/cv/${doc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rename', snapshotId: full.current.id, name })
      })
      // refresh meta locally
      setFull((prev: any) => prev ? { ...prev, current: { ...prev.current, name } } : prev)
    } catch (e) {
      console.warn('Rename failed', e)
    }
  }
  const onDelete = async () => {
    if (!confirm('Delete this document? This cannot be undone.')) return
    try {
      await fetch(`/api/cv/${doc.id}`, { method: 'DELETE' })
      if (onChange) onChange()
      else window.location.reload()
    } catch (e) {
      console.warn('Delete failed', e)
    }
  }

  return (
    <div className="border rounded-md overflow-hidden bg-white group cursor-pointer" onClick={open}>
      <div className="p-3">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate" title={full?.current?.name ?? doc.name ?? 'Untitled Document'}>
              {full?.current?.name ?? doc.name ?? 'Untitled Document'}
            </div>
            <div className="text-xs text-gray-500 truncate">Created {new Date(doc.createdAt).toLocaleString()}</div>
          </div>
          <div className="shrink-0 flex items-center gap-1">
            <button className="p-1 rounded hover:bg-gray-100 cursor-pointer" title="Rename" onClick={(e) => { e.stopPropagation(); onRename() }}>
              <Pencil size={16} />
            </button>
            <button className="p-1 rounded hover:bg-gray-100 cursor-pointer" title="Remove" onClick={(e) => { e.stopPropagation(); onDelete() }}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t p-3" ref={containerRef}>
        {/* Preview area: first page only by clipping the container, scaled to fit */}
        <div className="flex items-center justify-center">
          {loading && <div className="text-xs text-gray-500">Loading preview…</div>}
          {error && <div className="text-xs text-red-600">{error}</div>}
          {!loading && !error && full && previewStore && (
            <div
              className="rounded-md overflow-hidden shadow-md ring-1 ring-black/5 cursor-pointer"
              style={{ width: PREVIEW_W, height: PREVIEW_H }}
              onClick={open}
            >
              <div
                className="relative overflow-hidden"
                style={{ width: 794, height: 1123 }}
              >
                <div
                  className="pointer-events-none [&_img]:max-w-none [&_svg]:max-w-none"
                  style={{ width: 794, height: 1123, transform: `scale(${SCALE})`, transformOrigin: 'top left' }}
                >
                  <Provider store={previewStore}>
                    <PreviewInit data={full} />
                    <TemplateRenderer resumeRef={resumeRef} />
                  </Provider>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer removed: clicking the preview or header opens the doc */}
    </div>
  )
}
