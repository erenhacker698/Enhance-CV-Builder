"use client"

import type React from "react"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setActiveSection, reorderSections } from "@/lib/features/resume/resumeSlice"
import ResumeSection from "@/components/resume-section"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { RootState } from "@/lib/store"
import type { Section } from "@/lib/types"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import ResumeHeader from "@/components/resume-header"
import { setAddSectionModal } from "@/lib/features/settings/settingsSlice"
import { cn } from "@/lib/utils"

interface ResumeTemplateProps {
    resumeRef: React.RefObject<HTMLDivElement | null>
}

export default function ResumeTemplateElegant({ resumeRef }: ResumeTemplateProps) {
    const dispatch = useDispatch()
    const { sections, activeSectionId } = useSelector((state: RootState) => state.resume)
    const { header } = useSelector((state: RootState) => state.resume)
    const [draggedSection, setDraggedSection] = useState<string | null>(null)

    const handleHeaderClick = () => {
        dispatch(setActiveSection({ sectionId: null }))
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

    const handleAddSectionClick = (column: "left" | "right") => {
        dispatch(setAddSectionModal({ isOpen: true, column }))
    }

    const handlePhotoClick = () => {
        if (activeSectionId === null) {
            const event = new CustomEvent("openPhotoUpload", {})
            window.dispatchEvent(event)
        }
    }

    return (
        <div id="resume-container" className={cn("w-full mx-auto bg-white p-0 min-h-[842px] flex", activeSectionId !== null && "resume-editor-overlay")} ref={resumeRef}>
            <div className="w-[65%] p-8">
                {/* Header - Name and title only */}
                <div onClick={handleHeaderClick}>
                    <ResumeHeader isActive={activeSectionId === null} hidePhoto={true} />
                </div>

                <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <Droppable droppableId="left-column">
                        {(provided) => (
                            <div className="mt-6" ref={provided.innerRef} {...provided.droppableProps}>
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
                </DragDropContext>
            </div>

            <div className="w-[35%] bg-slate-800 text-white p-8 pt-14">
                {/* Profile photo in sidebar */}
                {header.visibility.photo && (
                    <div className="flex justify-center mb-8" onClick={handleHeaderClick}>
                        <div
                            className={`w-32 h-32 ${header.roundPhoto ? "rounded-full" : "rounded-md"
                                } overflow-hidden bg-gray-200 cursor-pointer`}
                            onClick={handlePhotoClick}
                        >
                            {header.photoUrl ? (
                                <img src={header.photoUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <circle
                                            cx="12"
                                            cy="7"
                                            r="4"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <Droppable droppableId="right-column">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-6">
                                {rightSections.map((section: Section, index) => (
                                    <Draggable key={section.id} draggableId={section.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                                            >
                                                <div className="mb-6">
                                                    <h2 className="text-xl font-bold uppercase mb-4 border-b border-slate-600 pb-2">
                                                        {section.content.title}
                                                    </h2>
                                                    <ResumeSection
                                                        section={{ ...section, content: { ...section.content, title: "" } }}
                                                        isActive={section.id === activeSectionId}
                                                        darkMode={true}
                                                    />
                                                </div>
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
                                            className="w-auto flex mx-auto border-dashed border-slate-600 text-white hover:bg-slate-700"
                                            onClick={() => handleAddSectionClick("right")}
                                        >
                                            <Plus size={16} className="mr-2" /> Add Section
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    )
}
