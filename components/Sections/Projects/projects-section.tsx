"use client"

import type React from "react"

import { useDispatch, useSelector } from "react-redux"
import { updateEntryProject } from "@/lib/features/resume/resumeSlice"
import EditableText from "@/components/Shared/editable-text"
import { cn } from "@/lib/utils"
import { SectionProps, type ProjectSectionItem } from "@/lib/types"
import { Calendar, Link, MapPin } from "lucide-react"
import { RootState } from "@/lib/store"

export default function ProjectSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
    const dispatch = useDispatch()
    const activeSection = useSelector((state: RootState) => state.resume.activeSection)

    const handleEntryUpdate = (entryId: string, field: keyof ProjectSectionItem, value: string | string[]) => {
        dispatch(
            updateEntryProject({
                sectionId: section.id,
                projectId: entryId,
                field,
                value
            })
        )
    }

    return (
        <div className="Projects-Section space-y-4">
            {section.content.projects?.map((item: ProjectSectionItem) => (
                <div key={item.id}
                    className={cn(
                        "relative p-2 -mx-2 group/entry border border-transparent",
                        isActive && "hover:bg-gray-50 hover:border-gray-200",
                        darkMode && isActive && "hover:bg-slate-700",
                        activeSection?.entryId === item.id && 'p-[7px] selected-resume-item'
                    )}
                    onContextMenu={(e) => handleContextMenu(e, item.id)}
                    onClick={(e) => handleEntryToggle(e, item.id)}
                >
                    <div className="flex flex-col items-start justify-start">
                        <div className="flex items-center w-full mb-1.5">
                            <EditableText
                                value={item.projectName}
                                onChange={(value) => handleEntryUpdate(item.id, "projectName", value)}
                                className={cn("editable-field", darkMode && "text-white")}
                                placeholder="Project Name"
                            />
                            {item.visibility?.period !== false && (
                                <EditableText
                                    value={item.period}
                                    onChange={(value) => handleEntryUpdate(item.id, "period", value)}
                                    className={cn("editable-field para-text-field text-right", darkMode && "text-white")}
                                    placeholder="Date period"
                                />
                            )}
                        </div>

                        {item.visibility?.location !== false && (
                            <div className="flex items-center justify-start w-full">
                                <EditableText
                                    value={item.location}
                                    onChange={(value) => handleEntryUpdate(item.id, "location", value)}
                                    className={cn("editable-field para-text-field flex items-center justify-end", darkMode && "text-white")}
                                    placeholder="Location"
                                />
                            </div>
                        )}

                        {item.visibility?.description !== false && (
                            <div className="description-field flex items-start justify-start w-full pt-2">
                                <EditableText
                                    value={item.description}
                                    onChange={(value) => handleEntryUpdate(item.id, "description", value)}
                                    className={cn("editable-field para-text-field !w-full text-left flex items-center justify-start", darkMode && "text-white")}
                                    multiline={true}
                                    placeholder="Short summary of your work"
                                />
                            </div>
                        )}

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
                                                className="editable-field para-text-field"
                                                placeholder="Bullet points here..."
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {item.visibility?.link !== false && (
                            <div className="flex items-center justify-start gap-2 mt-1">
                                <Link className="shrink-0 w-3 h-3 text-gray-600" />
                                <EditableText
                                    value={item.link}
                                    onChange={(value) => handleEntryUpdate(item.id, "link", value)}
                                    className={cn("editable-field para-text-field !w-full text-left", darkMode && "text-white")}
                                    placeholder="Link here"
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
