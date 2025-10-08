"use client"

import type React from "react"

import { useRef } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import Sidebar from "@/components/sidebar"
import ResumeTemplateDoubleColumn from "@/components/ResumeTemplates/resume-template-double-column"
import ResumeTemplateElegant from "@/components/ResumeTemplates/resume-template-elegant"
import { cn } from "@/lib/utils"

export default function ResumeBuilder() {
  const resumeRef = useRef<HTMLDivElement>(null)
  const { template } = useSelector((state: RootState) => state.settings)

  const renderTemplate = () => {
    switch (template) {
      case "elegant":
        return <ResumeTemplateElegant resumeRef={resumeRef} />
      case "double-column":
      default:
        return <ResumeTemplateDoubleColumn resumeRef={resumeRef} />
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-8">
      <Sidebar resumeRef={resumeRef} />
      <div className="resume-editor-wrapper flex-1 flex justify-center py-8 overflow-y-auto">
        {renderTemplate()}
      </div>
    </div>
  )
}
