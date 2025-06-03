"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { updateEntrySkillGroup, removeEntrySkillGroup, removeEntrySkill, updateEntrySkill, setActiveSkillData, } from "@/lib/features/resume/resumeSlice"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Section, SkillSectionItem } from "@/lib/types"
import EditableText from "../../Shared/editable-text"

interface SectionProps {
    section: Section
    isActive: boolean
    darkMode?: boolean
    handleContextMenu: (e: React.MouseEvent, entryId?: string) => void
    handleEntrySwitch: (e: React.MouseEvent, entryId: string) => void
    handleActivateSection: () => void
    handleAddGroup?: () => void
}

export default function SkillsSection({ section, isActive, darkMode = false, handleContextMenu, handleEntrySwitch, handleActivateSection }: SectionProps) {
    const skillSectionRef = useRef<HTMLDivElement>(null)
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null)
    const dispatch = useDispatch()

    const handleSkillOp = (sectionId: string, groupId: string, index: number) => {
        dispatch(
            setActiveSkillData({
                sectionId,
                groupId,
                skillIndex: index
            })
        )
    }

    const handleupdateEntrySkill = (groupId: string, skillIndex: number, newSkill: string) => {
        if (activeEntryId) {
            dispatch(
                updateEntrySkill({
                    sectionId: section.id,
                    groupId,
                    skillIndex,
                    newSkill
                })
            )
        }
    }

    const handleremoveEntrySkill = (groupId: string, skillIndex: number) => {
        dispatch(
            removeEntrySkill({
                sectionId: section.id,
                groupId,
                skillIndex,
            }),
        )
    }

    const handleRemoveGroup = (groupId: string) => {
        dispatch(
            removeEntrySkillGroup({
                sectionId: section.id,
                groupId,
            }),
        )
    }

    const handleUpdate = (groupId: string, name: string) => {
        dispatch(
            updateEntrySkillGroup({
                sectionId: section.id,
                groupId,
                groupName: name
            }),
        )
    }

    const handleEntryToggle = (e: React.MouseEvent, entryId: string) => {
        e.stopPropagation()
        setActiveEntryId(entryId)
        handleEntrySwitch(e, entryId,)
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                skillSectionRef.current &&
                !skillSectionRef.current.contains(event.target as Node)
            ) {
                dispatch(setActiveSkillData((null)))
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="space-y-4">
            {section.content.skills?.map((skillGroupItem: SkillSectionItem) => (
                <div key={skillGroupItem.id}
                    className={cn(
                        "relative p-2 -mx-2 group/entry",
                        isActive && "hover:bg-gray-50 rounded",
                        darkMode && isActive && "hover:bg-slate-700 rounded",
                        activeEntryId === skillGroupItem.id && 'selected-resume-item'
                    )}
                    onContextMenu={(e) => handleContextClick(e, skillGroupItem.id)}
                    onClick={(e) => handleEntryToggle(e, skillGroupItem.id)}
                >
                    {skillGroupItem.visibility?.groupName && (
                        <div className="flex items-center justify-start">
                            <EditableText
                                value={skillGroupItem.groupName ?? ''}
                                onChange={(value) => handleUpdate(skillGroupItem.id, value)}
                                className={cn("editable-field text-custom-teal mb-2", darkMode && "text-white")}
                                placeholder="Group Title"
                            />
                        </div>
                    )}

                    {isActive && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "absolute right-0 top-0 h-6 w-6",
                                darkMode ? "text-gray-300 hover:text-red-400" : "text-gray-400 hover:text-red-500",
                            )}
                            onClick={() => handleRemoveGroup(skillGroupItem.id)}
                            title="Remove Skills Group"
                        >
                            <X size={14} />
                        </Button>
                    )}

                    <div className="flex flex-wrap gap-2 mb-2">
                        {skillGroupItem.skills.map((skill, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "px-2 py-1 flex items-center",
                                    isActive && "group/skill",
                                    darkMode ? "border-gray-500 text-white" : "border-gray-300",
                                    skillGroupItem.compactMode ? "border" : "border-b"
                                )}
                            >
                                <EditableText
                                    value={skill}
                                    onChange={(value) => handleupdateEntrySkill(skillGroupItem.id, index, value)}
                                    onStartEdit={() => handleSkillOp(section.id, skillGroupItem.id, index)}
                                    className={cn("editable-field editable-field--skill w-max bg-transparent border-none focus:outline-none text-sm flex items-center justify-start", darkMode && "text-white")}
                                    placeholder="Your Skill"
                                />
                                {isActive && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-4 w-4 ml-1 opacity-0 group-hover/skill:opacity-100",
                                            darkMode ? "text-gray-300 hover:text-red-400" : "text-gray-400 hover:text-red-500",
                                        )}
                                        onClick={() => handleremoveEntrySkill(skillGroupItem.id, index)}
                                    >
                                        <X size={10} />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
