"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import Sidebar from "@/components/sidebar"
import DesignFontPanel from "@/components/Common/Design/design-font-panel"
import ResumeTemplateDoubleColumn from "@/components/ResumeTemplates/resume-template-double-column"
import ResumeTemplateElegant from "@/components/ResumeTemplates/resume-template-elegant"
import ResumeTemplateLeftSidebar from "@/components/ResumeTemplates/resume-template-left-sidebar"
import { cn } from "@/lib/utils"
import { getCv, saveCv } from "@/lib/client/api"
import { hydrateFromSnapshot, setHistory } from "@/lib/features/resume/resumeSlice"
import { hydrateSettings, setCurrentCvId } from "@/lib/features/settings/settingsSlice"
import { store } from "@/lib/store"

export default function ResumeBuilder() {
  const dispatch = useDispatch()
  const resumeRef = useRef<HTMLDivElement>(null)
  const { template } = useSelector((state: RootState) => state.settings)
  const currentCvId = useSelector((state: RootState) => state.settings.currentCvId)

  useEffect(() => {
    const url = new URL(window.location.href)
    const id = url.searchParams.get("cv")
    if (!id) return
    (async () => {
      try {
        const doc = await getCv(id)
        dispatch(setCurrentCvId(doc.id))
        dispatch(hydrateFromSnapshot({ header: doc.current.resume.header, sections: doc.current.resume.sections }))
        dispatch(hydrateSettings(doc.current.settings || {}))
        if (doc.current.editHistory && Array.isArray(doc.current.editHistory.past) && Array.isArray(doc.current.editHistory.future)) {
          dispatch(setHistory({ past: doc.current.editHistory.past, future: doc.current.editHistory.future }))
        } else {
          // Explicitly clear local history if the snapshot doesn't carry any
          dispatch(setHistory({ past: [], future: [] }))
        }
        // Do not auto-open history; user can open it via the button
      } catch (e) {
        console.warn("Failed to load CV", e)
        // Clear current context if the document cannot be loaded
        dispatch(setCurrentCvId(null))
        dispatch(setHistory({ past: [], future: [] }))
        // also remove the cv param to avoid repeated attempts
        try {
          const url2 = new URL(window.location.href)
          url2.searchParams.delete('cv')
          window.history.replaceState({}, '', url2.toString())
        } catch {}
      }
    })()
  }, [dispatch])

  // Debounced autosave (does not create documents automatically)
  useEffect(() => {
    const t = setTimeout(async () => {
      const state = store.getState()
      try {
        if (currentCvId) {
          await saveCv(currentCvId, state)
        }
      } catch (e) {
        // If the doc was deleted, stop autosaving by clearing the id
        const msg = String(e || '')
        if (msg.includes('404') || msg.toLowerCase().includes('not found')) {
          dispatch(setCurrentCvId(''))
        }
        console.warn('Autosave failed', e)
      }
    }, 1500)
    return () => clearTimeout(t)
  }, [currentCvId, dispatch, template])

  const renderTemplate = () => {
    switch (template) {
      case "elegant":
        return <ResumeTemplateElegant resumeRef={resumeRef} />
      case "left-sidebar":
        return <ResumeTemplateLeftSidebar resumeRef={resumeRef} />
      case "double-column":
      default:
        return <ResumeTemplateDoubleColumn resumeRef={resumeRef} />
    }
  }

  return (
    <div className="grid grid-cols-1 items-start">
      {/* Left: Main menu (fixed, always visible) */}
      <div className="w-full md:w-[320px] md:fixed md:left-0 md:top-[64px] md:h-[calc(100vh-64px)] md:overflow-y-auto z-20">
        <Sidebar resumeRef={resumeRef} />
      </div>

      {/* Center: Document canvas (no inner scroll; page scroll only) */}
      <div className="resume-editor-wrapper min-w-0 w-full flex justify-center py-6 md:py-8 overflow-x-hidden overflow-y-visible relative z-0">
        {renderTemplate()}
      </div>

      {/* Right: Design & Font panel (fixed, always visible; widened; no inner scroll) */}
      <div className="w-full md:w-[380px] md:fixed md:right-0 md:top-[64px] md:h-[calc(100vh-64px)] md:overflow-visible md:overflow-x-hidden relative z-30 self-start">
        <DesignFontPanel />
      </div>
    </div>
  )
}
