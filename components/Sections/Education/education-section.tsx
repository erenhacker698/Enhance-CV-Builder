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
        <div className="Education-Section space-y-4">
            {section.content.educations?.map((item: EducationSectionItem) => (
                <div key={item.id}
                    className={cn(
                        "resume-item-holder p-2 -mx-2 group/entry",
                        activeSection?.entryId === item.id
                            ? (darkMode && section.column === 'right'
                                ? 'selected-resume-item--dark p-[7px]'
                                : 'selected-resume-item p-[7px]')
                            : ''
                    )}
                    onContextMenu={(e) => handleContextMenu(e, item.id)}
                    onClick={(e) => handleEntryToggle(e, item.id)}
                >
                    <div className="flex items-start">
                        {item.visibility?.logo !== false && (
                            <div className="mr-4 col-auto company-logo relative cursor-pointer overflow-hidden rounded-full education__logo-upload">
                            </div>
                        )}

                        <div className="col ml-0 flex-1">
                            <div className="flex flex-col lg:flex-row items-start">
                                <EditableText
                                    value={item.degree}
                                    onChange={(value) => handleEntryUpdate(item.id, "degree", value)}
                                    className={cn("editable-field", darkMode && section.column === 'right' && "!text-white")}
                                    placeholder="Degree and Field of Study"
                                />

                                {item.visibility?.period !== false && (
                                    <EditableText
                                        value={item.period}
                                        onChange={(value) => handleEntryUpdate(item.id, "period", value)}
                                        className={cn("editable-field para-text-field text-right flex items-center justify-end", darkMode && section.column === 'right' && "!text-white")}
                                        placeholder="Date period"
                                    />
                                )}
                            </div>

                            <div className="flex flex-col lg:flex-row items-start">
                                <EditableText
                                    value={item.school}
                                    onChange={(value) => handleEntryUpdate(item.id, "school", value)}
                                    className={cn("font-medium editable-field education__school-name", darkMode && section.column === 'right' && "!text-white")}
                                    placeholder="School or University"
                                />

                                {item.visibility?.location !== false && (
                                    <EditableText
                                        value={item.location}
                                        onChange={(value) => handleEntryUpdate(item.id, "location", value)}
                                        className={cn("editable-field para-text-field text-right flex items-center justify-end", darkMode && section.column === 'right' && "!text-white")}
                                        placeholder="location"
                                    />
                                )}
                            </div>

                            {item.visibility?.bullets !== false && (
                                <div className="flex flex-align-start flex-justify-space-between mt-1">
                                    <ul className="list-disc pl-5 mt-1">
                                        {item.bullets.map((bullet, index) => (
                                            <li key={`${item.id}-${index}`} className={cn("editable-field para-text-field !list-item !overflow-visible !list-disc", darkMode && "text-gray-300")}>
                                                <EditableText
                                                    value={bullet}
                                                    onChange={(value) => {
                                                        const newBullets = [...item.bullets]
                                                        newBullets[index] = value
                                                        handleEntryUpdate(item.id, "bullets", newBullets)
                                                    }}
                                                    onKeyDown={(e) => {
                                                        const newBullets = [...item.bullets];

                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            newBullets.splice(index + 1, 0, "");
                                                            handleEntryUpdate(item.id, "bullets", newBullets);
                                                            setTimeout(() => {
                                                                const nextInput = document.querySelector(
                                                                    `[data-bullet-id="${item.id}-${index + 1}"]`
                                                                ) as HTMLInputElement;
                                                                nextInput?.focus();
                                                            }, 0);
                                                        }

                                                        else if (e.key === "Backspace" && bullet === "") {
                                                            e.preventDefault();
                                                            if (newBullets.length > 1) {
                                                                newBullets.splice(index, 1);
                                                                handleEntryUpdate(item.id, "bullets", newBullets);
                                                                setTimeout(() => {
                                                                    const prevInput = document.querySelector(
                                                                        `[data-bullet-id="${item.id}-${index - 1}"]`
                                                                    ) as HTMLInputElement;
                                                                    prevInput?.focus();
                                                                }, 0);
                                                            }
                                                        }
                                                    }}
                                                    className={cn("editable-field para-text-field", darkMode && section.column === 'right' && "!text-white")}
                                                    placeholder="Bullet points here..."
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="education__gpa-element">
                                {item.visibility?.gpa !== false && (
                                    <>
                                        <span className={cn("education__gpa-label", darkMode && section.column === 'right' && "!text-white")}>gpa</span>
                                        <EditableText
                                            value={item.gpa}
                                            onChange={(value) => handleEntryUpdate(item.id, "gpa", value)}
                                            className={cn("editable-field para-text-field", darkMode && section.column === 'right' && "!text-white")}
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
