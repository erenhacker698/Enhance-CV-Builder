"use client"

import { useRef, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { LanguageContentVisibility, LanguageSectionItem } from "@/lib/types"

interface SettingsPanelProps {
    language: LanguageSectionItem | null
    onToggleVisibility: (field: keyof LanguageContentVisibility, value: boolean) => void
    onClose: () => void
}

export default function LanguageSettingsPanel({
    language,
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

    if (!language) return null

    return (
        <div ref={panelRef} className="SkillsSettingsPanel bg-white rounded-md shadow-lg border border-gray-200 w-auto p-4 space-y-3 mt-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="show-proficiency" className="text-sm">
                    Show Proficiency
                </Label>
                <Switch
                    id="show-proficiency"
                    checked={language.visibility?.proficiency !== false}
                    onCheckedChange={(checked) => onToggleVisibility("proficiency", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-slider" className="text-sm">
                    Compact Slider
                </Label>
                <Switch
                    id="show-slider"
                    checked={language.visibility?.slider !== false}
                    onCheckedChange={(checked) => onToggleVisibility("slider", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>
        </div>
    )
}
