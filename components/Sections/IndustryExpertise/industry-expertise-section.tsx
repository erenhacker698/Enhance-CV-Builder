"use client"

import { useDispatch, useSelector } from "react-redux"
import EditableText from "@/components/Shared/editable-text"
import { cn } from "@/lib/utils"
import { updateSectionContent } from "@/lib/features/resume/resumeSlice"
import type { SectionProps, IndustryExpertiseItem } from "@/lib/types"
import type { RootState } from "@/lib/store"

export default function IndustryExpertiseSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
  const dispatch = useDispatch()
  const activeSection = useSelector((s: RootState) => s.resume.activeSection)
  const items = section.content.industry_expertise ?? []

  const updateItem = (id: string, patch: Partial<IndustryExpertiseItem>) => {
    const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i))
    dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, industry_expertise: next } }))
  }

  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)))

  const sliderStyle = (item: IndustryExpertiseItem): React.CSSProperties => {
    const color = item.color || "#14b8a6"
    const percent = clamp(item.percent)

    // Left filled area pattern/color by style
    let fillLayer = ''
    switch (item.style) {
      case "striped":
        fillLayer = `repeating-linear-gradient(45deg, ${color}, ${color} 8px, rgba(255,255,255,0.35) 8px, rgba(255,255,255,0.35) 16px)`
        break
      case "dashed":
        fillLayer = `repeating-linear-gradient(90deg, ${color} 0 6px, transparent 6px 12px)`
        break
      case "diagonal":
        fillLayer = `repeating-linear-gradient(135deg, ${color}, ${color} 6px, rgba(255,255,255,0.35) 6px, rgba(255,255,255,0.35) 12px)`
        break
      case "gradient":
        fillLayer = `linear-gradient(90deg, ${color}, ${item.gradientTo || '#0ea5e9'})`
        break
      case "solid":
      default:
        fillLayer = `linear-gradient(90deg, ${color}, ${color})`
    }

    return {
      backgroundImage: `${fillLayer}, linear-gradient(to right, #e5e7eb, #e5e7eb)`,
      backgroundSize: `${percent}% 100%, 100% 100%`,
      backgroundRepeat: 'no-repeat, no-repeat',
      backgroundPosition: 'left, left',
      height: '8px',
      borderRadius: '9999px',
      WebkitAppearance: 'none' as any,
      appearance: 'none' as any,
    }
  }

  return (
    <div className="Industry-Expertise-Section space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "resume-item-holder p-2 -mx-2 group/entry",
            activeSection?.entryId === item.id
              ? darkMode && section.column === "right"
                ? "selected-resume-item--dark p-[7px]"
                : "selected-resume-item p-[7px]"
              : ""
          )}
          onContextMenu={(e) => handleContextMenu(e, item.id)}
          onClick={(e) => handleEntryToggle(e, item.id)}
        >
          <div className="flex items-center gap-3">
            <EditableText
              value={item.name}
              onChange={(value) => updateItem(item.id, { name: value })}
              className={cn("editable-field !border-0 !shadow-none !p-0 !m-0 text-sm flex-1", darkMode && section.column === 'right' && "!text-white")}
              placeholder="Field or Industry"
            />

            <div className="flex items-center gap-2 w-1/2 min-w-[220px]">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={item.percent}
                onChange={(e) => updateItem(item.id, { percent: clamp(Number(e.target.value)) })}
                className="w-full cursor-pointer"
                style={sliderStyle(item)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
