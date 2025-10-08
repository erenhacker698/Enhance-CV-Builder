"use client"

import { useRef, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { VolunteeringItem } from "@/lib/types"

interface SettingsPanelProps {
  item: VolunteeringItem | null
  onToggleVisibility: (field: keyof NonNullable<VolunteeringItem["visibility"]>, value: boolean) => void
  onClose: () => void
}

export default function VolunteeringSettingsPanel({ item, onToggleVisibility, onClose }: SettingsPanelProps) {
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

  if (!item) return null

  return (
    <div ref={panelRef} className="VolunteeringSettingsPanel bg-white rounded-md shadow-lg border border-gray-200 w-auto p-4 space-y-3 mt-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="show-period" className="text-sm">
          Show Period
        </Label>
        <Switch
          id="show-period"
          checked={item.visibility?.period !== false}
          onCheckedChange={(checked) => onToggleVisibility("period", checked)}
          className="data-[state=checked]:bg-teal-500 cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-description" className="text-sm">
          Show Description
        </Label>
        <Switch
          id="show-description"
          checked={item.visibility?.description !== false}
          onCheckedChange={(checked) => onToggleVisibility("description", checked)}
          className="data-[state=checked]:bg-teal-500 cursor-pointer"
        />
      </div>
    </div>
  )
}
