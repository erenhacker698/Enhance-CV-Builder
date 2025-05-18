"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useDispatch } from "react-redux"
import {
    addLanguage,
    updateLanguage,
    removeLanguage,
    toggleLanguageVisibility,
    toggleSliderStyle,
} from "@/lib/features/resume/resumeSlice"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Settings, MoveVertical } from "lucide-react"
import EditableText from "@/components/editable-text"
import { cn } from "@/lib/utils"
import LanguageSettingsPanel from "@/components/language-settings-panel"
import type { Language, Section } from "@/lib/types"

interface EducationSectionProps {
    section: Section
    isActive: boolean
    darkMode?: boolean
}

export default function EducationSection({ section, isActive, darkMode = false }: EducationSectionProps) {
    const dispatch = useDispatch()
    const [showSettings, setShowSettings] = useState(false)
    const [activeLanguageId, setActiveLanguageId] = useState<string | null>(null)
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
    const settingsRef = useRef<HTMLDivElement>(null)

    const handleAddLanguage = () => {
        dispatch(
            addLanguage({
                sectionId: section.id,
                language: {
                    id: `lang-${Date.now()}`,
                    name: "Language",
                    level: "Beginner",
                    proficiency: 1,
                    visibility: {
                        proficiency: true,
                        slider: true,
                    },
                    sliderStyle: 0,
                },
            }),
        )
    }

    const handleUpdateLanguage = (langId: string, field: string, value: string | number) => {
        dispatch(
            updateLanguage({
                sectionId: section.id,
                langId,
                field,
                value,
            }),
        )

        // Update proficiency level text based on rating
        if (field === "proficiency") {
            const proficiencyIndex = Math.min(Math.max(1, Number(value)), 5) - 1
            dispatch(
                updateLanguage({
                    sectionId: section.id,
                    langId,
                    field: "level",
                    value: proficiencyLabels[proficiencyIndex],
                }),
            )
        }
    }

    const handleRemoveLanguage = (langId: string) => {
        dispatch(
            removeLanguage({
                sectionId: section.id,
                langId,
            }),
        )
    }

    const handleSettingsClick = (e: React.MouseEvent, langId: string) => {
        e.stopPropagation()
        setActiveLanguageId(langId)
        setMenuPosition({ x: e.clientX, y: e.clientY })
        setShowSettings(true)
    }

    const handleToggleVisibility = (field: string, value: boolean) => {
        if (activeLanguageId) {
            dispatch(
                toggleLanguageVisibility({
                    sectionId: section.id,
                    langId: activeLanguageId,
                    field,
                    value,
                }),
            )
        }
    }

    const handleToggleSliderStyle = (value: number) => {
        if (activeLanguageId) {
            dispatch(
                toggleSliderStyle({
                    sectionId: section.id,
                    langId: activeLanguageId,
                    value,
                }),
            )
        }
    }

    return (
        <div className="space-y-4">
            {section.content.languages?.map((language: Language) => (
                <div
                    key={language.id}
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
                                onClick={(e) => handleSettingsClick(e, language.id)}
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
                                onClick={() => handleRemoveLanguage(language.id)}
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    )}

                    <div className="font-medium">
                        <EditableText
                            value={language.name}
                            onChange={(value) => handleUpdateLanguage(language.id, "name", value)}
                            className="font-medium"
                        />
                    </div>

                    {language.visibility?.proficiency !== false && (
                        <div className="text-gray-500 text-sm">
                            <EditableText
                                value={language.level}
                                onChange={(value) => handleUpdateLanguage(language.id, "level", value)}
                                className="text-sm"
                            />
                        </div>
                    )}

                    {language.visibility?.slider !== false && (
                        <div className="flex mt-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <div
                                    key={rating}
                                    className={cn(
                                        "w-5 h-5 rounded-full mx-0.5 cursor-pointer",
                                        rating <= language.proficiency ? "bg-teal-500" : "bg-gray-200",
                                    )}
                                    onClick={() => handleUpdateLanguage(language.id, "proficiency", rating)}
                                ></div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {isActive && (
                <div className="flex">
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                        onClick={handleAddLanguage}
                    >
                        <Plus size={16} className="mr-1" /> Entry
                    </Button>
                </div>
            )}

            {showSettings && activeLanguageId && (
                <div
                    ref={settingsRef}
                    className="fixed z-50"
                    style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
                >
                    <LanguageSettingsPanel
                        language={section.content.languages?.find((lang) => lang.id === activeLanguageId) || null}
                        onToggleVisibility={handleToggleVisibility}
                        onToggleSliderStyle={handleToggleSliderStyle}
                        onClose={() => setShowSettings(false)}
                    />
                </div>
            )}
        </div>
    )
}
