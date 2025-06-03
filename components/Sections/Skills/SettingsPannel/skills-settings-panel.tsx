"use client"

import { useRef, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { SkillVisibility, SkillSectionItem } from "@/lib/types"

interface SettingsPanelProps {
    skill: SkillSectionItem | null
    onToggleVisibility: (field: keyof SkillVisibility, value: boolean) => void
    onClose: () => void
}

export default function SkillsSettingsPanel({
    skill,
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

    if (!skill) return null

    return (
        <div ref={panelRef} className="SkillsSettingsPanel bg-white rounded-md shadow-lg border border-gray-200 w-auto p-4 space-y-3 mt-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="show-group-name" className="text-sm">
                    Show Group Name
                </Label>
                <Switch
                    id="show-group-name"
                    checked={skill.visibility?.groupName !== false}
                    onCheckedChange={(checked) => onToggleVisibility("groupName", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-compact-mode" className="text-sm">
                    Compact Mode
                </Label>
                <Switch
                    id="show-compact-mode"
                    checked={skill.visibility?.compactMode !== false}
                    onCheckedChange={(checked) => onToggleVisibility("compactMode", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>
        </div>
    )
}
