"use client"

import { useRef, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { ProjectContentVisibility, ProjectSectionItem } from "@/lib/types"

interface SettingsPanelProps {
    projectItem: ProjectSectionItem | null
    onToggleVisibility: (field: keyof ProjectContentVisibility, value: boolean) => void
    onClose: () => void
}

export default function ProjectsSettingsPanel({
    projectItem,
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

    if (!projectItem) return null

    return (
        <div ref={panelRef} className="ProjectsSettingsPanel bg-white rounded-md shadow-lg border border-gray-200 w-auto p-4 space-y-3 mt-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="show-description" className="text-sm">
                    Show Description
                </Label>
                <Switch
                    id="show-description"
                    checked={projectItem.visibility?.description !== false}
                    onCheckedChange={(checked) => onToggleVisibility("description", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-bullets" className="text-sm">
                    Show Bullets
                </Label>
                <Switch
                    id="show-bullets"
                    checked={projectItem.visibility?.bullets !== false}
                    onCheckedChange={(checked) => onToggleVisibility("bullets", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-location" className="text-sm">
                    Show Location
                </Label>
                <Switch
                    id="show-location"
                    checked={projectItem.visibility?.location !== false}
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
                    checked={projectItem.visibility?.period !== false}
                    onCheckedChange={(checked) => onToggleVisibility("period", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-link" className="text-sm">
                    Show Link
                </Label>
                <Switch
                    id="show-link"
                    checked={projectItem.visibility?.link !== false}
                    onCheckedChange={(checked) => onToggleVisibility("link", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>
        </div>
    )
}
