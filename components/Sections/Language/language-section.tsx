"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    updateEntryLanguage,
    upsertActiveSection,
} from "@/lib/features/resume/resumeSlice"
import EditableText from "@/components/Shared/editable-text"
import { cn } from "@/lib/utils"
import { proficiencyLabels, SectionProps, type LanguageSectionItem, type Section } from "@/lib/types"
import { RootState } from "@/lib/store"

export default function LanguageSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
    const dispatch = useDispatch()
    const activeSection = useSelector((state: RootState) => state.resume.activeSection)

    const handleEntryUpdate = (langId: string, field: string, value: string | number) => {
        dispatch(
            updateEntryLanguage({
                sectionId: section.id,
                langId,
                field,
                value,
            }),
        )

        if (field === "proficiency") {
            const proficiencyIndex = Math.min(Math.max(1, Number(value)), 5) - 1
            dispatch(
                updateEntryLanguage({
                    sectionId: section.id,
                    langId,
                    field: "level",
                    value: proficiencyLabels[proficiencyIndex],
                }),
            )
        }
    }

    return (
        <div className="Language-Section space-y-1">
            {section.content.languages?.map((language: LanguageSectionItem) => (
                <div
                    key={language.id}
                    className={cn(
                        "relative p-2 -mx-2 group/entry border border-transparent",
                        isActive && "hover:bg-gray-50 hover:border-gray-200",
                        darkMode && isActive && "hover:bg-slate-700",
                        activeSection?.entryId === language.id && 'p-[7px] selected-resume-item'
                    )}
                    onContextMenu={(e) => handleContextMenu(e, language.id)}
                    onClick={(e) => handleEntryToggle(e, language.id)}
                >

                    <div className="flex items-center justify-between">
                        <EditableText
                            value={language.name}
                            onChange={(value) => handleEntryUpdate(language.id, "name", value)}
                            className={cn("editable-field", darkMode && "!text-white")}
                            placeholder="Language"
                        />

                        <div className="flex items-center justify-end gap-2">
                            {language.visibility?.proficiency !== false && (
                                <EditableText
                                    value={language.level}
                                    onChange={(value) => handleEntryUpdate(language.id, "level", value)}
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
                                            onClick={() => handleEntryUpdate(language.id, "proficiency", rating)}
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
