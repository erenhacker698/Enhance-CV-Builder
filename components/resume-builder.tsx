"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import Sidebar from "@/components/sidebar"
import ResumeTemplateDoubleColumn from "@/components/resume-template-double-column"
import ResumeTemplateElegant from "@/components/resume-template-elegant"
import ResumeTemplateTimeline from "@/components/resume-template-timeline"
import { cn } from "@/lib/utils"

export default function ResumeBuilder() {
  const dispatch = useDispatch()
  const { template } = useSelector((state: RootState) => state.settings)
  const resumeRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  const handleAddSectionClick = (column: "left" | "right") => {
    dispatch({
      type: "resume/setAddSectionModal",
      payload: { isOpen: true, column },
    })
  }

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
    <div className="flex flex-col md:flex-row gap-4">
      <Sidebar resumeRef={resumeRef} />

      <div className={cn("flex-1 bg-white shadow-md overflow-hidden relative")}>
        {renderTemplate()}
      </div>
    </div>
  )
}
