"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, ChevronDown, Type, Calendar, Settings, MoveVertical } from "lucide-react"
import { removeSection } from "@/lib/features/resume/resumeSlice"
import type { Section } from "@/lib/types"

interface SectionToolbarProps {
    section: Section
    onAddEntry?: () => void
    onDragStart?: () => void
}

export default function SectionToolbar({ section, onAddEntry, onDragStart }: SectionToolbarProps) {
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

    return (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-md shadow-sm flex z-10">
            {section.type === "entries" && onAddEntry && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 bg-teal-500 text-white hover:bg-teal-600 rounded-l-md rounded-r-none border-r border-teal-600"
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
                        className="h-8 px-3 bg-teal-500 text-white hover:bg-teal-600 rounded-l-md rounded-r-none border-r border-teal-600"
                    >
                        <Plus size={16} className="mr-1" /> Skill
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-none border-r border-indigo-700"
                    >
                        <Plus size={16} className="mr-1" /> Group
                    </Button>
                </>
            )}

            {section.type === "languages" && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 bg-teal-500 text-white hover:bg-teal-600 rounded-l-md rounded-r-none border-r border-teal-600"
                >
                    <Plus size={16} className="mr-1" /> Language
                </Button>
            )}

            {section.type === "achievements" && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 bg-teal-500 text-white hover:bg-teal-600 rounded-l-md rounded-r-none border-r border-teal-600"
                >
                    <Plus size={16} className="mr-1" /> Achievement
                </Button>
            )}

            {section.type === "custom" && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 bg-teal-500 text-white hover:bg-teal-600 rounded-l-md rounded-r-none border-r border-teal-600"
                >
                    <Plus size={16} className="mr-1" /> Item
                </Button>
            )}

            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 hover:bg-gray-100"
                onClick={(e) => {
                    e.stopPropagation()
                    setShowDropdown(!showDropdown)
                }}
            >
                <ChevronDown size={16} />
            </Button>

            <Button variant="ghost" size="sm" className="h-8 w-8 hover:bg-gray-100">
                <Type size={16} />
            </Button>

            <Button variant="ghost" size="sm" className="h-8 w-8 hover:bg-gray-100">
                <Calendar size={16} />
            </Button>

            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 hover:bg-gray-100"
                onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveSection()
                }}
            >
                <Trash2 size={16} />
            </Button>

            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 hover:bg-gray-100 cursor-move"
                draggable
                onMouseDown={handleDragStart}
            >
                <MoveVertical size={16} />
            </Button>

            <Button variant="ghost" size="sm" className="h-8 w-8 hover:bg-gray-100 rounded-r-md">
                <Settings size={16} />
            </Button>
        </div>
    )
}
