"use client"

import { useRef, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Language } from "@/lib/types"

interface LanguageSettingsPanelProps {
    language: Language | null
    onToggleVisibility: (field: string, value: boolean) => void
    onToggleSliderStyle: (value: number) => void
    onClose: () => void
}

export default function LanguageSettingsPanel({
    language,
    onToggleVisibility,
    onToggleSliderStyle,
    onClose,
}: LanguageSettingsPanelProps) {
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
        <div ref={panelRef} className="bg-white rounded-md shadow-lg border border-gray-200 w-64 p-4 space-y-3">
            <div className="flex items-center justify-between">
                <Label htmlFor="show-proficiency" className="text-sm">
                    Show Proficiency
                </Label>
                <Switch
                    id="show-proficiency"
                    checked={language.visibility?.proficiency !== false}
                    onCheckedChange={(checked) => onToggleVisibility("proficiency", checked)}
                    className="data-[state=checked]:bg-teal-500"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-slider" className="text-sm">
                    Show Slider
                </Label>
                <Switch
                    id="show-slider"
                    checked={language.visibility?.slider !== false}
                    onCheckedChange={(checked) => onToggleVisibility("slider", checked)}
                    className="data-[state=checked]:bg-teal-500"
                />
            </div>

            <div className="border-t border-gray-200 pt-3">
                <Label className="text-sm block mb-2">Slider Style</Label>
                <div className="flex items-center space-x-2">
                    {[0, 1, 2, 3, 4].map((style) => (
                        <div
                            key={style}
                            className={`w-6 h-6 rounded-full border cursor-pointer ${language.sliderStyle === style ? "border-teal-500 bg-teal-100" : "border-gray-300"
                                }`}
                            onClick={() => onToggleSliderStyle(style)}
                        >
                            {language.sliderStyle === style && <div className="w-4 h-4 bg-teal-500 rounded-full m-auto mt-1"></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
