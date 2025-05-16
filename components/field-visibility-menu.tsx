"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import type { FieldVisibility } from "@/lib/types"

interface FieldVisibilityMenuProps {
    position: { x: number; y: number }
    onClose: () => void
    visibility: FieldVisibility
    onToggle: (field: keyof FieldVisibility, value: boolean) => void
}

export default function FieldVisibilityMenu({ position, onClose, visibility, onToggle }: FieldVisibilityMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [onClose])

    const fields = [
        { key: "title" as const, label: "Show Title" },
        { key: "subtitle" as const, label: "Show Company Name" },
        { key: "description" as const, label: "Show Description" },
        { key: "bullets" as const, label: "Show Bullets" },
        { key: "location" as const, label: "Show Location" },
        { key: "dateRange" as const, label: "Show Period" },
        { key: "link" as const, label: "Show Link" },
        { key: "logo" as const, label: "Show Company Logo" },
    ]

    // Adjust position to ensure menu stays within viewport
    const adjustedPosition = {
        x: Math.min(position.x, window.innerWidth - 250),
        y: Math.min(position.y, window.innerHeight - 300),
    }

    return createPortal(
        <div
            ref={menuRef}
            className="fixed bg-white rounded-md shadow-lg border border-gray-200 z-50 w-64"
            style={{
                top: `${adjustedPosition.y}px`,
                left: `${adjustedPosition.x}px`,
            }}
        >
            <div className="p-3 space-y-3">
                {fields.map((field) => (
                    <div key={field.key} className="flex items-center justify-between">
                        <span className="text-sm">{field.label}</span>
                        <div
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${visibility[field.key] ? "bg-teal-500" : "bg-gray-200"
                                }`}
                            onClick={() => onToggle(field.key, !visibility[field.key])}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${visibility[field.key] ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>,
        document.body,
    )
}
