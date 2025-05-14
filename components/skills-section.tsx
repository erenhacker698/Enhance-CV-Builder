"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import {
    addSkill,
    removeSkill,
    addSkillGroup,
    removeSkillGroup,
    updateSkillGroup,
} from "@/lib/features/resume/resumeSlice"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Section, SkillGroup } from "@/lib/types"

interface SkillsSectionProps {
    section: Section
    isActive: boolean
}

export default function SkillsSection({ section, isActive }: SkillsSectionProps) {
    const dispatch = useDispatch()
    const [newSkill, setNewSkill] = useState("")
    const skillGroups = section.content.skillGroups || []

    const handleAddSkill = (groupId: string) => {
        if (newSkill.trim()) {
            dispatch(
                addSkill({
                    sectionId: section.id,
                    groupId,
                    skill: newSkill.trim(),
                }),
            )
            setNewSkill("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent, groupId: string) => {
        if (e.key === "Enter" && newSkill.trim()) {
            e.preventDefault()
            handleAddSkill(groupId)
        }
    }

    const handleRemoveSkill = (groupId: string, skillIndex: number) => {
        dispatch(
            removeSkill({
                sectionId: section.id,
                groupId,
                skillIndex,
            }),
        )
    }

    const handleAddGroup = () => {
        dispatch(
            addSkillGroup({
                sectionId: section.id,
                skillGroup: {
                    id: `group-${Date.now()}`,
                    name: "New Group",
                    skills: [],
                },
            }),
        )
    }

    const handleRemoveGroup = (groupId: string) => {
        dispatch(
            removeSkillGroup({
                sectionId: section.id,
                groupId,
            }),
        )
    }

    const handleUpdateGroupName = (groupId: string, name: string) => {
        dispatch(
            updateSkillGroup({
                sectionId: section.id,
                groupId,
                name,
            }),
        )
    }

    // If no skill groups exist, create a default one
    if (skillGroups.length === 0 && isActive) {
        return (
            <Button variant="outline" size="sm" className="w-full mt-2" onClick={handleAddGroup}>
                <Plus size={14} className="mr-1" />
                Add Skill Group
            </Button>
        )
    }

    return (
        <div className="space-y-4">
            {skillGroups.map((group: SkillGroup) => (
                <div key={group.id} className="relative">
                    {isActive && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-6 w-6 text-gray-400 hover:text-red-500"
                            onClick={() => handleRemoveGroup(group.id)}
                        >
                            <X size={14} />
                        </Button>
                    )}

                    <div className="flex flex-wrap gap-2 mb-2">
                        {group.skills.map((skill, index) => (
                            <div
                                key={index}
                                className={cn("px-2 py-1 bg-gray-100 rounded-md flex items-center", isActive && "group/skill")}
                            >
                                <span>{skill}</span>
                                {isActive && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1 text-gray-400 hover:text-red-500 opacity-0 group-hover/skill:opacity-100"
                                        onClick={() => handleRemoveSkill(group.id, index)}
                                    >
                                        <X size={10} />
                                    </Button>
                                )}
                            </div>
                        ))}

                        {isActive && (
                            <div className="px-2 py-1 bg-gray-100 rounded-md">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, group.id)}
                                    placeholder="Your Skill"
                                    className="w-20 bg-transparent border-none focus:outline-none text-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {isActive && (
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={handleAddGroup}>
                    <Plus size={14} className="mr-1" />
                    Add Skill Group
                </Button>
            )}
        </div>
    )
}
