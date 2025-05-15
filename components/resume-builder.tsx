"use client"

import type React from "react"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { setActiveSection, reorderSections } from "@/lib/features/resume/resumeSlice"
import Sidebar from "@/components/sidebar"
import ResumeHeader from "@/components/resume-header"
import ResumeSection from "@/components/resume-section"
import AddSectionModal from "@/components/add-section-modal"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import type { Section } from "@/lib/types"

export default function ResumeBuilder() {
  const dispatch = useDispatch()
  const { header, sections, activeSectionId } = useSelector((state: RootState) => state.resume)
  const [showAddSectionModal, setShowAddSectionModal] = useState(false)
  const [addToColumn, setAddToColumn] = useState<"left" | "right">("left")
  const [draggedSection, setDraggedSection] = useState<string | null>(null)
  const [dragOverSection, setDragOverSection] = useState<string | null>(null)

  const handleHeaderClick = () => {
    dispatch(setActiveSection({ sectionId: null }))
  }

  const handleAddSectionClick = (column: "left" | "right") => {
    setAddToColumn(column)
    setShowAddSectionModal(true)
  }

  // Filter sections by column
  const leftSections = sections.filter((section) => section.column === "left")
  const rightSections = sections.filter((section) => section.column === "right")

  // Drag and drop handlers
  const handleDragStart = (sectionId: string) => {
    setDraggedSection(sectionId)
  }

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault()
    if (draggedSection !== sectionId) {
      setDragOverSection(sectionId)
    }
  }

  const handleDragEnd = () => {
    if (draggedSection && dragOverSection) {
      const draggedSectionObj = sections.find((s) => s.id === draggedSection)
      const dragOverSectionObj = sections.find((s) => s.id === dragOverSection)

      if (draggedSectionObj && dragOverSectionObj && draggedSectionObj.column === dragOverSectionObj.column) {
        const column = draggedSectionObj.column
        const columnSections = sections.filter((s) => s.column === column)

        const oldIndex = columnSections.findIndex((s) => s.id === draggedSection)
        const newIndex = columnSections.findIndex((s) => s.id === dragOverSection)

        if (oldIndex !== -1 && newIndex !== -1) {
          // Create a new array with the reordered sections
          const newColumnSections = [...columnSections]
          const [movedSection] = newColumnSections.splice(oldIndex, 1)
          newColumnSections.splice(newIndex, 0, movedSection)

          // Create a new array with all sections, replacing the reordered column
          const newSections = sections.filter((s) => s.column !== column).concat(newColumnSections)

          dispatch(reorderSections({ sections: newSections }))
        }
      }
    }

    setDraggedSection(null)
    setDragOverSection(null)
  }

  const handleDragLeave = () => {
    setDragOverSection(null)
  }

  // Render a column of sections
  const renderSectionColumn = (columnSections: Section[], column: "left" | "right") => {
    return (
      <div className="flex-1">
        {columnSections.length > 0 ? (
          columnSections.map((section) => (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(section.id)}
              onDragOver={(e) => handleDragOver(e, section.id)}
              onDragEnd={handleDragEnd}
              onDragLeave={handleDragLeave}
              className={`${dragOverSection === section.id ? "border-2 border-teal-500 rounded-md" : ""} ${draggedSection === section.id ? "opacity-50" : ""
                }`}
            >
              <ResumeSection
                key={section.id}
                section={section}
                isActive={section.id === activeSectionId}
                onDragStart={handleDragStart}
              />
            </div>
          ))
        ) : (
          <div className="bg-gray-100 rounded-md p-8 flex flex-col items-center justify-center min-h-[200px]">
            <Button
              variant="default"
              onClick={() => handleAddSectionClick(column)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Add New Section
            </Button>
          </div>
        )}

        {columnSections.length > 0 && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => handleAddSectionClick(column)} className="flex items-center gap-1">
              <PlusCircle size={16} />
              Add New Section
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      <Sidebar />

      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 flex justify-end">
          <Button variant="outline" size="sm" className="text-gray-500">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
            >
              <path
                d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M4.93 4.93L6.34 6.34"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.66 17.66L19.07 19.07"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M6.34 17.66L4.93 19.07"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.07 4.93L17.66 6.34"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-8 min-h-[842px]">
          <div onClick={handleHeaderClick}>
            <ResumeHeader isActive={activeSectionId === null} />
          </div>

          <div className="flex gap-6 mt-6">
            {/* Left Column */}
            {renderSectionColumn(leftSections, "left")}

            {/* Right Column */}
            {renderSectionColumn(rightSections, "right")}
          </div>
        </div>
      </div>

      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        column={addToColumn}
      />
    </div>
  )
}
