"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import {
    addLanguage,
    updateLanguage,
    removeLanguage,
    toggleLanguageVisibility
} from "@/lib/features/resume/resumeSlice"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Settings, MoveVertical } from "lucide-react"
import EditableText from "@/components/Shared/editable-text"
import { cn } from "@/lib/utils"
import LanguageSettingsPanel from "@/components/Sections/Language/SettingsPannel/language-settings-panel"
import { proficiencyLabels, type LanguageSectionItem, type Section } from "@/lib/types"

interface SectionProps {
    section: Section
    isActive: boolean
    darkMode?: boolean
    handleContextMenu: (e: React.MouseEvent, entryId?: string) => void
    handleEntrySwitch: (e: React.MouseEvent, entryId: string) => void
    handleActivateSection: () => void
}

export default function LanguageSection({ section, isActive, darkMode = false, handleContextMenu, handleEntrySwitch, handleActivateSection }: SectionProps) {
    const dispatch = useDispatch()
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null)
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sectionRef.current && !sectionRef.current.contains(event.target as Node)) {
                setActiveEntryId(null)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])


    const handleEntryToggle = (e: React.MouseEvent, entryId: string) => {
        e.stopPropagation()
        setActiveEntryId(entryId)
        handleEntrySwitch(e, entryId)
        handleActivateSection()
    }

    const handleContextClick = (e: React.MouseEvent, entryId?: string) => {
        e.stopPropagation()
        if (entryId) {
            setActiveEntryId(entryId)
        } else {
            setActiveEntryId(null)
        }
        handleContextMenu(e, entryId)
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

    return (
        <div ref={sectionRef} className="space-y-1">
            {section.content.languages?.map((language: LanguageSectionItem) => (
                <div
                    key={language.id}
                    className={cn(
                        "relative p-2 -mx-2 group/entry border border-transparent",
                        isActive && "hover:bg-gray-50 hover:border-gray-200 rounded-md",
                        darkMode && isActive && "hover:bg-slate-700 rounded",
                        activeEntryId === language.id && 'selected-resume-item'
                    )}
                    onContextMenu={(e) => handleContextClick(e, language.id)}
                    onClick={(e) => handleEntryToggle(e, language.id)}
                >

                    <div className="flex items-center justify-between">
                        <EditableText
                            value={language.name}
                            onChange={(value) => handleUpdateLanguage(language.id, "name", value)}
                            className={cn("editable-field", darkMode && "text-white")}
                            placeholder="Language"
                        />

                        <div className="flex items-center justify-end gap-2">
                            {language.visibility?.proficiency !== false && (
                                <EditableText
                                    value={language.level}
                                    onChange={(value) => handleUpdateLanguage(language.id, "level", value)}
                                    className="text-sm"
                                />
                            )}
                            {language.visibility?.slider !== false && (
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <div
                                            key={rating}
                                            className={cn(
                                                "w-4 h-4 rounded-full mx-0.5 cursor-pointer",
                                                rating <= language.proficiency ? "bg-teal-500" : "bg-gray-200",
                                            )}
                                            onClick={() => handleUpdateLanguage(language.id, "proficiency", rating)}
                                        ></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
