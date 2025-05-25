"use client"

import { useRef, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { EducationContentVisibility, EducationSectionItem } from "@/lib/types"

interface SettingsPanelProps {
    education: EducationSectionItem | null
    onToggleVisibility: (field: keyof EducationContentVisibility, value: boolean) => void
    onClose: () => void
}

export default function EducationSettingsPanel({
    education,
    onToggleVisibility,
    onClose,
}: SettingsPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [onClose])

    if (!education) return null

    return (
        <div ref={panelRef} className="EducationSettingsPanel bg-white rounded-md shadow-lg border border-gray-200 w-auto p-4 space-y-3 mt-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="show-proficiency" className="text-sm">
                    Show GPA
                </Label>
                <Switch
                    id="show-proficiency"
                    checked={education.visibility?.gpa !== false}
                    onCheckedChange={(checked) => onToggleVisibility("gpa", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-location" className="text-sm">
                    Show Location
                </Label>
                <Switch
                    id="show-location"
                    checked={education.visibility?.location !== false}
                    onCheckedChange={(checked) => onToggleVisibility("location", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-period" className="text-sm">
                    Show Period
                </Label>
                <Switch
                    id="show-period"
                    checked={education.visibility?.period !== false}
                    onCheckedChange={(checked) => onToggleVisibility("period", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-bullets" className="text-sm">
                    Show Bullets
                </Label>
                <Switch
                    id="show-bullets"
                    checked={education.visibility?.bullets !== false}
                    onCheckedChange={(checked) => onToggleVisibility("bullets", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-logo" className="text-sm">
                    Show Logo
                </Label>
                <Switch
                    id="show-logo"
                    checked={education.visibility?.logo !== false}
                    onCheckedChange={(checked) => onToggleVisibility("logo", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>
        </div>
    )
}
