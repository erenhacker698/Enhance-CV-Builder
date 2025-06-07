"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import Sidebar from "@/components/sidebar"
import ResumeTemplateDoubleColumn from "@/components/ResumeTemplates/resume-template-double-column"
import ResumeTemplateElegant from "@/components/ResumeTemplates/resume-template-elegant"
// import ResumeTemplateTimeline from "@/components/resume-template-timeline"
import { cn } from "@/lib/utils"

export default function ResumeBuilder() {
  const dispatch = useDispatch()
  const { template } = useSelector((state: RootState) => state.settings)
  const activeSection = useSelector((state: RootState) => state.resume.activeSection)
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
      // case "timeline":
      //   return <ResumeTemplateTimeline resumeRef={resumeRef} />
      case "double-column":
      default:
        return <ResumeTemplateDoubleColumn resumeRef={resumeRef} />
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-8">
      <Sidebar resumeRef={resumeRef} />

      <div className="resume-editor-wrapper flex flex-row flex-wrap items-center justify-center relative z-[1] w-full md:w-[890px]">
        <div className={cn("resume-renderer-page browser-resume-page browserResumePage relative h-full pt-4 px-4 pb-0 lg:pt-9 lg:px-9", activeSection?.id && 'resume-editor-overlay')}>
          {renderTemplate()}
        </div>
      </div>

    </div>
  )
}
