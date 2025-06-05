"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateEntrySkillGroup, removeEntrySkillGroup, removeEntrySkill, updateEntrySkill, setActiveSkillData, } from "@/lib/features/resume/resumeSlice"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SectionProps, SkillSectionItem } from "@/lib/types"
import EditableText from "../../Shared/editable-text"
import { RootState } from "@/lib/store"

interface ExtendedSectionProps extends SectionProps {
    handleAddGroup?: () => void;
}

export default function SkillsSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: ExtendedSectionProps) {
    const dispatch = useDispatch()
    const activeSection = useSelector((state: RootState) => state.resume.activeSection)
    const skillSectionRef = useRef<HTMLDivElement>(null)

    const handleSetActiveSkillData = (sectionId: string, groupId: string, index: number) => {
        dispatch(
            setActiveSkillData({
                sectionId,
                groupId,
                skillIndex: index
            })
        )
    }

    const handleEntrySkillUpdate = (groupId: string, skillIndex: number, newSkill: string) => {
        dispatch(
            updateEntrySkill({
                sectionId: section.id,
                groupId,
                skillIndex,
                newSkill
            })
        )
    }

    const handleRemoveEntrySkill = (groupId: string, skillIndex: number) => {
        dispatch(
            removeEntrySkill({
                sectionId: section.id,
                groupId,
                skillIndex,
            }),
        )
    }

    const handleRemoveEntrySkillGroup = (groupId: string) => {
        dispatch(
            removeEntrySkillGroup({
                sectionId: section.id,
                groupId,
            }),
        )
    }

    const handleEntryUpdate = (groupId: string, name: string) => {
        dispatch(
            updateEntrySkillGroup({
                sectionId: section.id,
                groupId,
                groupName: name
            }),
        )
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement

            if (target.closest('[data-entry-remove--toolbar-btn]')) return

            if (
                skillSectionRef.current &&
                !skillSectionRef.current.contains(target)
            ) {
                dispatch(setActiveSkillData(null))
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="">
            {section.content.skills?.map((skillGroupItem: SkillSectionItem) => (
                <div data-skill-group-item-id={skillGroupItem.id} data-active-sectionid={activeSection?.entryId} key={skillGroupItem.id}
                    className={cn(
                        "relative rounded p-2 -mx-2 group/entry transition-all duration-300 ease-in-out",
                        isActive && "",
                        darkMode && isActive && "",
                        activeSection?.entryId === skillGroupItem.id && 'selected-resume-item'
                    )}
                    onContextMenu={(e) => handleContextMenu(e, skillGroupItem.id)}
                    onClick={(e) => handleEntryToggle(e, skillGroupItem.id)}
                >
                    {skillGroupItem.visibility?.groupName && (
                        <div className="flex items-center justify-start">
                            <EditableText
                                value={skillGroupItem.groupName ?? ''}
                                onChange={(value) => handleEntryUpdate(skillGroupItem.id, value)}
                                className={cn("editable-field text-custom-teal mb-2", darkMode && "text-white")}
                                placeholder="Group Title"
                            />
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {skillGroupItem.skills.map((skill, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "relative px-2 py-1 flex items-center",
                                    isActive && "group/skill",
                                    darkMode ? "border-gray-500 text-white" : "border-gray-300",
                                    skillGroupItem.visibility?.compactMode ? "border" : "border-b"
                                )}
                                ref={skillSectionRef}
                            >
                                <EditableText
                                    value={skill}
                                    onChange={(value) => handleEntrySkillUpdate(skillGroupItem.id, index, value)}
                                    onStartEdit={() => handleSetActiveSkillData(section.id, skillGroupItem.id, index)}
                                    className={cn("editable-field editable-field--skill w-max bg-transparent border-none focus:outline-none text-sm flex items-center justify-start", darkMode && "text-white")}
                                    placeholder="Your Skill"
                                />
                                {isActive && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "cursor-pointer w-0 h-0 opacity-0 rounded-full overflow-hidden transition-[width,height,opacity] duration-500 ease-in-out group-hover/skill:w-4 group-hover/skill:h-4 group-hover/skill:opacity-100 ml-2 bg-gray-200 text-gray-950"
                                        )}
                                        onClick={() => handleRemoveEntrySkill(skillGroupItem.id, index)}
                                    >
                                        <X className="w-full h-full custom-padding" />
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
