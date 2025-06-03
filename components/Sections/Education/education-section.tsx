"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import { updateEntryEducation } from "@/lib/features/resume/resumeSlice"
import EditableText from "@/components/Shared/editable-text"
import { cn } from "@/lib/utils"
import { SectionTypeEnum, type EducationSectionItem, type Section } from "@/lib/types"

interface SectionProps {
    section: Section
    isActive: boolean
    darkMode?: boolean
    handleContextMenu: (e: React.MouseEvent, entryId?: string) => void
    handleEntrySwitch: (e: React.MouseEvent, entryId: string) => void
    handleActivateSection: () => void
    // handleAddEntry: (sectionType: SectionTypeEnum, sectionId: string) => void
    // handleDragStartSection: () => void
    // handleMoveToColumn: (targetColumn: "left" | "right") => void
}

export default function EducationSection({ section, isActive, darkMode = false, handleContextMenu, handleEntrySwitch, handleActivateSection }: SectionProps) {
    const dispatch = useDispatch()
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null)

    const handleEntryToggle = (e: React.MouseEvent, entryId: string) => {
        // console.log("Inside handleEntryToggle: ", entryId)
        e.stopPropagation()
        setActiveEntryId(entryId)
        handleEntrySwitch(e, entryId)
        handleActivateSection()
    }

    const handleEntryChange = (entryId: string, field: keyof EducationSectionItem, value: string | string[]) => {
        // e.stopPropagation()
        console.log("-----------------------------------------------------------------------")
        console.log("Inside handleEntryChange")
        if (activeEntryId) {
            console.log("entryId - ", entryId)
            console.log("field - ", field)
            console.log("value - ", value)
            dispatch(
                updateEntryEducation({
                    sectionId: section.id,
                    entryId: entryId,
                    field,
                    value
                })
            )
        }
    }

    const handleContextClick = (e: React.MouseEvent, entryId?: string) => {
        console.log("Inside handleContextClick")
        e.stopPropagation()
        if (entryId) {
            setActiveEntryId(entryId)
        } else {
            setActiveEntryId(null)
        }
        handleContextMenu(e, entryId)
    }

    // const handleToggleVisibility = (field: keyof EducationContentVisibility, value: boolean) => {
    //     if (activeEntryId) {
    //         dispatch(
    //             toggleEntryVisibility_Education({
    //                 sectionId: section.id,
    //                 entryId: activeEntryId,
    //                 field,
    //                 value
    //             }),
    //         )
    //     }
    // }

    return (
        <div className="space-y-4">
            {section.content.educations?.map((edu: EducationSectionItem) => (
                <div key={edu.id}
                    className={cn(
                        "relative p-2 -mx-2 group/entry",
                        isActive && "hover:bg-gray-50 rounded",
                        darkMode && isActive && "hover:bg-slate-700 rounded",
                        activeEntryId === edu.id && 'selected-resume-item'
                    )}
                    onContextMenu={(e) => handleContextClick(e, edu.id)}
                    onClick={(e) => handleEntryToggle(e, edu.id)}
                >
                    <div className="flex flex-nowrap">
                        {edu.visibility?.logo !== false && (
                            <div className="mr-4 col-auto company-logo relative cursor-pointer overflow-hidden rounded-full education__logo-upload">
                            </div>
                        )}

                        <div className="col ml-0 flex-1">
                            <div className="flex flex-align-start flex-justify-space-between flex-nowrap">
                                <EditableText
                                    value={edu.degree}
                                    onChange={(value) => handleEntryChange(edu.id, "degree", value)}
                                    className={cn("editable-field", darkMode && "text-white")}
                                    placeholder="Degree and Field of Study"
                                />

                                {edu.visibility?.period !== false && (
                                    <EditableText
                                        value={edu.period}
                                        onChange={(value) => handleEntryChange(edu.id, "period", value)}
                                        className={cn("editable-field date-range-field", darkMode && "text-white")}
                                        placeholder="Date period"
                                    />
                                )}
                            </div>

                            <div className="flex flex-align-start flex-justify-space-between flex-nowrap">
                                <EditableText
                                    value={edu.school}
                                    onChange={(value) => handleEntryChange(edu.id, "school", value)}
                                    className={cn("font-medium editable-field education__school-name", darkMode && "text-white")}
                                    placeholder="School or University"
                                />

                                {edu.visibility?.location !== false && (
                                    <div className="flex items-end">
                                        <EditableText
                                            value={edu.location}
                                            onChange={(value) => handleEntryChange(edu.id, "location", value)}
                                            className={cn("editable-field location-field", darkMode && "text-white")}
                                            placeholder="location"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-align-start flex-justify-space-between flex-nowrap">
                                {edu.visibility?.bullets !== false && (
                                    <ul className="list-disc pl-5 mt-1">
                                        {edu.bullets.map((bullet, index) => (
                                            <li key={index} className={cn("text-sm", darkMode && "text-gray-300")}>
                                                <EditableText
                                                    value={bullet}
                                                    onChange={(value) => {
                                                        const newBullets = [...edu.bullets]
                                                        newBullets[index] = value
                                                        handleEntryChange(edu.id, "bullets", newBullets)
                                                    }}
                                                    className="text-sm"
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="education__gpa-element">
                                {edu.visibility?.gpa !== false && (
                                    <>
                                        <span className="education__gpa-label">gpa</span>
                                        <EditableText
                                            value={edu.gpa}
                                            onChange={(value) => handleEntryChange(edu.id, "gpa", value)}
                                            className={cn("font-medium editable-field", darkMode && "text-white")}
                                            placeholder="3.8 / 4.0"
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
