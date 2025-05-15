"use client"

import { useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import Sidebar from "@/components/sidebar"
import AddSectionModal from "@/components/add-section-modal"
import PDFExportButton from "@/components/pdf-export-button"
import TemplatesModal from "@/components/templates-modal"
import ResumeTemplateStandard from "@/components/resume-template-standard"
import ResumeTemplateModern from "@/components/resume-template-modern"
import ResumeTemplateTimeline from "@/components/resume-template-timeline"
import { Button } from "@/components/ui/button"

export default function ResumeBuilder() {
  const { template } = useSelector((state: RootState) => state.settings)
  const [showAddSectionModal, setShowAddSectionModal] = useState(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)
  const [addToColumn, setAddToColumn] = useState<"left" | "right">("left")
  const resumeRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  const handleAddSectionClick = (column: "left" | "right") => {
    setAddToColumn(column)
    setShowAddSectionModal(true)
  }

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ResumeTemplateModern resumeRef={resumeRef} />
      case "timeline":
        return <ResumeTemplateTimeline resumeRef={resumeRef} />
      case "standard":
      default:
        return <ResumeTemplateStandard resumeRef={resumeRef} />
    }
  }

  return (
    <div className="flex gap-4">
      <Sidebar onTemplatesClick={() => setShowTemplatesModal(true)} />

      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowTemplatesModal(true)} className="flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="2" />
              </svg>
              Templates
            </Button>
            <Button variant="outline" onClick={() => handleAddSectionClick("left")} className="flex items-center gap-1">
              Add Section
            </Button>
          </div>

          <PDFExportButton resumeRef={resumeRef} />
        </div>

        {renderTemplate()}
      </div>

      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        column={addToColumn}
      />

      <TemplatesModal isOpen={showTemplatesModal} onClose={() => setShowTemplatesModal(false)} />
    </div>
  )
}
