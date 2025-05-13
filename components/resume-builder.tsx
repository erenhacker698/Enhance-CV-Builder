"use client"

import type React from "react"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { reorderSections } from "@/lib/features/resume/resumeSlice"
import Sidebar from "@/components/sidebar"
import ResumeSection from "@/components/resume-section"
import { Button } from "@/components/ui/button"
import { Sun } from "lucide-react"

export default function ResumeBuilder() {
  const dispatch = useDispatch()
  const { sections, activeSectionId } = useSelector((state: RootState) => state.resume)
  const [draggedSection, setDraggedSection] = useState<string | null>(null)
  const [dragOverSection, setDragOverSection] = useState<string | null>(null)

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
      const oldIndex = sections.findIndex((section) => section.id === draggedSection)
      const newIndex = sections.findIndex((section) => section.id === dragOverSection)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = [...sections]
        const [movedSection] = newSections.splice(oldIndex, 1)
        newSections.splice(newIndex, 0, movedSection)

        dispatch(
          reorderSections({
            sections: newSections,
          }),
        )
      }
    }

    setDraggedSection(null)
    setDragOverSection(null)
  }

  const handleDragLeave = () => {
    setDragOverSection(null)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Sidebar />

      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 flex justify-end">
          <Button variant="outline" size="sm" className="theme-toggle text-gray-500">
            <Sun />
          </Button>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-8 min-h-[842px]">
          {sections.map((section) => (
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
              <ResumeSection section={section} isActive={section.id === activeSectionId} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
