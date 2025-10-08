"use client"
import { cn } from "@/lib/utils"
import type { Section, MyTimeItem, SectionProps } from "@/lib/types"

export default function MyTimeSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
  const items = section.content.my_time ?? []
  const total = Math.max(1, items.reduce((s, i) => s + (i.value || 0), 0))
  const r = 60
  const c = 2 * Math.PI * r

  let offset = 0
  const segments = items.map((it) => {
    const len = (it.value / total) * c
    const seg = { dash: `${len} ${c - len}`, offset, color: it.color || "#14b8a6" }
    offset -= len
    return { ...seg, label: it.label }
  })

  return (
    <div className={cn("MyTime-Section flex items-start gap-4", darkMode && "text-white")}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        <g transform="translate(80,80)">
          <circle r={r} cx="0" cy="0" stroke="#e5e7eb" strokeWidth="20" fill="none" />
          {segments.map((seg, idx) => (
            <circle
              key={idx}
              r={r}
              cx="0"
              cy="0"
              fill="none"
              stroke={seg.color}
              strokeWidth="20"
              strokeDasharray={seg.dash}
              strokeDashoffset={seg.offset / (2 * Math.PI * r) * (2 * Math.PI * r)}
              transform="rotate(-90)"
            />
          ))}
          <circle r={r - 22} cx="0" cy="0" fill="white" />
        </g>
      </svg>

      <div className="flex-1 grid grid-cols-1 gap-2">
        {items.map((it, i) => (
          <div key={it.id} className="flex items-center gap-2 cursor-pointer" onClick={(e) => handleEntryToggle(e, it.id)} onContextMenu={(e) => handleContextMenu(e, it.id)}>
            <span className="inline-block w-3 h-3 rounded-sm" style={{ background: it.color || "#14b8a6" }} />
            <span className="text-sm">{String.fromCharCode(65 + i)}</span>
            <span className="text-sm">{it.label} {typeof it.value === 'number' ? `- ${it.value}%` : ''}</span>
          </div>
        ))}
      </div>
    </div>
  )
}