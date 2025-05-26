"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
// import { addAchievement, updateAchievement, removeAchievement } from "@/lib/features/resume/resumeSlice"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Info, Award } from "lucide-react"
import EditableText from "@/components/editable-text"
import { cn } from "@/lib/utils"
import type { Section } from "@/lib/types"
// import type { Section, Achievement } from "@/lib/types"

interface AchievementsSectionProps {
    section: Section
    isActive: boolean
    darkMode?: boolean
}

export default function AchievementsSection({ section, isActive, darkMode = false }: AchievementsSectionProps) {
    const dispatch = useDispatch()
    // const achievements = section.content.achievements || []
    const [selectedIcon, setSelectedIcon] = useState<string>("info")

    const handleAddAchievement = () => {
        // dispatch(
        //     addAchievement({
        //         sectionId: section.id,
        //         achievement: {
        //             id: `achievement-${Date.now()}`,
        //             title: "New Achievement",
        //             description: "Achievement description",
        //             icon: selectedIcon,
        //         },
        //     }),
        // )
    }

    const handleUpdateAchievement = (achievementId: string, field: string, value: string) => {
        // dispatch(
        //     updateAchievement({
        //         sectionId: section.id,
        //         achievementId,
        //         field,
        //         value,
        //     }),
        // )
    }

    const handleRemoveAchievement = (achievementId: string) => {
        // dispatch(
        //     removeAchievement({
        //         sectionId: section.id,
        //         achievementId,
        //     }),
        // )
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
        <div className="space-y-4">
            {/* {achievements.map((achievement: Achievement) => (
                <div
                    key={achievement.id}
                    className={cn(
                        "relative p-2 -mx-2 group/achievement flex items-start",
                        isActive && "hover:bg-gray-50 rounded",
                    )}
                >
                    {isActive && (
                        <div className="absolute right-2 top-2 opacity-0 group-hover/achievement:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-400 hover:text-red-500"
                                onClick={() => handleRemoveAchievement(achievement.id)}
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    )}

                    <div className="bg-teal-100 rounded-full p-2 mr-3 text-teal-500 flex-shrink-0">
                        {renderIcon(achievement.icon)}
                    </div>

                    <div className="flex-1">
                        <EditableText
                            value={achievement.title}
                            onChange={(value) => handleUpdateAchievement(achievement.id, "title", value)}
                            className="font-medium"
                        />
                        <EditableText
                            value={achievement.description}
                            onChange={(value) => handleUpdateAchievement(achievement.id, "description", value)}
                            className="text-sm text-gray-600"
                            multiline
                        />
                    </div>
                </div>
            ))} */}

            {isActive && (
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={handleAddAchievement}>
                    <Plus size={14} className="mr-1" />
                    Add Achievement
                </Button>
            )}
        </div>
    )
}
