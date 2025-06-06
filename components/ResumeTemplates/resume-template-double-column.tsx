"use client"

import type React from "react"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { reorderSections, upsertActiveSection } from "@/lib/features/resume/resumeSlice"
import ResumeHeader from "@/components/resume-header"
import ResumeSection from "@/components/resume-section"
import type { RootState } from "@/lib/store"
import type { Section } from "@/lib/types"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { setAddSectionModal } from "@/lib/features/settings/settingsSlice"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import EducationSection from "../Sections/Education/education-section"
import ProjectSection from "../Sections/Projects/projects-section"
import LanguageSection from "../Sections/Language/language-section"
import SkillsSection from "../Sections/Skills/skills-section"

interface ResumeTemplateProps {
    resumeRef: React.RefObject<HTMLDivElement | null>
}

export default function ResumeTemplateDoubleColumn({ resumeRef }: ResumeTemplateProps) {
    const dispatch = useDispatch()
    const activeSection = useSelector((state: RootState) => state.resume.activeSection)
    const { sections } = useSelector((state: RootState) => state.resume)
    const [draggedSection, setDraggedSection] = useState<string | null>(null)

    const handleHeaderClick = () => {
        dispatch(upsertActiveSection({ activeSection: null }))
    }

    const handleAddSectionClick = (column: "left" | "right") => {
        dispatch(setAddSectionModal({ isOpen: true, column }))
    }

    const leftSections = sections.filter((section) => section.column === "left")
    const rightSections = sections.filter((section) => section.column === "right")

    const handleDragStart = (result: any) => {
        setDraggedSection(result.draggableId)
    }

    const handleDragEnd = (result: any) => {
        setDraggedSection(null)

        if (!result.destination) return

        const sourceDroppableId = result.source.droppableId
        const destinationDroppableId = result.destination.droppableId

        if (sourceDroppableId === destinationDroppableId) {
            const isLeftColumn = sourceDroppableId === "left-column"
            const columnSections = isLeftColumn ? [...leftSections] : [...rightSections]

            const [movedSection] = columnSections.splice(result.source.index, 1)
            columnSections.splice(result.destination.index, 0, movedSection)

            const newSections = sections.filter((s) => s.column !== (isLeftColumn ? "left" : "right")).concat(columnSections)

            dispatch(reorderSections({ sections: newSections }))
        }

        else {

            const sourceList = sourceDroppableId === "left-column" ? [...leftSections] : [...rightSections]
            const destList = destinationDroppableId === "left-column" ? [...leftSections] : [...rightSections]

            const movedSectionIndex = result.source.index
            const movedSection = sourceList[movedSectionIndex]

            if (!movedSection) return

            const newColumn = destinationDroppableId === "left-column" ? "left" : "right"
            const updatedSection: Section = {
                ...movedSection,
                column: newColumn,
            }

            sourceList.splice(movedSectionIndex, 1)

            const destListCopy = [...destList]
            destListCopy.splice(result.destination.index, 0, updatedSection)

            let newSections: Section[] = []

            if (sourceDroppableId === "left-column" && destinationDroppableId === "right-column") {
                newSections = [
                    ...sections.filter((s) => s.column !== "left" && s.column !== "right"),
                    ...sourceList,
                    ...destListCopy,
                ]
            } else {
                newSections = [
                    ...sections.filter((s) => s.column !== "left" && s.column !== "right"),
                    ...destListCopy,
                    ...sourceList,
                ]
            }

            dispatch(reorderSections({ sections: newSections }))
        }
    }

    return (
        <div id="resume-container" className={cn("resume-container resume-page-wrapper", activeSection?.id !== null && "resume-editor-overlay-later")} ref={resumeRef}>
            <div onClick={handleHeaderClick}>
                <ResumeHeader isActive={activeSection?.id === null} />
            </div>

            <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Left Column */}
                    <Droppable droppableId="left-column">
                        {(provided) => (
                            <div className="left-column-side" ref={provided.innerRef} {...provided.droppableProps}>
                                {leftSections.map((section: Section, index) => (
                                    <Draggable
                                        key={section.id}
                                        draggableId={section.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                                            >
                                                <ResumeSection section={section} isActive={section.id === activeSection?.id} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    {/* Right Column */}
                    <Droppable droppableId="right-column">
                        {(provided) => (
                            <div className="right-column-side" ref={provided.innerRef} {...provided.droppableProps}>
                                {rightSections.map((section: Section, index) => (
                                    <Draggable key={section.id} draggableId={section.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                                            >
                                                <ResumeSection section={section} isActive={section.id === activeSection?.id} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </div>
    )
}
