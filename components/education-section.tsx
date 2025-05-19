"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useDispatch } from "react-redux"
import {
    toggleEducationContentVisibility,
    addEducation,
    updateEducation,
    removeEducation,
} from "@/lib/features/resume/resumeSlice"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Settings, MoveVertical, Calendar, MapPin, PlusCircle } from "lucide-react"
import EditableText from "@/components/editable-text"
import { cn } from "@/lib/utils"
import { EducationContentVisibility, type EducationSectionItem, type Section } from "@/lib/types"
import EducationSettingsPanel from "./education-settings-panel"

interface SectionProps {
    section: Section
    isActive: boolean
    darkMode?: boolean
}

export default function EducationSection({ section, isActive, darkMode = false }: SectionProps) {
    const dispatch = useDispatch()
    const [showSettings, setShowSettings] = useState(false)
    const [activeEducationId, setActiveEducationId] = useState<string | null>(null)
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
    const settingsRef = useRef<HTMLDivElement>(null)

    const handleAddEducation = () => {
        dispatch(
            addEducation({
                sectionId: section.id,
                education: {
                    id: `edu-${Date.now()}`,
                    school: "",
                    degree: "",
                    location: "",
                    gpa: "",
                    logo: "",
                    period: "",
                    bullets: [],
                    visibility: {
                        bullets: false,
                        gpa: false,
                        location: false,
                        logo: false,
                        period: false
                    }
                },
            }),
        )
    }

    const handleUpdateEducation = (educationId: string, field: string, value: string | string[]) => {
        dispatch(
            updateEducation({
                sectionId: section.id,
                educationId,
                field,
                value
            }),
        )
    }

    const handleRemoveEducation = (educationId: string) => {
        dispatch(
            removeEducation({
                sectionId: section.id,
                educationId
            }),
        )
    }

    const handleSettingsClick = (e: React.MouseEvent, educationId: string) => {
        e.stopPropagation()
        setActiveEducationId(educationId)
        setMenuPosition({ x: e.clientX, y: e.clientY })
        setShowSettings(true)
    }

    const handleEducationChange = (field: keyof EducationContentVisibility, value: string | string[]) => {
        if (activeEducationId) {
            dispatch(
                updateEducation({
                    sectionId: section.id,
                    educationId: activeEducationId,
                    field,
                    value
                })
            )
        }
    }

    const handleToggleVisibility = (field: keyof EducationContentVisibility, value: boolean) => {
        if (activeEducationId) {
            dispatch(
                toggleEducationContentVisibility({
                    sectionId: section.id,
                    entryId: activeEducationId,
                    field,
                    value
                }),
            )
        }
    }

    const handleContextMenu = (e: React.MouseEvent, entryId?: string) => {
        e.preventDefault()
        if (entryId) {
            setActiveEducationId(entryId)
        } else {
            setActiveEducationId(null)
        }
        setMenuPosition({ x: e.clientX, y: e.clientY })
        // setShowVisibilityMenu(true)
    }

    return (
        <div className="space-y-4">
            {section.content.educations?.map((education: EducationSectionItem) => (
                <div
                    key={education.id}
                    className={cn(
                        "relative p-3 -mx-3 group/entry border border-transparent",
                        isActive && "hover:bg-gray-50 hover:border-gray-200 rounded-md",
                    )}
                >
                    {isActive && (
                        <div className="absolute right-2 top-2 opacity-0 group-hover/entry:opacity-100 transition-opacity flex space-x-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 bg-white border shadow-sm"
                                onClick={(e) => handleSettingsClick(e, education.id)}
                            >
                                <Settings size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 bg-white border shadow-sm cursor-move">
                                <MoveVertical size={14} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 bg-white border shadow-sm text-gray-400 hover:text-red-500"
                                onClick={() => handleRemoveEducation(education.id)}
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    )}

                    {/* Add Start */}
                    <div className="space-y-4">
                        {section.content.educations?.map((edu: EducationSectionItem) => (
                            <div
                                key={edu.id}
                                className={cn(
                                    "relative p-2 -mx-2 group/entry",
                                    isActive && "hover:bg-gray-50 rounded",
                                    darkMode && isActive && "hover:bg-slate-700 rounded",
                                )}
                                onContextMenu={(e) => handleContextMenu(e, edu.id)}
                            >
                                {isActive && (
                                    <div className="absolute right-2 top-2 opacity-0 group-hover/entry:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn("h-6 w-6 hover:text-red-500", darkMode ? "text-gray-300" : "text-gray-400")}
                                            onClick={() => handleRemoveEducation(edu.id)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                )}

                                {edu.visibility?.gpa !== false && (
                                    <EditableText
                                        value={edu.gpa}
                                        onChange={(value) => handleEducationChange("gpa", value)}
                                        className={cn("font-medium", darkMode && "text-white")}
                                    />
                                )}

                                {edu.visibility?.location !== false && (
                                    <EditableText
                                        value={edu.location}
                                        onChange={(value) => handleEducationChange("location", value)}
                                        className={cn(darkMode ? "text-teal-300" : "text-teal-500")}
                                    />
                                )}

                                {edu.visibility?.period !== false && (
                                    <div className="flex items-center">
                                        <Calendar size={12} className="mr-1" />
                                        <EditableText
                                            value={edu.period}
                                            onChange={(value) => handleEducationChange("period", value)}
                                            className={cn("font-normal", darkMode && "text-white")}
                                        />
                                    </div>
                                )}

                                <div
                                    className={cn("flex items-center text-sm mt-1 gap-4", darkMode ? "text-gray-300" : "text-gray-500")}
                                >
                                    {edu.visibility?.period !== false && (
                                        <div className="flex items-center">
                                            <Calendar size={12} className="mr-1" />
                                            <EditableText
                                                value={edu.period}
                                                onChange={(value) => handleEducationChange("period", value)}
                                                className="text-sm"
                                            />
                                        </div>
                                    )}

                                    {edu.visibility?.location !== false && (
                                        <div className="flex items-center">
                                            <MapPin size={12} className="mr-1" />
                                            <EditableText
                                                value={edu.location}
                                                onChange={(value) => handleEducationChange("location", value)}
                                                className="text-sm"
                                            />
                                        </div>
                                    )}
                                </div>

                                {edu.visibility?.bullets !== false && (
                                    <ul className="list-disc pl-5 mt-1">
                                        {edu.bullets.map((bullet, index) => (
                                            <li key={index} className={cn("text-sm", darkMode && "text-gray-300")}>
                                                <EditableText
                                                    value={bullet}
                                                    onChange={(value) => {
                                                        const newBullets = [...edu.bullets]
                                                        newBullets[index] = value
                                                        handleEducationChange("bullets", newBullets)
                                                    }}
                                                    className="text-sm"
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}

                        {(!section.content.educations || section.content.educations.length === 0) && isActive && (
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn("w-full mt-2", darkMode && "border-slate-600 text-white hover:bg-slate-700")}
                                onClick={handleAddEducation}
                            >
                                <PlusCircle size={14} className="mr-1" />
                                Add Entry
                            </Button>
                        )}
                    </div>
                    {/* Add Ends */}
                </div>
            ))}

            {isActive && (
                <div className="flex">
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                        onClick={handleAddEducation}
                    >
                        <Plus size={16} className="mr-1" /> Entry
                    </Button>
                </div>
            )}

            {showSettings && activeEducationId && (
                <div
                    ref={settingsRef}
                    className="fixed z-50"
                    style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
                >
                    <EducationSettingsPanel
                        education={section.content.educations?.find((lang) => lang.id === activeEducationId) || null}
                        onToggleVisibility={handleToggleVisibility}
                        onClose={() => setShowSettings(false)}
                    />
                </div>
            )}
        </div>
    )
}
