"use client"

import type React from "react"
import { useMemo, useRef, useState, useLayoutEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import type { Section } from "@/lib/types"
import ResumeHeader from "@/components/resume-header"
import ResumeSection from "@/components/resume-section"
import { resolveFontFamily, getPageBackgroundStyle, getOverlayStyle } from "@/lib/utils"
import { setOverlayPosition } from "@/lib/features/settings/settingsSlice"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { reorderSections, upsertActiveSection } from "@/lib/features/resume/resumeSlice"

interface Props { resumeRef: React.RefObject<HTMLDivElement | null> }

export default function ResumeTemplateLeftSidebar({ resumeRef }: Props) {
  const dispatch = useDispatch()
  const activeSection = useSelector((s: RootState) => s.resume.activeSection)
  const { sections } = useSelector((s: RootState) => s.resume)
  const { editorZoom, pageMargins, sectionSpacing, primaryColor, fontSize, lineHeight, fontFamily, pageBackgroundColor, pageBackgroundPattern, pageBackgroundMode, pageBackgroundGradientTo, pageBackgroundGradientAngle, overlayEnabled, overlayImage, overlayOpacity, overlayScale, overlayX, overlayY, overlayPositioning, headingColor } = useSelector((s: RootState) => s.settings)

  const leftSections = useMemo(() => sections.filter(s => s.column === 'left'), [sections])
  const rightSections = useMemo(() => sections.filter(s => s.column === 'right'), [sections])

  // Pagination state & measurement refs
  const [pages, setPages] = useState<Array<{ left: Section[]; right: Section[] }>>([{ left: [], right: [] }])
  const measureContainerRef = useRef<HTMLDivElement>(null)
  const measureHeaderRef = useRef<HTMLDivElement>(null)
  const sectionMeasureRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const handleHeaderClick = () => dispatch(upsertActiveSection({ activeSection: null }))

  const normalizeDroppable = (id: string) => (id.startsWith('left-column') ? 'left' : 'right')
  const parsePageIndex = (id: string) => {
    const m = id.match(/-p(\d+)$/)
    return m ? parseInt(m[1], 10) : 0
  }

  useLayoutEffect(() => {
    const t = setTimeout(() => {
      if (!measureContainerRef.current || !measureHeaderRef.current) return
      const PAGE_HEIGHT = 1123
      const PADDING = pageMargins * 2
      const HEADER_HEIGHT = measureHeaderRef.current.offsetHeight
      const HEADER_MARGIN = 24
      const SECTION_GAP = sectionSpacing
      const available = PAGE_HEIGHT - PADDING - HEADER_HEIGHT - HEADER_MARGIN

      const heights: Record<string, number> = {}
      sections.forEach(s => {
        const el = sectionMeasureRefs.current[s.id]
        if (el) heights[s.id] = el.offsetHeight
      })

      const paginate = (list: Section[]) => {
        if (!list.length) return [[]]
        const pages: Section[][] = []
        let acc: Section[] = []
        let used = 0
        list.forEach(s => {
          const h = heights[s.id] ?? 100
          const gap = acc.length > 0 ? SECTION_GAP : 0
          if (used + gap + h > available && acc.length > 0) {
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

      const L = paginate(leftSections)
      const R = paginate(rightSections)
      const count = Math.max(L.length, R.length, 1)
      setPages(Array.from({ length: count }, (_, i) => ({ left: L[i] ?? [], right: R[i] ?? [] })))
    }, 50)
    return () => clearTimeout(t)
  }, [sections, leftSections, rightSections, pageMargins, sectionSpacing, fontSize, lineHeight, fontFamily])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const srcCol = normalizeDroppable(result.source.droppableId)
    const dstCol = normalizeDroppable(result.destination.droppableId)
    const movedId = result.draggableId

    const left = [...leftSections]
    const right = [...rightSections]
    const from = srcCol === 'left' ? left : right
    const to = dstCol === 'left' ? left : right

    const idx = from.findIndex(s => s.id === movedId)
    if (idx === -1) return
    const [moved] = from.splice(idx, 1)
    if (srcCol !== dstCol) moved.column = dstCol

    const dstPageIndex = parsePageIndex(result.destination.droppableId)
    const dstPageItems = pages[dstPageIndex]?.[dstCol] ?? []
    let insertIndex: number
    if (result.destination.index >= dstPageItems.length) {
      const lastId = dstPageItems[dstPageItems.length - 1]?.id
      insertIndex = lastId ? to.findIndex(s => s.id === lastId) + 1 : to.length
    } else {
      const targetId = dstPageItems[result.destination.index].id
      insertIndex = to.findIndex(s => s.id === targetId)
    }
    to.splice(insertIndex, 0, moved)
    const newSections = [...sections.filter(s => s.column !== 'left' && s.column !== 'right'), ...left, ...right]
    dispatch(reorderSections({ sections: newSections }))
  }

  return (
    <div ref={resumeRef}>
      <div style={{ transform: `scale(${editorZoom})`, transformOrigin: 'top center', fontSize: `${fontSize}rem`, lineHeight: lineHeight, fontFamily: resolveFontFamily(fontFamily), ['--resume-heading-color' as any]: headingColor }}>
        <div className="pages-container space-y-8">
          {pages.map((page, pageIndex) => (
            <div key={`page-${pageIndex}`} className="relative mx-auto shadow-lg bg-white" style={{ width: '794px', height: '1123px', padding: `${pageMargins}px`, ...getPageBackgroundStyle(pageBackgroundColor, pageBackgroundPattern, pageBackgroundMode, pageBackgroundGradientTo, pageBackgroundGradientAngle) }}>
              {pageIndex === 0 && (
                <div onClick={handleHeaderClick}>
                  <ResumeHeader isActive={activeSection?.id === null} />
                </div>
              )}
              {overlayEnabled && overlayImage && (
                <div
                  aria-label="overlay-pattern"
                  onMouseDown={(e) => {
                    if (!overlayPositioning) return
                    const pageEl = (e.currentTarget.parentElement as HTMLElement)
                    const rect = pageEl.getBoundingClientRect()
                    const move = (evt: MouseEvent) => {
                      const nx = ((evt.clientX - rect.left) / rect.width) * 100
                      const ny = ((evt.clientY - rect.top) / rect.height) * 100
                      dispatch(setOverlayPosition({ x: nx, y: ny }))
                    }
                    const up = () => {
                      window.removeEventListener('mousemove', move)
                      window.removeEventListener('mouseup', up)
                    }
                    window.addEventListener('mousemove', move)
                    window.addEventListener('mouseup', up)
                  }}
                  style={{ ...(getOverlayStyle({ enabled: overlayEnabled, image: overlayImage, opacity: overlayOpacity, scale: overlayScale, x: overlayX, y: overlayY }) as any), pointerEvents: overlayPositioning ? 'auto' : 'none', cursor: overlayPositioning ? 'move' : 'default' }}
                />
              )}
              <div className="mt-6 grid grid-cols-[240px_1fr]" style={{ columnGap: '24px' }}>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId={`left-column-p${pageIndex}`}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="rounded-md p-3 text-white" style={{ backgroundColor: primaryColor, minHeight: 200 }}>
                        {page.left.map((section, index) => (
                          <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(p) => (
                              <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} style={{ marginBottom: `${sectionSpacing}px` }}>
                                <ResumeSection section={section} isActive={section.id === activeSection?.id} darkMode={true} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <Droppable droppableId={`right-column-p${pageIndex}`}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'grid', rowGap: `${sectionSpacing}px` }}>
                        {page.right.map((section, index) => (
                          <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(p) => (
                              <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>
                                <ResumeSection section={section} isActive={section.id === activeSection?.id} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}