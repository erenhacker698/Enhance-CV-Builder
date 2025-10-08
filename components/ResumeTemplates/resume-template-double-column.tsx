"use client"

import type React from "react"

import { useState, useLayoutEffect, useRef, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { reorderSections, upsertActiveSection } from "@/lib/features/resume/resumeSlice"
import ResumeHeader from "@/components/resume-header"
import ResumeSection from "@/components/resume-section"
import type { RootState } from "@/lib/store"
import type { Section } from "@/lib/types"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { cn } from "@/lib/utils"

interface ResumeTemplateProps {
    resumeRef: React.RefObject<HTMLDivElement>
}

export default function ResumeTemplateDoubleColumn({ resumeRef }: ResumeTemplateProps) {
    const dispatch = useDispatch()
    const activeSection = useSelector((state: RootState) => state.resume.activeSection)
    const { sections } = useSelector((state: RootState) => state.resume)

    const [pages, setPages] = useState<Array<{ left: Section[]; right: Section[] }>>([{ left: [], right: [] }])
    const measureContainerRef = useRef<HTMLDivElement>(null)
    const measureHeaderRef = useRef<HTMLDivElement>(null)
    const sectionMeasureRefs = useRef<Record<string, HTMLDivElement | null>>({})

    const leftSections = useMemo(() => sections.filter((s) => s.column === "left"), [sections])
    const rightSections = useMemo(() => sections.filter((s) => s.column === "right"), [sections])

    const normalizeDroppable = (id: string) => (id.startsWith("left-column") ? "left-column" : "right-column")
    const parsePageIndex = (id: string) => {
        const match = id.match(/-p(\d+)$/)
        return match ? parseInt(match[1], 10) : 0
    }

    const handleHeaderClick = () => {
        dispatch(upsertActiveSection({ activeSection: null }))
    }

    useLayoutEffect(() => {
        const timer = setTimeout(() => {
            if (!measureContainerRef.current || !measureHeaderRef.current) return

            const PAGE_HEIGHT = 1123 // A4 height at 96 DPI
            const PADDING = 36 * 2 // 36px top & bottom
            const HEADER_HEIGHT = measureHeaderRef.current.offsetHeight
            const HEADER_MARGIN = 24 // mt-6
            const SECTION_GAP = 24 // space-y-6

            const availableHeight = PAGE_HEIGHT - PADDING - HEADER_HEIGHT - HEADER_MARGIN

            const heights: Record<string, number> = {}
            sections.forEach((s) => {
                const el = sectionMeasureRefs.current[s.id]
                if (el) heights[s.id] = el.offsetHeight
            })

            const paginate = (sectionList: Section[]) => {
                if (!sectionList.length) return [[]]
                const pages: Section[][] = []
                let currentPage: Section[] = []
                let currentHeight = 0

                sectionList.forEach((section) => {
                    const sectionHeight = heights[section.id] ?? 100
                    const gap = currentPage.length > 0 ? SECTION_GAP : 0

                    if (currentHeight + gap + sectionHeight > availableHeight && currentPage.length > 0) {
                        pages.push(currentPage)
                        currentPage = [section]
                        currentHeight = sectionHeight
                    } else {
                        currentPage.push(section)
                        currentHeight += gap + sectionHeight
                    }
                })
                if (currentPage.length > 0) pages.push(currentPage)
                return pages
            }

            const leftPages = paginate(leftSections)
            const rightPages = paginate(rightSections)
            const pageCount = Math.max(leftPages.length, rightPages.length, 1)

            const newPages = Array.from({ length: pageCount }, (_, i) => ({
                left: leftPages[i] || [],
                right: rightPages[i] || [],
            }))
            setPages(newPages)
        }, 100)

        return () => clearTimeout(timer)
    }, [sections, leftSections, rightSections])

    const handleDragEnd = (result: any) => {
        if (!result.destination) return

        const sourceCol = normalizeDroppable(result.source.droppableId)
        const destCol = normalizeDroppable(result.destination.droppableId)
        const movedId = result.draggableId

        const left = [...leftSections]
        const right = [...rightSections]

        const sourceList = sourceCol === "left-column" ? left : right
        const destList = destCol === "left-column" ? left : right

        const movedIndex = sourceList.findIndex((s) => s.id === movedId)
        if (movedIndex === -1) return

        const [movedSection] = sourceList.splice(movedIndex, 1)

        const destPageIndex = parsePageIndex(result.destination.droppableId)
        const destPageItems = pages[destPageIndex]?.[destCol === "left-column" ? "left" : "right"] ?? []
        
        let insertIndex: number
        if (result.destination.index >= destPageItems.length) {
            const lastId = destPageItems[destPageItems.length - 1]?.id
            insertIndex = lastId ? destList.findIndex((s) => s.id === lastId) + 1 : destList.length
        } else {
            const targetId = destPageItems[result.destination.index].id
            insertIndex = destList.findIndex((s) => s.id === targetId)
        }

        if (sourceCol !== destCol) {
            movedSection.column = destCol === "left-column" ? "left" : "right"
        }

        destList.splice(insertIndex, 0, movedSection)

        const newSections = [...sections.filter(s => s.column !== 'left' && s.column !== 'right'), ...left, ...right]
        dispatch(reorderSections({ sections: newSections }))
    }

    return (
        <div className="resume-page-container" ref={resumeRef}>
            <div
                ref={measureContainerRef}
                className="fixed -left-[10000px] top-0 pointer-events-none invisible bg-white"
                style={{ width: '794px', padding: '36px' }}
                aria-hidden
            >
                <div ref={measureHeaderRef}><ResumeHeader isActive={false} /></div>
                <div className="grid grid-cols-2 gap-6 mt-6">
                    <div className="space-y-6">
                        {leftSections.map(s => <div key={s.id} ref={el => sectionMeasureRefs.current[s.id] = el}><ResumeSection section={s} isActive={false} /></div>)}
                    </div>
                    <div className="space-y-6">
                        {rightSections.map(s => <div key={s.id} ref={el => sectionMeasureRefs.current[s.id] = el}><ResumeSection section={s} isActive={false} /></div>)}
                    </div>
                </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="pages-container space-y-8">
                    {pages.map((page, pageIndex) => (
                        <div key={`page-${pageIndex}`} className="resume-page bg-white relative mx-auto shadow-lg" style={{ width: '794px', height: '1123px', padding: '36px' }}>
                            {pageIndex === 0 && <div onClick={handleHeaderClick}><ResumeHeader isActive={activeSection?.id === null} /></div>}
                            <div className={cn("grid grid-cols-2 gap-6", pageIndex === 0 && "mt-6")}>
                                <Droppable droppableId={`left-column-p${pageIndex}`}>
                                    {(provided) => (
                                        <div className="space-y-6" ref={provided.innerRef} {...provided.droppableProps}>
                                            {page.left.map((section, index) => (
                                                <Draggable key={section.id} draggableId={section.id} index={index}>
                                                    {(p) => <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}><ResumeSection section={section} isActive={section.id === activeSection?.id} /></div>}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                                <Droppable droppableId={`right-column-p${pageIndex}`}>
                                    {(provided) => (
                                        <div className="space-y-6" ref={provided.innerRef} {...provided.droppableProps}>
                                            {page.right.map((section, index) => (
                                                <Draggable key={section.id} draggableId={section.id} index={index}>
                                                    {(p) => <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}><ResumeSection section={section} isActive={section.id === activeSection?.id} /></div>}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    )
}
