"use client"

import type React from "react"

import { useSelector, useDispatch } from "react-redux"
import ResumeHeader from "@/components/resume-header"
import ResumeSection from "@/components/resume-section"
import type { RootState } from "@/lib/store"
import type { Section } from "@/lib/types"
import { cn, resolveFontFamily, getPageBackgroundStyle, getOverlayStyle } from "@/lib/utils"
import { setOverlayPosition } from "@/lib/features/settings/settingsSlice"
import { upsertActiveSection } from "@/lib/features/resume/resumeSlice"

interface ResumeTemplateModernProps {
    resumeRef: React.RefObject<HTMLDivElement>
}

export default function ResumeTemplateModern({ resumeRef }: ResumeTemplateModernProps) {
    const dispatch = useDispatch()
    const activeSection = useSelector((state: RootState) => state.resume.activeSection)
    const { sections } = useSelector((state: RootState) => state.resume)
    const { editorZoom, pageMargins, fontSize, lineHeight, fontFamily, pageBackgroundColor, pageBackgroundPattern, pageBackgroundMode, pageBackgroundGradientTo, pageBackgroundGradientAngle, overlayEnabled, overlayImage, overlayOpacity, overlayScale, overlayX, overlayY, overlayPositioning, headingColor } = useSelector((state: RootState) => state.settings)

    const handleHeaderClick = () => {
        dispatch(upsertActiveSection({ activeSection: null }))
    }

    // For modern template, we'll display all sections in a single column
    // but maintain their original column property for consistency
    const allSections = [...sections].sort((a, b) => {
        // Sort by column first (left comes before right)
        if (a.column !== b.column) {
            return a.column === "left" ? -1 : 1
        }
        // If same column, maintain original order
        return sections.indexOf(a) - sections.indexOf(b)
    })

    return (
        <div className={cn("w-full mx-auto", activeSection?.id !== null && "resume-editor-overlay-later")} ref={resumeRef}>
                        <div className="bg-white" style={{ transform: `scale(${editorZoom})`, transformOrigin: 'top center', width: '794px', margin: '0 auto', padding: `${pageMargins}px`, fontSize: `${fontSize}rem`, lineHeight: lineHeight, fontFamily: resolveFontFamily(fontFamily), ['--resume-heading-color' as any]: headingColor, ...getPageBackgroundStyle(pageBackgroundColor, pageBackgroundPattern, pageBackgroundMode, pageBackgroundGradientTo, pageBackgroundGradientAngle) }}>
            <div onClick={handleHeaderClick} className="flex items-start">
                <div className="flex-1">
                    <ResumeHeader isActive={activeSection?.id === null} />
                </div>
            </div>

            <div className="mt-6">
                {allSections.map((section: Section) => (
                    <ResumeSection key={section.id} section={section} isActive={section.id === activeSection?.id} />
                ))}
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
