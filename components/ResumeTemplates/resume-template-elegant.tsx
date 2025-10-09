"use client"

import type React from "react"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { reorderSections, upsertActiveSection } from "@/lib/features/resume/resumeSlice"
import ResumeSection from "@/components/resume-section"
import { Button } from "@/components/ui/button"
import { Camera, Plus, User } from "lucide-react"
import type { RootState } from "@/lib/store"
import type { Section } from "@/lib/types"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import ResumeHeader from "@/components/resume-header"
import { setAddSectionModal } from "@/lib/features/settings/settingsSlice"
import { cn, resolveFontFamily, getPageBackgroundStyle, getOverlayStyle } from "@/lib/utils"
import { getTemplateDefaults } from "@/lib/features/settings/templateDefaults"
import { setOverlayPosition } from "@/lib/features/settings/settingsSlice"

interface ResumeTemplateProps {
    resumeRef: React.RefObject<HTMLDivElement | null>
}

export default function ResumeTemplateElegant({ resumeRef }: ResumeTemplateProps) {
    const dispatch = useDispatch()
    const activeSection = useSelector((state: RootState) => state.resume.activeSection)
    const { sections } = useSelector((state: RootState) => state.resume)
    const { editorZoom, pageMargins, sectionSpacing, fontSize, lineHeight, fontFamily, pageBackgroundColor, pageBackgroundPattern, pageBackgroundMode, pageBackgroundGradientTo, pageBackgroundGradientAngle, overlayEnabled, overlayImage, overlayOpacity, overlayScale, overlayX, overlayY, overlayPositioning, headingColor } = useSelector((state: RootState) => state.settings)
    const { header } = useSelector((state: RootState) => state.resume)
    const [draggedSection, setDraggedSection] = useState<string | null>(null)

    // Elegant-specific defaults and layout tweaks
    const tpl = getTemplateDefaults("elegant")
    const DEFAULT_GLOBAL_MARGINS = 36
    const DEFAULT_GLOBAL_SPACING = 24
    // If user hasn't changed from global defaults, prefer template defaults; otherwise respect user values
    const effectivePageMargins = pageMargins === DEFAULT_GLOBAL_MARGINS ? tpl.pageMargins : pageMargins
    const effectiveSectionSpacing = sectionSpacing === DEFAULT_GLOBAL_SPACING ? tpl.sectionSpacing : sectionSpacing
    const effectiveFontSizeRem = (.9) * fontSize
    const effectiveLineHeight = (.8) * lineHeight
    const sidebarWidth = 220
    const sidebarBg = "#5a163fff"
    const sidebarText = "#12801fff" 
    const rightColumnFontSizeRem = Math.max(0.3, fontSize * 0.72) // 70% of main, clamped

    const handleHeaderClick = () => {
        dispatch(upsertActiveSection({ activeSection: null }))
    }

    const handleAddSectionClick = (column: "left" | "right") => {
        dispatch(setAddSectionModal({ isOpen: true, column }))
    }

    const handlePhotoClick = () => {
        if (activeSection?.id === null) {
            const event = new CustomEvent("openPhotoUpload", {})
            window.dispatchEvent(event)
        }
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

    return (
        <div id="resume-container" className={cn("resume-container resume-page-wrapper h-full", activeSection?.id !== null && "resume-editor-overlay-later")} ref={resumeRef}>
            <div style={{ transform: `scale(${editorZoom})`, transformOrigin: 'top center', width: '794px', margin: '0 auto', padding: `${effectivePageMargins}px`, fontSize: `${effectiveFontSizeRem}rem`, lineHeight: effectiveLineHeight, fontFamily: resolveFontFamily(fontFamily), ['--resume-heading-color' as any]: headingColor, ...getPageBackgroundStyle(pageBackgroundColor, pageBackgroundPattern, pageBackgroundMode, pageBackgroundGradientTo, pageBackgroundGradientAngle) }}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_var(--tpl-sidebar-w)] gap-3" style={{ ['--tpl-sidebar-w' as any]: `${sidebarWidth}px` }}>
                <div className="left-column-side">
                    {/* Header - Name and title only */}
                    <div onClick={handleHeaderClick}>
                        <ResumeHeader isActive={activeSection?.id === null} hidePhoto={true} />
                    </div>

                    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <Droppable droppableId="left-column">
                            {(provided) => (
                                <div className="mt-2" ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'grid', rowGap: `${effectiveSectionSpacing}px` }}>
                                    {leftSections.map((section: Section, index) => (
                                        <Draggable
                                            key={section.id}
                                            draggableId={section.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                                                >
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

                <div className="right-column-side relative z-[1] px-3 py-3 flex flex-col items-center" style={{ fontSize: `${rightColumnFontSizeRem}rem`, backgroundColor: sidebarBg, color: sidebarText, ['--resume-heading-color' as any]: '#ffffff' }}>
                    {/* Profile photo in sidebar */}
                    {header.visibility.photo && (
                        <div className="mb-4" onClick={handleHeaderClick}>
                            <div
                                className={`w-32 h-32 ${header.roundPhoto ? "rounded-full" : "rounded-md"
                                    } overflow-hidden bg-gray-200 cursor-pointer`}
                                onClick={handlePhotoClick}
                            >
                                {header.photoUrl ? (
                                    <img src={header.photoUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-12 h-12" />
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
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                                                >
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
    )
}
