"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import {
    setActiveSection,
    updateSectionContent,
    addEntry,
    removeEntry,
    updateEntry,
    toggleFieldVisibility,
    updateSectionColumn,
} from "@/lib/features/resume/resumeSlice"
import type { Section, Entry, FieldVisibility } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, Calendar, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import EditableText from "@/components/editable-text"
import FieldVisibilityMenu from "@/components/field-visibility-menu"
import SectionToolbar from "@/components/section-toolbar"
import SkillsSection from "@/components/skills-section"
import LanguageSection from "@/components/language-section"
import AchievementsSection from "@/components/achievements-section"
import CustomSection from "@/components/custom-section"

interface ResumeSectionProps {
    section: Section
    isActive: boolean
    onDragStart?: (sectionId: string) => void
    darkMode?: boolean
}

export default function ResumeSection({ section, isActive, onDragStart, darkMode = false }: ResumeSectionProps) {
    const dispatch = useDispatch()
    const [isHovered, setIsHovered] = useState(false)
    const [showVisibilityMenu, setShowVisibilityMenu] = useState(false)
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null)
    const [showToolbar, setShowToolbar] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    const handleActivateSection = () => {
        dispatch(setActiveSection({ sectionId: section.id }))
        setShowToolbar(true)
    }

    const handleTitleChange = (newTitle: string) => {
        dispatch(
            updateSectionContent({
                sectionId: section.id,
                content: { ...section.content, title: newTitle },
            }),
        )
    }

    const handleAddEntry = () => {
        dispatch(
            addEntry({
                sectionId: section.id,
                entry: {
                    id: `entry-${Date.now()}`,
                    title: "New Title",
                    subtitle: "Company Name",
                    dateRange: "Date period",
                    location: "Location",
                    description: "Company Description",
                    bullets: ["Highlight your accomplishments, using numbers if possible."],
                    visibility: {
                        title: true,
                        subtitle: true,
                        dateRange: true,
                        location: true,
                        description: true,
                        bullets: true,
                        link: false,
                        logo: false,
                    },
                },
            }),
        )
    }

    const handleEntryChange = (entryId: string, field: string, value: string | string[]) => {
        dispatch(
            updateEntry({
                sectionId: section.id,
                entryId,
                field,
                value,
            }),
        )
    }

    const handleRemoveEntry = (entryId: string) => {
        dispatch(
            removeEntry({
                sectionId: section.id,
                entryId,
            }),
        )
    }

    const handleContextMenu = (e: React.MouseEvent, entryId?: string) => {
        e.preventDefault()
        if (entryId) {
            setActiveEntryId(entryId)
        } else {
            setActiveEntryId(null)
        }
        setMenuPosition({ x: e.clientX, y: e.clientY })
        setShowVisibilityMenu(true)
    }

    const handleToggleVisibility = (field: keyof FieldVisibility, value: boolean) => {
        if (activeEntryId) {
            dispatch(
                toggleFieldVisibility({
                    sectionId: section.id,
                    entryId: activeEntryId,
                    field,
                    value,
                }),
            )
        }
    }

    const handleDragStartSection = () => {
        if (onDragStart) {
            onDragStart(section.id)
        }
    }

    const handleMoveToColumn = (targetColumn: "left" | "right") => {
        dispatch(
            updateSectionColumn({
                sectionId: section.id,
                column: targetColumn,
            }),
        )
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showVisibilityMenu && sectionRef.current && !sectionRef.current.contains(event.target as Node)) {
                setShowVisibilityMenu(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showVisibilityMenu])

    // Render different section types
    const renderSectionContent = () => {
        switch (section.type) {
            case "text":
                return (
                    <EditableText
                        value={section.content.text || ""}
                        onChange={(newText) =>
                            dispatch(
                                updateSectionContent({
                                    sectionId: section.id,
                                    content: { ...section.content, text: newText },
                                }),
                            )
                        }
                        className={cn("text-sm", darkMode ? "text-white" : "text-gray-700")}
                        multiline
                    />
                )
            case "entries":
                return (
                    <div className="space-y-4">
                        {section.content.entries?.map((entry: Entry) => (
                            <div
                                key={entry.id}
                                className={cn(
                                    "relative p-2 -mx-2 group/entry",
                                    isActive && "hover:bg-gray-50 rounded",
                                    darkMode && isActive && "hover:bg-slate-700 rounded",
                                )}
                                onContextMenu={(e) => handleContextMenu(e, entry.id)}
                            >
                                {isActive && (
                                    <div className="absolute right-2 top-2 opacity-0 group-hover/entry:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn("h-6 w-6 hover:text-red-500", darkMode ? "text-gray-300" : "text-gray-400")}
                                            onClick={() => handleRemoveEntry(entry.id)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                )}

                                {entry.visibility?.title !== false && (
                                    <EditableText
                                        value={entry.title}
                                        onChange={(value) => handleEntryChange(entry.id, "title", value)}
                                        className={cn("font-medium", darkMode && "text-white")}
                                    />
                                )}

                                {entry.visibility?.subtitle !== false && (
                                    <EditableText
                                        value={entry.subtitle}
                                        onChange={(value) => handleEntryChange(entry.id, "subtitle", value)}
                                        className={cn(darkMode ? "text-teal-300" : "text-teal-500")}
                                    />
                                )}

                                <div
                                    className={cn("flex items-center text-sm mt-1 gap-4", darkMode ? "text-gray-300" : "text-gray-500")}
                                >
                                    {entry.visibility?.dateRange !== false && (
                                        <div className="flex items-center">
                                            <Calendar size={12} className="mr-1" />
                                            <EditableText
                                                value={entry.dateRange}
                                                onChange={(value) => handleEntryChange(entry.id, "dateRange", value)}
                                                className="text-sm"
                                            />
                                        </div>
                                    )}

                                    {entry.visibility?.location !== false && (
                                        <div className="flex items-center">
                                            <MapPin size={12} className="mr-1" />
                                            <EditableText
                                                value={entry.location}
                                                onChange={(value) => handleEntryChange(entry.id, "location", value)}
                                                className="text-sm"
                                            />
                                        </div>
                                    )}
                                </div>

                                {entry.visibility?.description !== false && (
                                    <EditableText
                                        value={entry.description}
                                        onChange={(value) => handleEntryChange(entry.id, "description", value)}
                                        className={cn("text-sm mt-1", darkMode && "text-gray-300")}
                                    />
                                )}

                                {entry.visibility?.bullets !== false && (
                                    <ul className="list-disc pl-5 mt-1">
                                        {entry.bullets.map((bullet, index) => (
                                            <li key={index} className={cn("text-sm", darkMode && "text-gray-300")}>
                                                <EditableText
                                                    value={bullet}
                                                    onChange={(value) => {
                                                        const newBullets = [...entry.bullets]
                                                        newBullets[index] = value
                                                        handleEntryChange(entry.id, "bullets", newBullets)
                                                    }}
                                                    className="text-sm"
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}

                        {(!section.content.entries || section.content.entries.length === 0) && isActive && (
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn("w-full mt-2", darkMode && "border-slate-600 text-white hover:bg-slate-700")}
                                onClick={handleAddEntry}
                            >
                                <PlusCircle size={14} className="mr-1" />
                                Add Entry
                            </Button>
                        )}
                    </div>
                )
            case "skills":
                return <SkillsSection section={section} isActive={isActive} darkMode={darkMode} />
            case "languages":
                return <LanguageSection section={section} isActive={isActive} darkMode={darkMode} />
            case "achievements":
                return <AchievementsSection section={section} isActive={isActive} darkMode={darkMode} />
            case "custom":
                return <CustomSection section={section} isActive={isActive} darkMode={darkMode} />
            default:
                return null
        }
    }

    // Don't render the title if it's empty (for the Elegant template sidebar)
    if (section.content.title === "") {
        return (
            <div
                ref={sectionRef}
                className={cn("mb-6 relative group", isActive && "ring-1 ring-gray-300 rounded-md resume-header-active")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false)
                    if (!isActive) setShowToolbar(false)
                }}
                onClick={handleActivateSection}
            >
                {(isActive || isHovered) && (
                    <SectionToolbar
                        section={section}
                        onAddEntry={section.type === "entries" ? handleAddEntry : undefined}
                        onDragStart={handleDragStartSection}
                        onMoveToColumn={handleMoveToColumn}
                        darkMode={darkMode}
                    />
                )}

                {renderSectionContent()}

                {showVisibilityMenu && activeEntryId && (
                    <FieldVisibilityMenu
                        position={menuPosition}
                        onClose={() => setShowVisibilityMenu(false)}
                        visibility={section.content.entries?.find((e) => e.id === activeEntryId)?.visibility || {}}
                        onToggle={handleToggleVisibility}
                    />
                )}
            </div>
        )
    }

    return (
        <div
            ref={sectionRef}
            className={cn("mb-6 relative group", isActive && "ring-1 ring-gray-300 rounded-md p-4 resume-section-active")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false)
                if (!isActive) setShowToolbar(false)
            }}
            onClick={handleActivateSection}
        >
            {(isActive || isHovered) && (
                <SectionToolbar
                    section={section}
                    onAddEntry={section.type === "entries" ? handleAddEntry : undefined}
                    onDragStart={handleDragStartSection}
                    onMoveToColumn={handleMoveToColumn}
                    darkMode={darkMode}
                />
            )}

            <div className={cn("border-b mb-2", darkMode ? "border-slate-600" : "border-gray-800")}>
                <EditableText
                    value={section.content.title}
                    onChange={handleTitleChange}
                    className={cn("text-xl font-bold uppercase", darkMode && "text-white")}
                />
            </div>

            {renderSectionContent()}

            {showVisibilityMenu && activeEntryId && (
                <FieldVisibilityMenu
                    position={menuPosition}
                    onClose={() => setShowVisibilityMenu(false)}
                    visibility={section.content.entries?.find((e) => e.id === activeEntryId)?.visibility || {}}
                    onToggle={handleToggleVisibility}
                />
            )}
        </div>
    )
}
