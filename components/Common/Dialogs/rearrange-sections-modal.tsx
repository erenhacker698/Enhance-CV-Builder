"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { reorderSections } from "@/lib/features/resume/resumeSlice"
import { Lock, GripVertical } from "lucide-react"
import type { RootState } from "@/lib/store"
import type { Section, SectionTypeEnum } from "@/lib/types"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { cn } from "@/lib/utils"

interface RearrangeSectionsModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function RearrangeSectionsModal({ isOpen, onClose }: RearrangeSectionsModalProps) {
    const dispatch = useDispatch()
    const { sections } = useSelector((state: RootState) => state.resume)
    const { template } = useSelector((state: RootState) => state.settings)
    const [allSections, setAllSections] = useState<Section[]>([])
    const [isDragging, setIsDragging] = useState(false)

    // Sync sections whenever the modal opens or sections change
    useEffect(() => {
        if (isOpen) {
            // Create a deep copy to avoid reference issues
            setAllSections(JSON.parse(JSON.stringify(sections)))
        }
    }, [isOpen, sections])

    const handleSave = () => {
        dispatch(reorderSections({ sections: allSections }))
        onClose()
    }

    const handleDragStart = () => {
        setIsDragging(true)
    }

    const handleDragEnd = (result: any) => {
        setIsDragging(false)

        if (!result.destination) return

        const sourceDroppableId = result.source.droppableId
        const destinationDroppableId = result.destination.droppableId

        // Create a copy of all sections
        const sectionsCopy = [...allSections]

        // Find the section being moved
        const sectionIndex = sectionsCopy.findIndex((s) => s.id === result.draggableId)
        if (sectionIndex === -1) return

        const movedSection = { ...sectionsCopy[sectionIndex] }

        // Remove from original position
        sectionsCopy.splice(sectionIndex, 1)

        // If moving to a different column, update the column property
        if (sourceDroppableId !== destinationDroppableId) {
            movedSection.column = destinationDroppableId === "left-column" ? "left" : "right"
        }

        // Find the destination index
        // We need to count only sections in the target column to determine the correct index
        const sectionsInTargetColumn = sectionsCopy.filter(
            (s) => s.column === (destinationDroppableId === "left-column" ? "left" : "right"),
        )

        // Find where to insert in the full array
        let insertIndex

        if (sectionsInTargetColumn.length === 0 || result.destination.index === 0) {
            // If there are no sections in the target column or inserting at the beginning
            // Find the first section of the target column or the end of the array
            insertIndex = sectionsCopy.findIndex(
                (s) => s.column === (destinationDroppableId === "left-column" ? "left" : "right"),
            )
            if (insertIndex === -1) insertIndex = sectionsCopy.length
        } else if (result.destination.index >= sectionsInTargetColumn.length) {
            // If inserting at the end of the target column
            const lastSectionInColumn = sectionsInTargetColumn[sectionsInTargetColumn.length - 1]
            insertIndex = sectionsCopy.findIndex((s) => s.id === lastSectionInColumn.id) + 1
        } else {
            // Inserting in the middle of the target column
            const targetSection = sectionsInTargetColumn[result.destination.index]
            insertIndex = sectionsCopy.findIndex((s) => s.id === targetSection.id)
        }

        // Insert the moved section at the destination
        sectionsCopy.splice(insertIndex, 0, movedSection)

        setAllSections(sectionsCopy)
    }

    const getSectionTitle = (section: Section) => {
        // if (section.type === "text" && section.content.title.includes("SHARMA")) {
        //     return "Header"
        // }
        return section.title
    }

    // const isHeader = (section: Section) => {
    //     return section.type === SectionTypeEnum.EDUCATION || SectionTypeEnum.LANGUAGES || SectionTypeEnum.PROJECTS || SectionTypeEnum.SKILLS
    // }

    const leftSections = allSections.filter((section) => section.column === "left")
    const rightSections = allSections.filter((section) => section.column === "right")

    const isOneColumnTemplate = template === "timeline"

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[98%] max-w-md sm:max-w-2xl lg:max-w-3/4 xl:max-w-3/5 max-h-[90vh] p-0 overflow-auto scrollbar-none drop-shadow-2xl border-none shadow-none translate-none left-0 right-0 mx-auto" style={{ transform: "none", top: "10%" }}>
                <DialogHeader className="p-4 pt-8 sm:p-6 lg:p-7 xl:p-10 pb-1">
                    <DialogTitle className="font-normal text-center text-lg md:text-xl lg:text-2xl xl:text-3xl">Hold & Drag the boxes to rearrange the sections</DialogTitle>
                </DialogHeader>

                <div className="p-4 pb-6 sm:p-6 lg:p-7 xl:p-10 !pt-1 flex flex-col items-center justify-center gap-2">
                    <p className="text-gray-600 text-center text-sm md:text-base">Page 1 of 1</p>
                    <div className="border border-[e0e0e0] rounded-lg w-full max-w-full sm:w-[348px] shadow-resize-panel p-4">
                        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                            {/* Header Section */}
                            <div className="w-full mb-4 bg-blue-100 rounded-md p-3 flex items-center justify-center">
                                <Lock size={16} className="mr-2" />
                                <span className="font-normal font-rubik text-sm md:text-base">Header</span>
                            </div>

                            <div className={cn("flex", isOneColumnTemplate ? "flex-col" : "gap-4")}>
                                {/* Left Column */}
                                <Droppable droppableId="left-column">
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={cn("bg-gray-50 rounded-md p-2 min-h-[200px]", isOneColumnTemplate ? "w-full" : "w-1/2")}
                                        >
                                            {leftSections.map((section, index) => (
                                                <Draggable key={section.id} draggableId={section.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={cn(
                                                                "bg-blue-50 rounded-md p-2 mb-2 flex items-center",
                                                                snapshot.isDragging && "opacity-50",
                                                            )}
                                                        >
                                                            <div {...provided.dragHandleProps} className="mr-2 cursor-grab">
                                                                <GripVertical size={16} className="text-gray-400" />
                                                            </div>
                                                            <span className="truncate font-normal font-rubik text-sm md:text-base">{getSectionTitle(section)}</span>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>

                                {/* Right Column - Only show for two-column templates */}
                                {!isOneColumnTemplate && (
                                    <Droppable droppableId="right-column">
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="w-1/2 bg-gray-50 rounded-md p-2 min-h-[200px]"
                                            >
                                                {rightSections.map((section, index) => (
                                                    <Draggable key={section.id} draggableId={section.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={cn(
                                                                    "bg-blue-50 rounded-md p-2 mb-2 flex items-center",
                                                                    snapshot.isDragging && "opacity-50",
                                                                )}
                                                            >
                                                                <div {...provided.dragHandleProps} className="mr-2 cursor-grab">
                                                                    <GripVertical size={16} className="text-gray-400" />
                                                                </div>
                                                                <span className="truncate font-normal font-rubik text-sm md:text-base">{getSectionTitle(section)}</span>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                )}
                            </div>
                        </DragDropContext>
                    </div>
                    <div className="flex justify-center mt-4">
                        <Button variant={"default"} onClick={handleSave} className="text-base py-2.5 px-3.5 text-white bg-[#2dc08d] hover:bg-[#57cda4] border-none cursor-pointer rounded-sm font-rubik font-medium transition-all duration-300 ease-in-out">
                            Continue Editing
                        </Button> 
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
