"use client"

import { useRef, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import type { IndustryExpertiseItem } from "@/lib/types"

interface IndustryExpertiseSettingsPanelProps {
  item: IndustryExpertiseItem | null
  onChange: (patch: Partial<IndustryExpertiseItem>) => void
  onClose: () => void
}

const styles: Array<{ key: NonNullable<IndustryExpertiseItem['style']>; label: string }> = [
  { key: "solid", label: "Solid" },
  { key: "striped", label: "Striped" },
  { key: "dashed", label: "Dashed" },
  { key: "diagonal", label: "Diagonal" },
  { key: "gradient", label: "Gradient" },
]

export default function IndustryExpertiseSettingsPanel({ item, onChange, onClose }: IndustryExpertiseSettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  if (!item) return null

  const palette = [
    "#14b8a6", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6",
    "#f59e0b", "#ef4444", "#22c55e", "#94a3b8", "#111827"
  ]

  const ColorSwatches = ({ value, onPick }: { value?: string; onPick: (v: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {palette.map((c) => (
        <button
          key={c}
          type="button"
          className="w-6 h-6 rounded-full border border-gray-300"
          style={{ backgroundColor: c, boxShadow: value === c ? '0 0 0 2px #14b8a6' : undefined }}
          onClick={() => onPick(c)}
          aria-label={`Pick ${c}`}
        />
      ))}
    </div>
  )

  return (
    <div ref={panelRef} className="IndustryExpertiseSettingsPanel bg-white rounded-md shadow-lg border border-gray-200 w-[320px] p-4 space-y-4 mt-2">
      <div className="space-y-2">
        <Label className="text-sm">Bar Color</Label>
        <ColorSwatches value={item.color} onPick={(v) => onChange({ color: v })} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Hex</span>
          <input
            type="text"
            value={item.color || "#14b8a6"}
            onChange={(e) => onChange({ color: e.target.value })}
            className="flex-1 border rounded px-2 py-1 text-sm"
          />
          <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: item.color || '#14b8a6' }} />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Bar Style</Label>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {styles.map((s) => (
            <button
              key={s.key}
              className={`border rounded px-2 py-1 text-left hover:border-teal-500 ${item.style === s.key ? 'border-teal-500 ring-1 ring-teal-500' : 'border-gray-200'}`}
              onClick={() => onChange({ style: s.key })}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {item.style === 'gradient' && (
        <div className="space-y-2">
          <Label className="text-sm">Second Color (Gradient)</Label>
          <ColorSwatches value={item.gradientTo} onPick={(v) => onChange({ gradientTo: v })} />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Hex</span>
            <input
              type="text"
              value={item.gradientTo || "#0ea5e9"}
              onChange={(e) => onChange({ gradientTo: e.target.value })}
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: item.gradientTo || '#0ea5e9' }} />
          </div>
        </div>
      )}

      <div className="flex justify-end pt-1">
        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
      </div>
    </div>
  )
}
