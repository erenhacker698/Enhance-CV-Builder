"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Info, Award } from "lucide-react"
import EditableText from "@/components/Shared/editable-text"
import { cn } from "@/lib/utils"
import type { AchievementSectionItem, Section, SectionProps } from "@/lib/types"
import { RootState } from "@/lib/store"
import { updateAchievement } from "@/lib/features/resume/resumeSlice"

export default function AchievementsSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
    const dispatch = useDispatch()
    const activeSection = useSelector((state: RootState) => state.resume.activeSection)
    const { primaryColor } = useSelector((state: RootState) => state.settings)

    const handleEntryUpdate = (entryId: string, field: keyof AchievementSectionItem, value: string) => {
        dispatch(
            updateAchievement({
                sectionId: section.id,
                achievementId: entryId,
                field,
                value
            })
        )
    }

    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case "info":
                return <Info size={16} />
            case "award":
                return <Award size={16} />
            default:
                return <Info size={16} />
        }
    }

    return (
        <div className="Achievements-Section space-y-4">
            {section.content.achievements?.map((achievement: AchievementSectionItem) => (
                <div key={achievement.id}
                    className={cn(
                        "resume-item-holder p-2 -mx-2 group/entry",
                        activeSection?.entryId === achievement.id
                            ? (darkMode && section.column === 'right'
                                ? 'selected-resume-item--dark p-[7px]'
                                : 'selected-resume-item p-[7px]')
                            : ''
                    )}
                    onContextMenu={(e) => handleContextMenu(e, achievement.id)}
                    onClick={(e) => handleEntryToggle(e, achievement.id)}
                >
                    <div className="flex items-start">
                        {achievement.visibility?.icon !== false && (
                            <div className="rounded-full p-2 mr-3 flex-shrink-0" style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}>
                                {renderIcon(achievement.icon)}
                            </div>
                        )}

                        <div className="flex-1">
                            <EditableText
                                value={achievement.title}
                                onChange={(value) => handleEntryUpdate(achievement.id, "title", value)}
                                className={cn("editable-field", darkMode && section.column === 'right' && "!text-white")}
                                placeholder="Achievement Title"
                            />

                            {achievement.visibility?.description !== false && (
                                <div className="description-field flex items-start justify-start w-full pt-2">
                                    <EditableText
                                        value={achievement.description}
                                        onChange={(value) => handleEntryUpdate(achievement.id, "description", value)}
                                        className={cn("editable-field para-text-field !w-full text-left flex items-center justify-start", darkMode && section.column === 'right' && "!text-white")}
                                        multiline={true}
                                        placeholder="Short summary of your achievement"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
