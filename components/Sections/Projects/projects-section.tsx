"use client"

import type React from "react"

import { useDispatch, useSelector } from "react-redux"
import { updateEntryProject } from "@/lib/features/resume/resumeSlice"
import EditableText from "@/components/Shared/editable-text"
import { cn } from "@/lib/utils"
import { SectionProps, type ProjectSectionItem } from "@/lib/types"
import { Calendar, Link } from "lucide-react"
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
        <div className="space-y-4">
            {section.content.projects?.map((item: ProjectSectionItem) => (
                <div key={item.id}
                    className={cn(
                        "relative p-2 -mx-2 group/entry",
                        isActive && "hover:bg-gray-50 rounded",
                        darkMode && isActive && "hover:bg-slate-700 rounded",
                        activeSection?.entryId === item.id && 'selected-resume-item'
                    )}
                    onContextMenu={(e) => handleContextMenu(e, item.id)}
                    onClick={(e) => handleEntryToggle(e, item.id)}
                >
                    <div className="flex flex-nowrap">
                        <div className="col ml-0 flex-1">
                            <div className="flex items-center justify-start">
                                <EditableText
                                    value={item.projectName}
                                    onChange={(value) => handleEntryUpdate(item.id, "projectName", value)}
                                    className={cn("editable-field", darkMode && "text-white")}
                                    placeholder="Project Name"
                                />
                            </div>
                            {(item.visibility?.period !== false || item.visibility?.location !== false) && (
                                <div className="flex items-start justify-start gap-5">
                                    {item.visibility?.period !== false && (
                                        <div className="flex items-start justify-start gap-2">
                                            <Calendar className="w-2 h-2" />
                                            <EditableText
                                                value={item.period}
                                                onChange={(value) => handleEntryUpdate(item.id, "period", value)}
                                                className={cn("editable-field date-range-field", darkMode && "text-white")}
                                                placeholder="Date period"
                                            />
                                        </div>
                                    )}

                                    {item.visibility?.location !== false && (
                                        <div className="flex items-start justify-start gap-2">
                                            <EditableText
                                                value={item.location}
                                                onChange={(value) => handleEntryUpdate(item.id, "location", value)}
                                                className={cn("editable-field location-field", darkMode && "text-white")}
                                                placeholder="Location"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {item.visibility?.link !== false && (
                                <div className="flex items-start justify-start gap-2">
                                    <Link className="w-2 h-2" />
                                    <EditableText
                                        value={item.link}
                                        onChange={(value) => handleEntryUpdate(item.id, "link", value)}
                                        className={cn("editable-field", darkMode && "text-white")}
                                        placeholder="URL"
                                    />
                                </div>
                            )}

                            {item.visibility?.description !== false && (
                                <div className="flex items-start justify-start gap-2">
                                    <Link className="w-2 h-2" />
                                    <EditableText
                                        value={item.description}
                                        onChange={(value) => handleEntryUpdate(item.id, "description", value)}
                                        className={cn("editable-field", darkMode && "text-white")}
                                        placeholder="Short summary of your work"
                                    />
                                </div>
                            )}

                            <div className="flex flex-align-start flex-justify-space-between flex-nowrap">
                                {item.visibility?.bullets !== false && (
                                    <ul className="list-disc pl-5 mt-1">
                                        {item.bullets.map((bullet, index) => (
                                            <li key={index} className={cn("text-sm", darkMode && "text-gray-300")}>
                                                <EditableText
                                                    value={bullet}
                                                    onChange={(value) => {
                                                        const newBullets = [...item.bullets]
                                                        newBullets[index] = value
                                                        handleEntryUpdate(item.id, "bullets", newBullets)
                                                    }}
                                                    className="text-sm"
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
