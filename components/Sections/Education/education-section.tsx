"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useDispatch, useSelector } from "react-redux"
import { updateEntryEducation } from "@/lib/features/resume/resumeSlice"
import EditableText from "@/components/Shared/editable-text"
import { SectionProps, type EducationSectionItem, type Section } from "@/lib/types"
import { RootState } from "@/lib/store"

export default function EducationSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
    const dispatch = useDispatch()
    const activeSection = useSelector((state: RootState) => state.resume.activeSection)

    const handleEntryUpdate = (entryId: string, field: keyof EducationSectionItem, value: string | string[]) => {
        dispatch(
            updateEntryEducation({
                sectionId: section.id,
                entryId: entryId,
                field,
                value
            })
        )
    }

    return (
        <div className="space-y-4">
            {section.content.educations?.map((edu: EducationSectionItem) => (
                <div key={edu.id}
                    className={cn(
                        "relative p-2 -mx-2 group/entry",
                        isActive && "hover:bg-gray-50 rounded",
                        darkMode && isActive && "hover:bg-slate-700 rounded",
                        activeSection?.entryId === edu.id && 'selected-resume-item'
                    )}
                    onContextMenu={(e) => handleContextMenu(e, edu.id)}
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
                                    onChange={(value) => handleEntryUpdate(edu.id, "degree", value)}
                                    className={cn("editable-field", darkMode && "text-white")}
                                    placeholder="Degree and Field of Study"
                                />

                                {edu.visibility?.period !== false && (
                                    <EditableText
                                        value={edu.period}
                                        onChange={(value) => handleEntryUpdate(edu.id, "period", value)}
                                        className={cn("editable-field date-range-field", darkMode && "text-white")}
                                        placeholder="Date period"
                                    />
                                )}
                            </div>

                            <div className="flex flex-align-start flex-justify-space-between flex-nowrap">
                                <EditableText
                                    value={edu.school}
                                    onChange={(value) => handleEntryUpdate(edu.id, "school", value)}
                                    className={cn("font-medium editable-field education__school-name", darkMode && "text-white")}
                                    placeholder="School or University"
                                />

                                {edu.visibility?.location !== false && (
                                    <div className="flex items-end">
                                        <EditableText
                                            value={edu.location}
                                            onChange={(value) => handleEntryUpdate(edu.id, "location", value)}
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
                                                        handleEntryUpdate(edu.id, "bullets", newBullets)
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
                                            onChange={(value) => handleEntryUpdate(edu.id, "gpa", value)}
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
