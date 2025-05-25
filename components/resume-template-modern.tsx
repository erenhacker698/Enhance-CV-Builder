"use client"

import type React from "react"

import { useSelector, useDispatch } from "react-redux"
import { setActiveSection } from "@/lib/features/resume/resumeSlice"
import ResumeHeader from "@/components/resume-header"
import ResumeSection from "@/components/resume-section"
import type { RootState } from "@/lib/store"
import type { Section } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ResumeTemplateModernProps {
    resumeRef: React.RefObject<HTMLDivElement>
}

export default function ResumeTemplateModern({ resumeRef }: ResumeTemplateModernProps) {
    const dispatch = useDispatch()
    const { sections, activeSectionId } = useSelector((state: RootState) => state.resume)

    const handleHeaderClick = () => {
        dispatch(setActiveSection({ sectionId: null }))
    }

    // For modern template, we'll display all sections in a single column
    // but maintain their original column property for consistency
    const allSections = [...sections].sort((a, b) => {
        // Sort by column first (left comes before right)
        if (a.column !== b.column) {
            return a.column === "left" ? -1 : 1
        }
        // If same column, maintain original order
        return sections.indexOf(a) - sections.indexOf(b)
    })

    return (
        <div className={cn("w-full mx-auto bg-white p-2 md:p-9 min-h-[842px]", activeSectionId !== null && "resume-editor-overlay-later")} ref={resumeRef}>
            <div onClick={handleHeaderClick} className="flex items-start">
                <div className="flex-1">
                    <ResumeHeader isActive={activeSectionId === null} />
                </div>
            </div>

            <div className="mt-6">
                {allSections.map((section: Section) => (
                    <ResumeSection key={section.id} section={section} isActive={section.id === activeSectionId} />
                ))}
            </div>
        </div>
    )
}
