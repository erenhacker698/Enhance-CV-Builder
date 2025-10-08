"use client"

import { useState, useEffect, useLayoutEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { reorderSections } from "@/lib/features/resume/resumeSlice"
import { Lock, GripVertical, ArrowLeft, ArrowRight } from "lucide-react"
import type { RootState } from "@/lib/store"
import type { Section, SectionTypeEnum } from "@/lib/types"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { cn } from "@/lib/utils"
import ResumeHeader from "@/components/resume-header"
import ResumeSection from "@/components/resume-section"

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

    // Pagination state/refs (mirror renderer)
    const [pages, setPages] = useState<Array<{ left: Section[]; right: Section[] }>>([{ left: [], right: [] }])
    const [currentPage, setCurrentPage] = useState(0)
    const measureContainerRef = useRef<HTMLDivElement>(null)
    const measureHeaderRef = useRef<HTMLDivElement>(null)
    const sectionMeasureRefs = useRef<Record<string, HTMLDivElement | null>>({})

    const leftSections = allSections.filter((s) => s.column === "left")
    const rightSections = allSections.filter((s) => s.column === "right")

    useEffect(() => {
        if (isOpen) {
            setAllSections(JSON.parse(JSON.stringify(sections)))
            setCurrentPage(0)
        }
    }, [isOpen, sections])

    // Build pages from measured heights (same as double-column template)
    useLayoutEffect(() => {
        if (!isOpen) return
        const timer = setTimeout(() => {
            if (!measureContainerRef.current || !measureHeaderRef.current) return

            const PAGE_HEIGHT = 1123
            const PADDING = 36 * 2
            const HEADER_HEIGHT = measureHeaderRef.current.offsetHeight
            const HEADER_MARGIN = 24
            const SECTION_GAP = 24

            const availableHeight = PAGE_HEIGHT - PADDING - HEADER_HEIGHT - HEADER_MARGIN

            const heights: Record<string, number> = {}
            allSections.forEach((s) => {
                const el = sectionMeasureRefs.current[s.id]
                if (el) heights[s.id] = el.offsetHeight
            })

            const paginate = (list: Section[]) => {
                if (!list.length) return [[]]
                const pages: Section[][] = []
                let acc: Section[] = []
                let used = 0
                list.forEach((s) => {
                    const h = heights[s.id] ?? 100
                    const gap = acc.length > 0 ? SECTION_GAP : 0
                    if (used + gap + h > availableHeight && acc.length > 0) {
                        pages.push(acc)
                        acc = [s]
                        used = h
                    } else {
                        acc.push(s)
                        used += gap + h
                    }
                })
                if (acc.length > 0) pages.push(acc)
                return pages
            }

            const leftPages = paginate(leftSections)
            const rightPages = paginate(rightSections)
            const pageCount = Math.max(leftPages.length, rightPages.length, 1)

            const computed = Array.from({ length: pageCount }, (_, i) => ({
                left: leftPages[i] ?? [],
                right: rightPages[i] ?? [],
            }))

            setPages(computed)
            setCurrentPage((p) => Math.min(p, Math.max(0, pageCount - 1)))
        }, 50)
        return () => clearTimeout(timer)
    }, [isOpen, allSections])

    const normalizeDroppable = (id: string) => (id.startsWith("left-modal") ? "left" : "right")
    const parsePageIndex = (id: string) => {
        const m = id.match(/-p(\d+)$/)
        return m ? parseInt(m[1], 10) : 0
    }

    const handleSave = () => {
        dispatch(reorderSections({ sections: allSections }))
        onClose()
    }

    const handleDragStart = () => setIsDragging(true)

    const handleDragEnd = (result: any) => {
        setIsDragging(false)
        if (!result.destination) return

        const srcCol = normalizeDroppable(result.source.droppableId)
        const dstCol = normalizeDroppable(result.destination.droppableId)
        const dstPageIdx = parsePageIndex(result.destination.droppableId)

        const left = [...leftSections]
        const right = [...rightSections]
        const from = srcCol === "left" ? left : right
        const to = dstCol === "left" ? left : right

        const movedIdx = from.findIndex((s) => s.id === result.draggableId)
        if (movedIdx === -1) return
        const [moved] = from.splice(movedIdx, 1)
        if (srcCol !== dstCol) moved.column = dstCol

        const pageItems = (pages[dstPageIdx]?.[dstCol] ?? []) as Section[]
        let insertIndex: number

        if (pageItems.length === 0) {
            insertIndex = to.length
        } else if (result.destination.index < pageItems.length) {
            const targetId = pageItems[result.destination.index].id
            insertIndex = Math.max(0, to.findIndex((s) => s.id === targetId))
        } else {
            const lastId = pageItems[pageItems.length - 1].id
            insertIndex = to.findIndex((s) => s.id === lastId) + 1
        }

        to.splice(insertIndex, 0, moved)

        const nonColumn = allSections.filter((s) => s.column !== "left" && s.column !== "right")
        const merged: Section[] = [...nonColumn, ...left, ...right]
        setAllSections(merged)
    }

    const ITEMS_PAGE = pages.length
    const pageCount = Math.max(ITEMS_PAGE, 1)
    const page = pages[currentPage] || { left: [], right: [] }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[98%] max-w-md sm:max-w-2xl lg:max-w-3/4 xl:max-w-3/5 max-h-[90vh] p-0 overflow-auto scrollbar-none drop-shadow-2xl border-none shadow-none translate-none left-0 right-0 mx-auto" style={{ transform: "none", top: "10%" }}>
                <DialogHeader className="p-4 pt-8 sm:p-6 lg:p-7 xl:p-10 pb-1">
                    <DialogTitle className="font-normal text-center text-lg md:text-xl lg:text-2xl xl:text-3xl">Rearrange sections (page-aware)</DialogTitle>
                </DialogHeader>

                {/* Offscreen measurement container */}
                <div
                    ref={measureContainerRef}
                    className="fixed -left-[10000px] top-0 pointer-events-none invisible bg-white overflow-hidden"
                    style={{ width: "794px", height: "1123px", padding: "36px" }}
                    aria-hidden
                >
                    <div ref={measureHeaderRef}>
                        <ResumeHeader isActive={false} />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="space-y-6">
                            {leftSections.map((s) => (
                                <div key={`measure-left-${s.id}`} ref={(el) => (sectionMeasureRefs.current[s.id] = el)}>
                                    <ResumeSection section={s} isActive={false} />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-6">
                            {rightSections.map((s) => (
                                <div key={`measure-right-${s.id}`} ref={(el) => (sectionMeasureRefs.current[s.id] = el)}>
                                    <ResumeSection section={s} isActive={false} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 pb-6 sm:p-6 lg:p-7 xl:p-10 !pt-1 flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center justify-center space-x-4 mb-3">
                        <Button variant="ghost" size="icon" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 0}>
                            <ArrowLeft size={16} />
                        </Button>
                        <p className="text-gray-600 text-center text-sm md:text-base">
                            Page {currentPage + 1} of {pageCount}
                        </p>
                        <Button variant="ghost" size="icon" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage >= pageCount - 1}>
                            <ArrowRight size={16} />
                        </Button>
                    </div>

                    <div className="border border-[e0e0e0] rounded-lg w-full max-w-full sm:w-[560px] shadow-resize-panel p-4">
                        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                            <div className="w-full mb-4 bg-blue-100 rounded-md p-3 flex items-center justify-center">
                                <Lock size={16} className="mr-2" />
                                <span className="font-normal font-rubik text-sm md:text-base">Header (fixed on page 1)</span>
                            </div>

                            <div className="flex gap-4">
                                {/* Left page column */}
                                <Droppable droppableId={`left-modal-p${currentPage}`}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps} className="w-1/2 bg-gray-50 rounded-md p-2 min-h-[200px]">
                                            {page.left.map((section, idx) => (
                                                <Draggable key={section.id} draggableId={section.id} index={idx}>
                                                    {(p, snapshot) => (
                                                        <div
                                                            ref={p.innerRef}
                                                            {...p.draggableProps}
                                                            className={cn("bg-blue-50 rounded-md p-2 mb-2 flex items-center", snapshot.isDragging && "opacity-50")}
                                                        >
                                                            <div {...p.dragHandleProps} className="mr-2 cursor-grab">
                                                                <GripVertical size={16} className="text-gray-400" />
                                                            </div>
                                                            <span className="truncate font-normal font-rubik text-sm md:text-base">{section.title}</span>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>

                                {/* Right page column */}
                                <Droppable droppableId={`right-modal-p${currentPage}`}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps} className="w-1/2 bg-gray-50 rounded-md p-2 min-h-[200px]">
                                            {page.right.map((section, idx) => (
                                                <Draggable key={section.id} draggableId={section.id} index={idx}>
                                                    {(p, snapshot) => (
                                                        <div
                                                            ref={p.innerRef}
                                                            {...p.draggableProps}
                                                            className={cn("bg-blue-50 rounded-md p-2 mb-2 flex items-center", snapshot.isDragging && "opacity-50")}
                                                        >
                                                            <div {...p.dragHandleProps} className="mr-2 cursor-grab">
                                                                <GripVertical size={16} className="text-gray-400" />
                                                            </div>
                                                            <span className="truncate font-normal font-rubik text-sm md:text-base">{section.title}</span>
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
                        <Button variant={"default"} onClick={handleSave} className="text-base py-2.5 px-3.5 text-white bg-[#2dc08d] hover:bg-[#57cda4] border-none cursor-pointer rounded-sm font-rubik font-medium transition-all duration-300 ease-in-out">
                            Continue Editing
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
