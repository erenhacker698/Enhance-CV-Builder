"use client"

import type React from "react"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setActiveSection, reorderSections } from "@/lib/features/resume/resumeSlice"
import ResumeHeader from "@/components/resume-header"
import ResumeSection from "@/components/resume-section"
import type { RootState } from "@/lib/store"
import type { Section } from "@/lib/types"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { setAddSectionModal } from "@/lib/features/settings/settingsSlice"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface ResumeTemplateDoubleColumnProps {
    resumeRef: React.RefObject<HTMLDivElement>
}

export default function ResumeTemplateDoubleColumn({ resumeRef }: ResumeTemplateDoubleColumnProps) {
    const dispatch = useDispatch()
    const { sections, activeSectionId } = useSelector((state: RootState) => state.resume)
    const [draggedSection, setDraggedSection] = useState<string | null>(null)

    const handleHeaderClick = () => {
        dispatch(setActiveSection({ sectionId: null }))
    }

    const handleAddSectionClick = (column: "left" | "right") => {
        dispatch(setAddSectionModal({ isOpen: true, column }))
    }

    // Filter sections by column
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

        // If moving within the same column
        if (sourceDroppableId === destinationDroppableId) {
            const isLeftColumn = sourceDroppableId === "left-column"
            const columnSections = isLeftColumn ? [...leftSections] : [...rightSections]

            const [movedSection] = columnSections.splice(result.source.index, 1)
            columnSections.splice(result.destination.index, 0, movedSection)

            // Create a new array with all sections, replacing the reordered column
            const newSections = sections.filter((s) => s.column !== (isLeftColumn ? "left" : "right")).concat(columnSections)

            dispatch(reorderSections({ sections: newSections }))
        }
        // If moving between columns
        else {
            // Create copies to avoid modifying the original arrays
            const sourceList = sourceDroppableId === "left-column" ? [...leftSections] : [...rightSections]
            const destList = destinationDroppableId === "left-column" ? [...leftSections] : [...rightSections]

            // Find the moved section
            const movedSectionIndex = result.source.index
            const movedSection = sourceList[movedSectionIndex]

            if (!movedSection) return

            // Create a new section with updated column
            const newColumn = destinationDroppableId === "left-column" ? "left" : "right"
            const updatedSection: Section = {
                ...movedSection,
                column: newColumn,
            }

            // Remove from source list
            sourceList.splice(movedSectionIndex, 1)

            // Add to destination list at the specified index
            const destListCopy = [...destList]
            destListCopy.splice(result.destination.index, 0, updatedSection)

            // Create the final sections array
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
        <div className="max-w-4xl mx-auto bg-white p-8 min-h-[842px]" ref={resumeRef}>
            <div onClick={handleHeaderClick}>
                <ResumeHeader isActive={activeSectionId === null} />
            </div>

            <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="flex gap-6 mt-6">
                    {/* Left Column */}
                    <Droppable droppableId="left-column">
                        {(provided) => (
                            <div className="flex-1" ref={provided.innerRef} {...provided.droppableProps}>
                                {leftSections.map((section: Section, index) => (
                                    <Draggable
                                        key={section.id}
                                        draggableId={section.id}
                                        index={index}
                                        isDragDisabled={section.type === "text" && section.content.title.includes("SHARMA")}
                                    >
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
                                            className="w-full border-dashed border-gray-300"
                                            onClick={() => handleAddSectionClick("left")}
                                        >
                                            <Plus size={16} className="mr-2" /> Add Section
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </Droppable>

                    {/* Right Column */}
                    <Droppable droppableId="right-column">
                        {(provided) => (
                            <div className="flex-1" ref={provided.innerRef} {...provided.droppableProps}>
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
                                            className="w-full border-dashed border-gray-300"
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
            </DragDropContext>
        </div>
    )
}
