"use client"

import type React from "react"

import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Settings, MoveVertical, ArrowRight, ArrowLeft } from "lucide-react"
import { removeSection, removeSectionEntry } from "@/lib/features/resume/resumeSlice"
import { cn } from "@/lib/utils"
import { type Section } from "@/lib/types"

interface SectionToolbarProps {
    section: Section
    activeEntryId: string | null
    onAddEntry: () => void
    onShowSettingsPanel: () => void
    onDragStart?: () => void
    onMoveToColumn?: (column: "left" | "right") => void
    darkMode?: boolean
}

export default function SectionToolbar({
    section,
    activeEntryId,
    onAddEntry,
    onShowSettingsPanel,
    onDragStart,
    onMoveToColumn,
    darkMode = false,
}: SectionToolbarProps) {
    const dispatch = useDispatch()

    const handleRemoveSection = () => {
        if (activeEntryId) {
            dispatch(
                removeSectionEntry({
                    sectionId: section.id,
                    entryId: activeEntryId
                }),
            )
        } else {
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
        <div data-activeentryid={activeEntryId}
            className={cn(
                "SectionToolbar border border-gray-200 rounded-md shadow-sm flex",
                darkMode ? "bg-slate-700" : "bg-white",
            )}
        >
            {onAddEntry && (
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
            >
                <Trash2 size={16} className={darkMode ? "text-white" : ""} />
            </Button>

            <Button
                variant={darkMode ? "default" : "ghost"}
                size="sm"
                className={cn("h-8 w-8 rounded-r-md cursor-pointer", darkMode ? "bg-slate-700 hover:bg-slate-600" : "hover:bg-gray-100")}
                onClick={onShowSettingsPanel}
            >
                <Settings size={16} className={darkMode ? "text-white" : ""} />
            </Button>
        </div>
    )
}
