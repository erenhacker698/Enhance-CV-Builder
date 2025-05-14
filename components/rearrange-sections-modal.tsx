"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { reorderSections } from "@/lib/features/resume/resumeSlice"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { X, GripVertical, Lock } from "lucide-react"
import type { RootState } from "@/lib/store"
import type { Section } from "@/lib/types"

interface RearrangeSectionsModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function RearrangeSectionsModal({ isOpen, onClose }: RearrangeSectionsModalProps) {
    const dispatch = useDispatch()
    const { sections } = useSelector((state: RootState) => state.resume)
    const [localSections, setLocalSections] = useState<Section[]>([])
    const [selectedSection, setSelectedSection] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen) {
            setLocalSections([...sections])
        }
    }, [isOpen, sections])

    const handleDragEnd = (result: any) => {
        if (!result.destination) return

        const items = Array.from(localSections)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setLocalSections(items)
    }

    const handleSave = () => {
        dispatch(reorderSections({ sections: localSections }))
        onClose()
    }

    const getSectionTitle = (section: Section) => {
        if (section.type === "text" && section.content.title === "OM SHARMA") {
            return "Header"
        }
        return section.content.title
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-xl">Hold & Drag the boxes to rearrange the sections</DialogTitle>
                    <div className="text-sm text-gray-500 mt-1">Page 1 of 1</div>
                </DialogHeader>

                <div className="border rounded-md p-4 bg-white">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="sections">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-2 gap-2">
                                    {localSections.map((section, index) => {
                                        const isHeader = getSectionTitle(section) === "Header"
                                        return (
                                            <Draggable key={section.id} draggableId={section.id} index={index} isDragDisabled={isHeader}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`
                              p-3 rounded-md flex items-center justify-between
                              ${isHeader ? "col-span-2 bg-blue-100" : "bg-blue-50"}
                              ${selectedSection === section.id ? "bg-teal-500 text-white" : ""}
                              ${snapshot.isDragging ? "shadow-lg" : ""}
                            `}
                                                        onClick={() => setSelectedSection(section.id)}
                                                    >
                                                        <div className="flex items-center">
                                                            {isHeader ? (
                                                                <Lock size={16} className="mr-2" />
                                                            ) : (
                                                                <div {...provided.dragHandleProps}>
                                                                    <GripVertical size={16} className="mr-2" />
                                                                </div>
                                                            )}
                                                            <span>{getSectionTitle(section)}</span>
                                                        </div>
                                                        {selectedSection === section.id && !isHeader && (
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-teal-600">
                                                                <X size={14} />
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
