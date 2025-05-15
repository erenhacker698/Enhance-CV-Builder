"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { reorderSections } from "@/lib/features/resume/resumeSlice"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { X, GripVertical, Lock, ArrowRight, ArrowLeft } from "lucide-react"
import type { RootState } from "@/lib/store"
import type { Section } from "@/lib/types"

interface RearrangeSectionsModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function RearrangeSectionsModal({ isOpen, onClose }: RearrangeSectionsModalProps) {
    const dispatch = useDispatch()
    const { sections } = useSelector((state: RootState) => state.resume)
    const [leftSections, setLeftSections] = useState<Section[]>([])
    const [rightSections, setRightSections] = useState<Section[]>([])
    const [selectedSection, setSelectedSection] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen) {
            // Filter sections by column
            setLeftSections(sections.filter((section) => section.column === "left"))
            setRightSections(sections.filter((section) => section.column === "right"))
        }
    }, [isOpen, sections])

    const handleDragEnd = (result: any) => {
        if (!result.destination) return

        const sourceDroppableId = result.source.droppableId
        const destinationDroppableId = result.destination.droppableId

        // If moving within the same column
        if (sourceDroppableId === destinationDroppableId) {
            const isLeftColumn = sourceDroppableId === "left-sections"
            const currentSections = isLeftColumn ? [...leftSections] : [...rightSections]
            const [movedSection] = currentSections.splice(result.source.index, 1)
            currentSections.splice(result.destination.index, 0, movedSection)

            if (isLeftColumn) {
                setLeftSections(currentSections)
            } else {
                setRightSections(currentSections)
            }
        }
        // If moving between columns
        else {
            const sourceList = sourceDroppableId === "left-sections" ? [...leftSections] : [...rightSections]
            const destList = destinationDroppableId === "left-sections" ? [...leftSections] : [...rightSections]

            const [movedSection] = sourceList.splice(result.source.index, 1)
            // Update the column property of the moved section
            movedSection.column = destinationDroppableId === "left-sections" ? "left" : "right"

            destList.splice(result.destination.index, 0, movedSection)

            if (sourceDroppableId === "left-sections") {
                setLeftSections(sourceList)
                setRightSections(destList)
            } else {
                setLeftSections(destList)
                setRightSections(sourceList)
            }
        }
    }

    const handleSave = () => {
        // Combine both columns and update the Redux store
        const updatedSections = [...leftSections, ...rightSections]
        dispatch(reorderSections({ sections: updatedSections }))
        onClose()
    }

    const handleMoveToColumn = (sectionId: string, targetColumn: "left" | "right") => {
        const sourceList = targetColumn === "right" ? leftSections : rightSections
        const destList = targetColumn === "right" ? rightSections : leftSections

        const sectionIndex = sourceList.findIndex((s) => s.id === sectionId)
        if (sectionIndex === -1) return

        const [movedSection] = sourceList.splice(sectionIndex, 1)
        movedSection.column = targetColumn
        destList.push(movedSection)

        setLeftSections(targetColumn === "right" ? [...sourceList] : [...destList])
        setRightSections(targetColumn === "right" ? [...destList] : [...sourceList])
    }

    const getSectionTitle = (section: Section) => {
        if (section.type === "text" && section.content.title === "OM SHARMA") {
            return "Header"
        }
        return section.content.title
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-xl">Hold & Drag the boxes to rearrange the sections</DialogTitle>
                    <div className="text-sm text-gray-500 mt-1">Page 1 of 1</div>
                </DialogHeader>

                <div className="flex gap-4">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        {/* Left Column */}
                        <div className="flex-1 border rounded-md p-4 bg-white">
                            <h3 className="font-medium mb-2 text-center border-b pb-2">Left Column</h3>
                            <Droppable droppableId="left-sections">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 min-h-[300px]">
                                        {leftSections.map((section, index) => {
                                            const isHeader = getSectionTitle(section) === "Header"
                                            return (
                                                <Draggable key={section.id} draggableId={section.id} index={index} isDragDisabled={isHeader}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`
                                p-3 rounded-md flex items-center justify-between
                                ${isHeader ? "bg-blue-100" : "bg-blue-50"}
                                ${selectedSection === section.id ? "bg-teal-500 text-white" : ""}
                                ${snapshot.isDragging ? "shadow-lg" : ""}
                              `}
                                                            onClick={() => setSelectedSection(section.id)}
                                                        >
                                                            <div className="flex items-center flex-1">
                                                                {isHeader ? (
                                                                    <Lock size={16} className="mr-2" />
                                                                ) : (
                                                                    <div {...provided.dragHandleProps}>
                                                                        <GripVertical size={16} className="mr-2" />
                                                                    </div>
                                                                )}
                                                                <span className="truncate">{getSectionTitle(section)}</span>
                                                            </div>

                                                            {!isHeader && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6 ml-2 hover:bg-teal-600/20"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        handleMoveToColumn(section.id, "right")
                                                                    }}
                                                                >
                                                                    <ArrowRight size={14} />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        {/* Right Column */}
                        <div className="flex-1 border rounded-md p-4 bg-white">
                            <h3 className="font-medium mb-2 text-center border-b pb-2">Right Column</h3>
                            <Droppable droppableId="right-sections">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 min-h-[300px]">
                                        {rightSections.map((section, index) => (
                                            <Draggable key={section.id} draggableId={section.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`
                              p-3 rounded-md flex items-center justify-between
                              bg-blue-50
                              ${selectedSection === section.id ? "bg-teal-500 text-white" : ""}
                              ${snapshot.isDragging ? "shadow-lg" : ""}
                            `}
                                                        onClick={() => setSelectedSection(section.id)}
                                                    >
                                                        <div className="flex items-center flex-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 mr-2 hover:bg-teal-600/20"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleMoveToColumn(section.id, "left")
                                                                }}
                                                            >
                                                                <ArrowLeft size={14} />
                                                            </Button>

                                                            <div {...provided.dragHandleProps}>
                                                                <GripVertical size={16} className="mr-2" />
                                                            </div>
                                                            <span className="truncate">{getSectionTitle(section)}</span>
                                                        </div>

                                                        {selectedSection === section.id && (
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-teal-600">
                                                                <X size={14} />
                                                            </Button>
                                                        )}
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

                <div className="flex justify-center mt-4">
                    <Button onClick={handleSave} className="bg-teal-500 hover:bg-teal-600">
                        Continue Editing
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
