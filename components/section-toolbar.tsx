"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, ChevronDown, Type, Calendar, Settings, MoveVertical, ArrowRight, ArrowLeft } from "lucide-react"
import { removeSection } from "@/lib/features/resume/resumeSlice"
import { cn } from "@/lib/utils"
import type { Section } from "@/lib/types"

interface SectionToolbarProps {
    section: Section
    onAddEntry?: () => void
    onDragStart?: () => void
    onMoveToColumn?: (column: "left" | "right") => void
    darkMode?: boolean
}

export default function SectionToolbar({
    section,
    onAddEntry,
    onDragStart,
    onMoveToColumn,
    darkMode = false,
}: SectionToolbarProps) {
    const dispatch = useDispatch()
    const [showDropdown, setShowDropdown] = useState(false)

    const handleRemoveSection = () => {
        dispatch(removeSection({ sectionId: section.id }))
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
        <div
            className={cn(
                "absolute -top-4 left-1/2 transform -translate-x-1/2 border border-gray-200 rounded-md shadow-sm flex z-10",
                darkMode ? "bg-slate-700" : "bg-white",
            )}
        >
            {section.type === "entries" && onAddEntry && (
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 px-3 text-white rounded-l-md rounded-r-none border-r",
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

            {section.type === "skills" && (
                <>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "h-8 px-3 text-white rounded-l-md rounded-r-none border-r",
                            darkMode
                                ? "bg-teal-600 hover:bg-teal-700 border-teal-700"
                                : "bg-teal-500 hover:bg-teal-600 border-teal-600",
                        )}
                    >
                        <Plus size={16} className="mr-1" /> Skill
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "h-8 px-3 text-white rounded-none border-r",
                            darkMode
                                ? "bg-indigo-700 hover:bg-indigo-800 border-indigo-800"
                                : "bg-indigo-600 hover:bg-indigo-700 border-indigo-700",
                        )}
                    >
                        <Plus size={16} className="mr-1" /> Group
                    </Button>
                </>
            )}

            {section.type === "languages" && (
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 px-3 text-white rounded-l-md rounded-r-none border-r",
                        darkMode
                            ? "bg-teal-600 hover:bg-teal-700 border-teal-700"
                            : "bg-teal-500 hover:bg-teal-600 border-teal-600",
                    )}
                >
                    <Plus size={16} className="mr-1" /> Language
                </Button>
            )}

            {section.type === "achievements" && (
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 px-3 text-white rounded-l-md rounded-r-none border-r",
                        darkMode
                            ? "bg-teal-600 hover:bg-teal-700 border-teal-700"
                            : "bg-teal-500 hover:bg-teal-600 border-teal-600",
                    )}
                >
                    <Plus size={16} className="mr-1" /> Achievement
                </Button>
            )}

            {section.type === "custom" && (
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 px-3 text-white rounded-l-md rounded-r-none border-r",
                        darkMode
                            ? "bg-teal-600 hover:bg-teal-700 border-teal-700"
                            : "bg-teal-500 hover:bg-teal-600 border-teal-600",
                    )}
                >
                    <Plus size={16} className="mr-1" /> Item
                </Button>
            )}

            {/* Column movement buttons */}
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
                className={cn("h-8 w-8", darkMode ? "bg-slate-700 hover:bg-slate-600" : "hover:bg-gray-100")}
                onClick={(e) => {
                    e.stopPropagation()
                    setShowDropdown(!showDropdown)
                }}
            >
                <ChevronDown size={16} className={darkMode ? "text-white" : ""} />
            </Button>            

            <Button
                variant={darkMode ? "default" : "ghost"}
                size="sm"
                className={cn("h-8 w-8", darkMode ? "bg-slate-700 hover:bg-slate-600" : "hover:bg-gray-100")}
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
                className={cn("h-8 w-8 cursor-move", darkMode ? "bg-slate-700 hover:bg-slate-600" : "hover:bg-gray-100")}
                draggable
                onMouseDown={handleDragStart}
            >
                <MoveVertical size={16} className={darkMode ? "text-white" : ""} />
            </Button>

            <Button
                variant={darkMode ? "default" : "ghost"}
                size="sm"
                className={cn("h-8 w-8 rounded-r-md", darkMode ? "bg-slate-700 hover:bg-slate-600" : "hover:bg-gray-100")}
            >
                <Settings size={16} className={darkMode ? "text-white" : ""} />
            </Button>
        </div>
    )
}
