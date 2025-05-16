"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import Sidebar from "@/components/sidebar"
import PDFExportButton from "@/components/pdf-export-button"
import ResumeTemplateDoubleColumn from "@/components/resume-template-double-column"
import ResumeTemplateElegant from "@/components/resume-template-elegant"
import ResumeTemplateTimeline from "@/components/resume-template-timeline"
import { undo, redo } from "@/lib/features/resume/resumeSlice"

export default function ResumeBuilder() {
  const dispatch = useDispatch()
  const { template } = useSelector((state: RootState) => state.settings)
  const { history } = useSelector((state: RootState) => state.resume)
  const resumeRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)

  const handleAddSectionClick = (column: "left" | "right") => {
    dispatch({
      type: "resume/setAddSectionModal",
      payload: { isOpen: true, column },
    })
  }

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  const handleUndo = () => {
    dispatch(undo())
  }

  const handleRedo = () => {
    dispatch(redo())
  }

  // Listen for addSection events from templates
  useEffect(() => {
    const handleAddSectionEvent = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail && customEvent.detail.column) {
        handleAddSectionClick(customEvent.detail.column)
      }
    }

    window.addEventListener("addSection", handleAddSectionEvent)

    return () => {
      window.removeEventListener("addSection", handleAddSectionEvent)
    }
  }, [])

  // Render the appropriate template based on settings
  const renderTemplate = () => {
    switch (template) {
      case "elegant":
        return <ResumeTemplateElegant resumeRef={resumeRef} />
      case "timeline":
        return <ResumeTemplateTimeline resumeRef={resumeRef} />
      case "double-column":
      default:
        return <ResumeTemplateDoubleColumn resumeRef={resumeRef} />
    }
  }

  return (
    <div className="flex gap-4">
      <Sidebar />

      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden p-3">
        {renderTemplate()}
      </div>
    </div>
  )
}
