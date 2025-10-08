"use client"

import { useRef, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { MyTimeItem, Section } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MyTimeSettingsPanelProps {
  item: MyTimeItem | null
  onChange: (patch: Partial<MyTimeItem>) => void
  onDelete?: () => void
  onClose: () => void
}

export default function MyTimeSettingsPanel({ item, onChange, onDelete, onClose }: MyTimeSettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [local, setLocal] = useState<MyTimeItem | null>(item)

  useEffect(() => setLocal(item), [item])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  if (!local) return null

  return (
    <div ref={panelRef} className={cn("MyTimeSettingsPanel bg-white rounded-md shadow-lg border border-gray-200 w-[280px] p-4 space-y-3 mt-2")}
    >
      <div className="space-y-2">
        <Label htmlFor="mt-label" className="text-sm">Label</Label>
        <input
          id="mt-label"
          type="text"
          value={local.label}
          onChange={(e) => {
            setLocal({ ...local, label: e.target.value })
            onChange({ label: e.target.value })
          }}
          className="w-full border rounded px-2 py-1 text-sm"
          placeholder="Designing"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mt-value" className="text-sm">Percentage</Label>
        <input
          id="mt-value"
          type="number"
          min={0}
          max={100}
          step={1}
          value={Number(local.value) || 0}
          onChange={(e) => {
            const v = Math.max(0, Math.min(100, Number(e.target.value)))
            setLocal({ ...local, value: v })
            onChange({ value: v })
          }}
          className="w-full border rounded px-2 py-1 text-sm"
          placeholder="20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mt-color" className="text-sm">Color</Label>
        <div className="flex items-center gap-2">
          <input
            id="mt-color"
            type="color"
            value={local.color || "#14b8a6"}
            onChange={(e) => {
              setLocal({ ...local, color: e.target.value })
              onChange({ color: e.target.value })
            }}
            className="w-10 h-8 p-0 border rounded cursor-pointer"
          />
          <input
            type="text"
            value={local.color || "#14b8a6"}
            onChange={(e) => {
              setLocal({ ...local, color: e.target.value })
              onChange({ color: e.target.value })
            }}
            className="flex-1 border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={onDelete}>Remove</Button>
        )}
      </div>
    </div>
  )
}
