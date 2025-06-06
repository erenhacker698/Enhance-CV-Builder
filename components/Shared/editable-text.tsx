"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface EditableTextProps {
    value: string
    onChange: (value: string) => void
    onStartEdit?: () => void
    className?: string
    multiline?: boolean
    placeholder?: string
    onKeyDown?: (e: React.KeyboardEvent) => void
}

export default function EditableText({
    value,
    onChange,
    onStartEdit,
    className,
    multiline = false,
    placeholder = "Click to edit",
    onKeyDown
}: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

    useEffect(() => {
        setEditValue(value)
    }, [value])

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()

            if ("setSelectionRange" in inputRef.current) {
                const length = inputRef.current.value.length
                inputRef.current.setSelectionRange(length, length)
            }
        }
    }, [isEditing])

    const handleClick = () => {
        setIsEditing(true)
        onStartEdit?.()
    }

    const handleBlur = () => {
        setIsEditing(false)
        onChange(editValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            setIsEditing(false)
            onChange(editValue)
        }

        if (e.key === "Escape") {
            setIsEditing(false)
            setEditValue(value)
        }

        onKeyDown?.(e)
    }

    if (isEditing) {
        if (multiline) {
            return (
                <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "cursor-text",
                        className,
                    )}
                    rows={3}
                    placeholder={placeholder}
                />
            )
        }

        return (
            <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={cn(
                    "cursor-text",
                    className,
                )}
                placeholder={placeholder}
            />
        )
    }

    return (
        <div onClick={handleClick} className={cn("cursor-text", !value && "text-gray-400", className)}>
            {value || placeholder}
        </div>
    )
}
