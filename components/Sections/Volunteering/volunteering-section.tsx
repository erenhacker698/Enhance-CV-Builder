"use client"
import { cn } from "@/lib/utils"
import EditableText from "@/components/Shared/editable-text"
import { useDispatch, useSelector } from "react-redux"
import { updateSectionContent, upsertActiveSection } from "@/lib/features/resume/resumeSlice"
import type { SectionProps, VolunteeringItem } from "@/lib/types"
import { RootState } from "@/lib/store"

export default function VolunteeringSection({ section, isActive, darkMode = false, handleEntryToggle, handleContextMenu }: SectionProps) {
  const dispatch = useDispatch()
  const activeSection = useSelector((s: RootState) => s.resume.activeSection)
  const { primaryColor } = useSelector((s: RootState) => s.settings)
  const items = section.content.volunteering ?? []

  const updateItem = (id: string, patch: Partial<VolunteeringItem>) => {
    const next = (items || []).map(i => i.id === id ? { ...i, ...patch } : i)
    dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, volunteering: next } }))
  }

  return (
    <div className="Volunteering-Section space-y-4">
      {items.map((v) => (
        <div
          key={v.id}
          className={cn(
            "resume-item-holder p-2 -mx-2 group/entry",
            isActive && activeSection?.entryId === v.id ? "selected-resume-item p-[7px]" : "",
            darkMode && section.column === "right" && isActive && "!bg-[#ffffff1f]"
          )}
          onContextMenu={(e) => handleContextMenu(e, v.id)}
          onClick={(e) => handleEntryToggle(e, v.id)}
        >
          <div className="flex flex-col">
            <div className="flex items-start justify-between">
              <EditableText
                value={v.role}
                onChange={(value) => updateItem(v.id, { role: value })}
                className={cn("editable-field", darkMode && section.column === "right" && "!text-white")}
                placeholder="Role"
              />
              {v.visibility?.period !== false && (
                <EditableText
                  value={v.period}
                  onChange={(value) => updateItem(v.id, { period: value })}
                  className={cn("editable-field para-text-field text-right", darkMode && section.column === "right" && "!text-white")}
                  placeholder="Date period"
                />
              )}
            </div>

            <EditableText
              value={v.organization}
              onChange={(value) => updateItem(v.id, { organization: value })}
              className={cn("editable-field", darkMode && section.column === "right" && "!text-white")}
              style={{ color: darkMode && section.column === 'right' ? undefined : primaryColor }}
              placeholder="Organization"
            />

            {v.visibility?.description !== false && (
              <EditableText
                value={v.description}
                onChange={(value) => updateItem(v.id, { description: value })}
                className={cn("editable-field para-text-field !w-full text-left", darkMode && section.column === "right" && "!text-white")}
                multiline
                placeholder="Short description"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}