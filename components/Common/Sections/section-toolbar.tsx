"use client"

import type React from "react"

import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Settings, MoveVertical, ArrowRight, ArrowLeft } from "lucide-react"
import { removeEntrySkill, removeSection, removeSectionEntry, setActiveSkillData, upsertActiveSection } from "@/lib/features/resume/resumeSlice"
import { cn } from "@/lib/utils"
import { SectionTypeEnum, type Section } from "@/lib/types"
import { RootState } from "@/lib/store"

interface SectionToolbarProps {
    section: Section
    isActive: boolean
    onAddEntry: () => void
    onAddGroup?: () => void
    onShowSettingsPanel: () => void
    onDragStart?: () => void
    onMoveToColumn?: (column: "left" | "right") => void
    darkMode?: boolean
}

export default function SectionToolbar({
    section,
    isActive,
    onAddEntry,
    onAddGroup,
    onShowSettingsPanel,
    onDragStart,
    onMoveToColumn,
    darkMode = false,
}: SectionToolbarProps) {
    const dispatch = useDispatch()
    const { activeSkillData } = useSelector((state: RootState) => state.resume)
    const activeSection = useSelector((state: RootState) => state.resume.activeSection)

    const handleRemoveSection = () => {
        console.log('activeSection.id: ', activeSection?.id)
        console.log('activeSection.entryId: ', activeSection?.entryId)
        console.log('activeSkillData.skillIndex: ', activeSkillData?.skillIndex)
        if (activeSection && activeSection.type === SectionTypeEnum.SKILLS && activeSection.entryId && activeSkillData && typeof activeSkillData.skillIndex === 'number') {
            console.log('11111111111111111111111111111111')
            dispatch(
                removeEntrySkill({
                    sectionId: activeSection.id,
                    groupId: activeSection.entryId,
                    skillIndex: activeSkillData.skillIndex,
                }),
            )
            dispatch(
                setActiveSkillData((null))
            )
        } else if (activeSection?.entryId) {
            console.log('2222222222222222222222222222222')
            dispatch(
                removeSectionEntry({
                    sectionId: activeSection.id,
                    entryId: activeSection.entryId
                }),
            )
            dispatch(
                upsertActiveSection({
                    activeSection: null
                })
            )
        } else {
            console.log('3333333333333333333333333333333')
            dispatch(removeSection({ sectionId: section.id }))
        }
    }

    const handleDragStart = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onDragStart) {
            onDragStart()
        }
    }

    const handleMoveToColumn = (e: React.MouseEvent, column: "left" | "right") => {
        e.stopPropagation()
        if (onMoveToColumn) {
            onMoveToColumn(column)
        }
    }

    return (
        <div className={cn(
            "SectionToolbar border border-gray-200 rounded-md shadow-sm flex",
            darkMode ? "bg-slate-700" : "bg-white",
        )}
        >
            {(section.type !== SectionTypeEnum.SKILLS || activeSection?.entryId) && onAddEntry && (
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 px-3 text-white rounded-l-md rounded-r-none border-r hover:text-white cursor-pointer",
                        darkMode
                            ? "bg-teal-600 hover:bg-teal-700 border-teal-700"
                            : "bg-teal-500 hover:bg-teal-600 border-teal-600",
                    )}
                    onClick={(e) => {
                        e.stopPropagation()
                        onAddEntry()
                    }}
                >
                    <Plus size={16} className="mr-1" /> Entry
                </Button>
            )}

            {onAddGroup && section.type === SectionTypeEnum.SKILLS && (
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 px-3 text-white rounded-none hover:text-white cursor-pointer",
                        activeSection?.entryId
                            ? ""
                            : "transition-none rounded-l-md rounded-r-none border-r",
                        darkMode
                            ? "bg-purple-600 hover:bg-purple-700 border-purple-700"
                            : "bg-purple-500 hover:bg-purple-600 border-purple-600",
                    )}
                    onClick={(e) => {
                        e.stopPropagation()
                        onAddGroup()
                    }}
                >
                    <Plus size={16} className="mr-1" /> Group
                </Button>
            )}

            {section.column === "left" && (
                <Button
                    variant={darkMode ? "default" : "ghost"}
                    size="sm"
                    className={cn("h-8 w-8", darkMode ? "bg-slate-700 hover:bg-slate-600" : "hover:bg-gray-100")}
                    onClick={(e) => handleMoveToColumn(e, "right")}
                    title="Move to right column"
                >
                    <ArrowRight size={16} className={darkMode ? "text-white" : ""} />
                </Button>
            )}

            {section.column === "right" && (
                <Button
                    variant={darkMode ? "default" : "ghost"}
                    size="sm"
                    className={cn("h-8 w-8", darkMode ? "bg-slate-700 hover:bg-slate-600" : "hover:bg-gray-100")}
                    onClick={(e) => handleMoveToColumn(e, "left")}
                    title="Move to left column"
                >
                    <ArrowLeft size={16} className={darkMode ? "text-white" : ""} />
                </Button>
            )}

            <Button
                variant={darkMode ? "default" : "ghost"}
                size="sm"
                className={cn("h-8 w-8 cursor-move", darkMode ? "bg-slate-700 hover:bg-slate-600" : "hover:bg-gray-100")}
                draggable
                onMouseDown={handleDragStart}
            >
                <MoveVertical size={16} className={darkMode ? "text-white" : ""} />
            </Button>

            <Button
                variant={darkMode ? "default" : "ghost"}
                size="sm"
                className={cn("h-8 w-8 cursor-pointer", darkMode ? "bg-slate-700 hover:bg-slate-600" : "hover:bg-gray-100")}
                onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveSection()
                }}
                data-entry-remove--toolbar-btn
            >
                <Trash2 size={16} className={darkMode ? "text-white" : ""} />
            </Button>

            {activeSection?.entryId && (
                <Button
                    variant={darkMode ? "default" : "ghost"}
                    size="sm"
                    className={cn("h-8 w-8 rounded-r-md cursor-pointer", darkMode ? "bg-slate-700 hover:bg-slate-600" : "hover:bg-gray-100")}
                    onClick={onShowSettingsPanel}
                >
                    <Settings size={16} className={darkMode ? "text-white" : ""} />
                </Button>
            )}
        </div>
    )
}
