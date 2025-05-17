"use client"

import type React from "react"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setActiveSection, reorderSections } from "@/lib/features/resume/resumeSlice"
import ResumeHeader from "@/components/resume-header"
import ResumeSection from "@/components/resume-section"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { RootState } from "@/lib/store"
import type { Section } from "@/lib/types"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { setAddSectionModal } from "@/lib/features/settings/settingsSlice"
import { cn } from "@/lib/utils"

interface ResumeTemplateProps {
    resumeRef: React.RefObject<HTMLDivElement | null>
}

export default function ResumeTemplateTimeline({ resumeRef }: ResumeTemplateProps) {
    const dispatch = useDispatch()
    const { sections, activeSectionId } = useSelector((state: RootState) => state.resume)
    const [draggedSection, setDraggedSection] = useState<string | null>(null)

    const handleHeaderClick = () => {
        dispatch(setActiveSection({ sectionId: null }))
    }

    // For timeline template, we'll display sections in a specific order
    // Education and Experience sections first, then others
    const educationSections = sections.filter(
        (s) => s.content.title.toUpperCase().includes("EDUCATION") && s.column === "left",
    )
    const experienceSections = sections.filter(
        (s) => s.content.title.toUpperCase().includes("EXPERIENCE") && s.column === "left",
    )
    const timelineSections = [...educationSections, ...experienceSections]

    const otherLeftSections = sections.filter(
        (s) =>
            s.column === "left" &&
            !s.content.title.toUpperCase().includes("EDUCATION") &&
            !s.content.title.toUpperCase().includes("EXPERIENCE") &&
            !s.content.title.includes("SHARMA"),
    )

    const rightSections = sections.filter((s) => s.column === "right")

    const handleDragStart = (result: any) => {
        setDraggedSection(result.draggableId)
    }

    const handleDragEnd = (result: any) => {
        setDraggedSection(null)

        if (!result.destination) return

        const sourceDroppableId = result.source.droppableId
        const destinationDroppableId = result.destination.droppableId

        // If moving within the same column
        if (sourceDroppableId === destinationDroppableId) {
            // Handle movement within the same column type
            if (sourceDroppableId === "timeline-sections") {
                const updatedTimelineSections = [...timelineSections]
                const [movedSection] = updatedTimelineSections.splice(result.source.index, 1)
                updatedTimelineSections.splice(result.destination.index, 0, movedSection)

                // Create a new sections array with everything else + updated timeline sections
                const newSections = [
                    ...sections.filter((s) => !timelineSections.some((ts) => ts.id === s.id)),
                    ...updatedTimelineSections,
                ]

                dispatch(reorderSections({ sections: newSections }))
            } else if (sourceDroppableId === "other-left-sections") {
                const updatedOtherLeftSections = [...otherLeftSections]
                const [movedSection] = updatedOtherLeftSections.splice(result.source.index, 1)
                updatedOtherLeftSections.splice(result.destination.index, 0, movedSection)

                // Create a new sections array with everything else + updated other left sections
                const newSections = [
                    ...sections.filter((s) => !otherLeftSections.some((os) => os.id === s.id)),
                    ...updatedOtherLeftSections,
                ]

                dispatch(reorderSections({ sections: newSections }))
            } else if (sourceDroppableId === "right-sections") {
                const updatedRightSections = [...rightSections]
                const [movedSection] = updatedRightSections.splice(result.source.index, 1)
                updatedRightSections.splice(result.destination.index, 0, movedSection)

                // Create a new sections array with everything else + updated right sections
                const newSections = [
                    ...sections.filter((s) => !rightSections.some((rs) => rs.id === s.id)),
                    ...updatedRightSections,
                ]

                dispatch(reorderSections({ sections: newSections }))
            }
        }
        // If moving between columns
        else {
            // Get the section from the source droppable
            let movedSection: Section | undefined

            if (sourceDroppableId === "timeline-sections") {
                movedSection = timelineSections[result.source.index]
            } else if (sourceDroppableId === "other-left-sections") {
                movedSection = otherLeftSections[result.source.index]
            } else if (sourceDroppableId === "right-sections") {
                movedSection = rightSections[result.source.index]
            }

            if (!movedSection) return

            // Create a copy of the section with updated column
            const newColumn = destinationDroppableId === "right-sections" ? "right" : "left"
            const updatedSection: Section = {
                ...movedSection,
                column: newColumn,
            }

            // Create a new sections array
            const newSections = sections.map((s) => (s.id === movedSection?.id ? updatedSection : s))

            dispatch(reorderSections({ sections: newSections }))
        }
    }

    const handleAddSectionClick = (column: "left" | "right") => {
        dispatch(setAddSectionModal({ isOpen: true, column }))
    }

    return (
        <div id="resume-container" className={cn("w-full mx-auto bg-white p-2 md:p-9 min-h-[842px]", activeSectionId !== null && "resume-editor-overlay")} ref={resumeRef}>
            <div onClick={handleHeaderClick}>
                <ResumeHeader isActive={activeSectionId === null} />
            </div>

            <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="mt-6 flex flex-col md:flex-row gap-6">
                    {/* Left column */}
                    <div className="w-2/3">
                        {/* Timeline sections */}
                        <Droppable droppableId="timeline-sections">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="mb-8">
                                    {timelineSections.map((section: Section, index) => (
                                        <Draggable key={section.id} draggableId={section.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`${snapshot.isDragging ? "opacity-50" : ""} mb-6`}
                                                >
                                                    <h2 className="text-xl font-bold uppercase mb-4 border-b border-gray-800 pb-2">
                                                        {section.content.title}
                                                    </h2>

                                                    {section.content.entries?.map((entry, entryIndex) => (
                                                        <div key={entry.id} className="flex mb-6">
                                                            <div className="w-1/4 pr-4">
                                                                <div className="font-medium">{entry.dateRange}</div>
                                                                <div className="text-gray-600">{entry.location}</div>
                                                            </div>
                                                            <div className="w-3/4 relative pl-6 border-l-2 border-gray-200">
                                                                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-teal-500"></div>
                                                                <div className="font-medium text-teal-600">{entry.title}</div>
                                                                <div className="font-medium">{entry.subtitle}</div>
                                                                <div className="mt-2 text-sm">{entry.description}</div>
                                                                {entry.bullets && entry.bullets.length > 0 && (
                                                                    <ul className="list-disc pl-5 mt-2">
                                                                        {entry.bullets.map((bullet, i) => (
                                                                            <li key={i} className="text-sm">
                                                                                {bullet}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        {/* Other left column sections */}
                        <Droppable droppableId="other-left-sections">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {otherLeftSections.map((section: Section, index) => (
                                        <Draggable key={section.id} draggableId={section.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                                                >
                                                    <ResumeSection section={section} isActive={section.id === activeSectionId} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}

                                    {activeSectionId && (
                                        <div className="mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-auto flex mx-auto border-dashed border-gray-300"
                                                onClick={() => handleAddSectionClick("left")}
                                            >
                                                <Plus size={16} className="mr-2" /> Add Section
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    {/* Right column */}
                    <div className="w-1/3">
                        <Droppable droppableId="right-sections">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {rightSections.map((section: Section, index) => (
                                        <Draggable key={section.id} draggableId={section.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                                                >
                                                    <ResumeSection section={section} isActive={section.id === activeSectionId} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}

                                    {activeSectionId && (
                                        <div className="mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-auto flex mx-auto border-dashed border-gray-300"
                                                onClick={() => handleAddSectionClick("right")}
                                            >
                                                <Plus size={16} className="mr-2" /> Add Section
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            </DragDropContext>
        </div>
    )
}
