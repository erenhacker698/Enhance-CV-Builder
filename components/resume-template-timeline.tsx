"use client"

import type React from "react"

import { useSelector, useDispatch } from "react-redux"
import { setActiveSection } from "@/lib/features/resume/resumeSlice"
import ResumeHeader from "@/components/resume-header"
import ResumeSection from "@/components/resume-section"
import type { RootState } from "@/lib/store"
import type { Section } from "@/lib/types"

interface ResumeTemplateTimelineProps {
    resumeRef: React.RefObject<HTMLDivElement>
}

export default function ResumeTemplateTimeline({ resumeRef }: ResumeTemplateTimelineProps) {
    const dispatch = useDispatch()
    const { sections, activeSectionId } = useSelector((state: RootState) => state.resume)

    const handleHeaderClick = () => {
        dispatch(setActiveSection({ sectionId: null }))
    }

    // For timeline template, we'll display sections in a specific order
    // Education and Experience sections first, then others
    const educationSections = sections.filter((s) => s.content.title.toUpperCase() === "EDUCATION")
    const experienceSections = sections.filter((s) => s.content.title.toUpperCase() === "EXPERIENCE")
    const otherSections = sections.filter(
        (s) => s.content.title.toUpperCase() !== "EDUCATION" && s.content.title.toUpperCase() !== "EXPERIENCE",
    )

    const timelineSections = [...educationSections, ...experienceSections]

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 min-h-[842px]" ref={resumeRef}>
            <div onClick={handleHeaderClick} className="flex items-start">
                <div className="flex-1">
                    <ResumeHeader isActive={activeSectionId === null} />
                </div>
            </div>

            <div className="mt-6 flex gap-6">
                {/* Timeline column (Education & Experience) */}
                <div className="flex-1 border-l-2 border-gray-200 pl-6 relative">
                    {timelineSections.map((section: Section) => (
                        <div key={section.id} className="mb-6 relative">
                            <div className="absolute -left-[29px] top-0 w-4 h-4 rounded-full bg-teal-500"></div>
                            <ResumeSection section={section} isActive={section.id === activeSectionId} />
                        </div>
                    ))}
                </div>

                {/* Other sections column */}
                <div className="flex-1">
                    {otherSections.map((section: Section) => (
                        <ResumeSection key={section.id} section={section} isActive={section.id === activeSectionId} />
                    ))}
                </div>
            </div>
        </div>
    )
}
