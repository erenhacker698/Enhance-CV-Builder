"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useDispatch } from "react-redux"
import {
    toggleProjectContentVisibility,
    addProject,
    updateProject,
    removeProject,
} from "@/lib/features/resume/resumeSlice"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Settings, MoveVertical, Calendar, MapPin, PlusCircle } from "lucide-react"
import EditableText from "@/components/editable-text"
import { cn } from "@/lib/utils"
import { ProjectContentVisibility, type ProjectSectionItem, type Section } from "@/lib/types"
import EducationSettingsPanel from "./education-settings-panel"

interface SectionProps {
    section: Section
    isActive: boolean
    darkMode?: boolean
}

export default function ProjectSection({ section, isActive, darkMode = false }: SectionProps) {
    const dispatch = useDispatch()
    const [showSettings, setShowSettings] = useState(false)
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
    const settingsRef = useRef<HTMLDivElement>(null)

    const handleAddProject = () => {
        dispatch(
            addProject({
                sectionId: section.id,
                project: {
                    id: `project-${Date.now()}`,
                    projectName:'',
                    description: '',
                    link:'',
                    period:'',
                    location:'',
                    bullets:[],
                    visibility:{
                        bullets:true,
                        description:true,
                        link:true,
                        location:true,
                        period:true
                    }
                },
            }),
        )
    }

    const handleUpdateProject = (projectId: string, field: string, value: string | string[]) => {
        dispatch(
            updateProject({
                sectionId: section.id,
                projectId,
                field,
                value
            }),
        )
    }

    const handleRemoveProject = (projectId: string) => {
        dispatch(
            removeProject({
                sectionId: section.id,
                projectId
            }),
        )
    }

    const handleSettingsClick = (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation()
        setActiveProjectId(projectId)
        setMenuPosition({ x: e.clientX, y: e.clientY })
        setShowSettings(true)
    }

    const handleProjectChange = (field: keyof ProjectContentVisibility, value: string | string[]) => {
        if (activeProjectId) {
            dispatch(
                updateProject({
                    sectionId: section.id,
                    projectId: activeProjectId,
                    field,
                    value
                })
            )
        }
    }

    const handleToggleVisibility = (field: keyof ProjectContentVisibility, value: boolean) => {
        if (activeProjectId) {
            dispatch(
                toggleProjectContentVisibility({
                    sectionId: section.id,
                    entryId: activeProjectId,
                    field,
                    value
                }),
            )
        }
    }

    const handleContextMenu = (e: React.MouseEvent, entryId?: string) => {
        e.preventDefault()
        if (entryId) {
            setActiveProjectId(entryId)
        } else {
            setActiveProjectId(null)
        }
        setMenuPosition({ x: e.clientX, y: e.clientY })
        // setShowVisibilityMenu(true)
    }

    return (
        <div className="space-y-4">
            {section.content.projects?.map((education: ProjectSectionItem) => (
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
                                onClick={() => handleRemoveProject(education.id)}
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    )}

                    {/* Add Start */}
                    <div className="space-y-4">
                        {section.content.projects?.map((project: ProjectSectionItem) => (
                            <div
                                key={project.id}
                                className={cn(
                                    "relative p-2 -mx-2 group/entry",
                                    isActive && "hover:bg-gray-50 rounded",
                                    darkMode && isActive && "hover:bg-slate-700 rounded",
                                )}
                                onContextMenu={(e) => handleContextMenu(e, project.id)}
                            >
                                {isActive && (
                                    <div className="absolute right-2 top-2 opacity-0 group-hover/entry:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn("h-6 w-6 hover:text-red-500", darkMode ? "text-gray-300" : "text-gray-400")}
                                            onClick={() => handleRemoveProject(project.id)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                )}

                                {project.visibility?.description !== false && (
                                    <EditableText
                                        value={project.description}
                                        onChange={(value) => handleProjectChange("description", value)}
                                        className={cn("font-medium", darkMode && "text-white")}
                                    />
                                )}

                                {project.visibility?.location !== false && (
                                    <EditableText
                                        value={project.location}
                                        onChange={(value) => handleProjectChange("location", value)}
                                        className={cn(darkMode ? "text-teal-300" : "text-teal-500")}
                                    />
                                )}

                                {project.visibility?.link !== false && (
                                    <div className="flex items-center">
                                        <Calendar size={12} className="mr-1" />
                                        <EditableText
                                            value={project.link}
                                            onChange={(value) => handleProjectChange("link", value)}
                                            className={cn("font-normal", darkMode && "text-white")}
                                        />
                                    </div>
                                )}

                                <div
                                    className={cn("flex items-center text-sm mt-1 gap-4", darkMode ? "text-gray-300" : "text-gray-500")}
                                >
                                    {project.visibility?.period !== false && (
                                        <div className="flex items-center">
                                            <Calendar size={12} className="mr-1" />
                                            <EditableText
                                                value={project.period}
                                                onChange={(value) => handleProjectChange("period", value)}
                                                className="text-sm"
                                            />
                                        </div>
                                    )}

                                    {project.visibility?.location !== false && (
                                        <div className="flex items-center">
                                            <MapPin size={12} className="mr-1" />
                                            <EditableText
                                                value={project.location}
                                                onChange={(value) => handleProjectChange("location", value)}
                                                className="text-sm"
                                            />
                                        </div>
                                    )}
                                </div>

                                {project.visibility?.bullets !== false && (
                                    <ul className="list-disc pl-5 mt-1">
                                        {project.bullets.map((bullet, index) => (
                                            <li key={index} className={cn("text-sm", darkMode && "text-gray-300")}>
                                                <EditableText
                                                    value={bullet}
                                                    onChange={(value) => {
                                                        const newBullets = [...project.bullets]
                                                        newBullets[index] = value
                                                        handleProjectChange("bullets", newBullets)
                                                    }}
                                                    className="text-sm"
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}

                        {(!section.content.projects || section.content.projects.length === 0) && isActive && (
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn("w-full mt-2", darkMode && "border-slate-600 text-white hover:bg-slate-700")}
                                onClick={handleAddProject}
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
                        onClick={handleAddProject}
                    >
                        <Plus size={16} className="mr-1" /> Entry
                    </Button>
                </div>
            )}

            {/* {showSettings && activeProjectId && (
                <div
                    ref={settingsRef}
                    className="fixed z-50"
                    style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
                >
                    <EducationSettingsPanel
                        education={section.content.projects?.find((lang) => lang.id === activeProjectId) || null}
                        onToggleVisibility={handleToggleVisibility}
                        onClose={() => setShowSettings(false)}
                    />
                </div>
            )} */}
        </div>
    )
}
