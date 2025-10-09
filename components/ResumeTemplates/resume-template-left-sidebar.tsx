"use client"

import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import type { Section } from "@/lib/types"
import ResumeHeader from "@/components/resume-header"
import ResumeSection from "@/components/resume-section"
import { resolveFontFamily, getPageBackgroundStyle, getOverlayStyle } from "@/lib/utils"
import { setOverlayPosition } from "@/lib/features/settings/settingsSlice"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { reorderSections, upsertActiveSection } from "@/lib/features/resume/resumeSlice"
import { getTemplateDefaults } from "@/lib/features/settings/templateDefaults"

interface Props { resumeRef: React.RefObject<HTMLDivElement | null> }

export default function ResumeTemplateLeftSidebar({ resumeRef }: Props) {
  const dispatch = useDispatch()
  const activeSection = useSelector((s: RootState) => s.resume.activeSection)
  const { sections, header } = useSelector((s: RootState) => s.resume)
  const { editorZoom, pageMargins, sectionSpacing, fontSize, lineHeight, fontFamily, pageBackgroundColor, pageBackgroundPattern, pageBackgroundMode, pageBackgroundGradientTo, pageBackgroundGradientAngle, overlayEnabled, overlayImage, overlayOpacity, overlayScale, overlayX, overlayY, overlayPositioning, headingColor } = useSelector((s: RootState) => s.settings)

  const tpl = getTemplateDefaults("left-sidebar")
  const effectivePageMargins = pageMargins === 36 ? tpl.pageMargins : pageMargins
  const effectiveSectionSpacing = sectionSpacing === 24 ? tpl.sectionSpacing : sectionSpacing
  const effectiveFontSizeRem = 1 * fontSize
  const effectiveLineHeight = 1.4 * lineHeight
  const sidebarWidth =240
  const sidebarBg = "#22405c"
  const sidebarText = "#ffffff"
  const sidebarFontSizeRem = Math.max(0.3, effectiveFontSizeRem * 0.7)

  const leftSections: Section[] = sections.filter((s) => s.column === "left")
  const rightSections: Section[] = sections.filter((s) => s.column === "right")

  const handleDragStart = () => {}
  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const srcId = result.source.droppableId
    const dstId = result.destination.droppableId
    const isLeftSrc = srcId === "left-column"
    const isLeftDst = dstId === "left-column"

    const left = [...leftSections]
    const right = [...rightSections]
    const from = isLeftSrc ? left : right
    const to = isLeftDst ? left : right

    const [moved] = from.splice(result.source.index, 1)
    if (!moved) return
    if (isLeftSrc !== isLeftDst) moved.column = isLeftDst ? "left" : "right"
    to.splice(result.destination.index, 0, moved)

    const newSections = [
      ...sections.filter((s) => s.column !== "left" && s.column !== "right"),
      ...left,
      ...right,
    ]
    dispatch(reorderSections({ sections: newSections }))
  }

  const handleHeaderClick = () => dispatch(upsertActiveSection({ activeSection: null }))
  const handlePhotoClick = () => {
    if (activeSection?.id === null) {
      const event = new CustomEvent("openPhotoUpload", {})
      window.dispatchEvent(event)
    }
  }

  return (
    <div id="resume-container" className="resume-container resume-page-wrapper h-full" ref={resumeRef}>
      <div style={{ transform: `scale(${editorZoom})`, transformOrigin: 'top center', width: '794px', margin: '0 auto', padding: `${effectivePageMargins}px`, fontSize: `${effectiveFontSizeRem}rem`, lineHeight: effectiveLineHeight, fontFamily: resolveFontFamily(fontFamily), ['--resume-heading-color' as any]: headingColor, ...getPageBackgroundStyle(pageBackgroundColor, pageBackgroundPattern, pageBackgroundMode, pageBackgroundGradientTo, pageBackgroundGradientAngle) }}>
        <div className="grid grid-cols-1 md:grid-cols-[var(--tpl-sidebar-w)_1fr] gap-3" style={{ ['--tpl-sidebar-w' as any]: `${sidebarWidth}px` }}>
          {/* Left colored sidebar hosts RIGHT sections (mirror of Elegant) */}
          <div className="left-sidebar-col relative z-[1] px-3 py-3 flex flex-col items-center" style={{ fontSize: `${sidebarFontSizeRem}rem`, backgroundColor: sidebarBg, color: sidebarText, ['--resume-heading-color' as any]: '#ffffff' }}>
            {/* Profile photo in sidebar */}
            {header.visibility.photo && (
              <div className="mb-4" onClick={handleHeaderClick}>
                <div className={`w-32 h-32 ${header.roundPhoto ? "rounded-full" : "rounded-md"} overflow-hidden bg-gray-200 cursor-pointer`} onClick={handlePhotoClick}>
                  {header.photoUrl ? (
                    <img src={header.photoUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {/* empty placeholder keeps box */}
                    </div>
                  )}
                </div>
              </div>
            )}
            <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <Droppable droppableId="right-column">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'grid', rowGap: `${effectiveSectionSpacing}px`, width: '100%' }}>
                    {rightSections.map((section: Section, index) => (
                      <Draggable key={section.id} draggableId={section.id} index={index}>
                        {(p, snapshot) => (
                          <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className={`${snapshot.isDragging ? "opacity-50" : ""}`}>
                            <ResumeSection section={section} isActive={section.id === activeSection?.id} darkMode={true} />
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

          {/* Right main content with header and LEFT sections */}
          <div className="right-main-col">
            <div onClick={handleHeaderClick}>
              <ResumeHeader isActive={activeSection?.id === null} hidePhoto={true} />
            </div>
            <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <Droppable droppableId="left-column">
                {(provided) => (
                  <div className="mt-2" ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'grid', rowGap: `${effectiveSectionSpacing}px` }}>
                    {leftSections.map((section: Section, index) => (
                      <Draggable key={section.id} draggableId={section.id} index={index}>
                        {(p, snapshot) => (
                          <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className={`${snapshot.isDragging ? "opacity-50" : ""}`}>
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
      </div>
    </div>
  )
}