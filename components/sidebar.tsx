"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import {
  RotateCcw,
  RotateCw,
  FilePlus,
  MoveVertical,
  Layout,
  Palette,
  Edit,
  Check,
  Bot,
  Download,
  Share,
  Clock,
} from "lucide-react"
import { toggleBranding, setTemplatesModal, setAddSectionModal } from "@/lib/features/settings/settingsSlice"
import { undo, redo } from "@/lib/features/resume/resumeSlice"
import RearrangeSectionsModal from "@/components/rearrange-sections-modal"
import type { RootState } from "@/lib/store"

type SidebarProps = {}

export default function Sidebar({ }: SidebarProps) {
  const dispatch = useDispatch()
  const [showRearrangeModal, setShowRearrangeModal] = useState(false)
  const { history } = useSelector((state: RootState) => state.resume)

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  const handleUndo = () => {
    dispatch(undo())
  }

  const handleRedo = () => {
    dispatch(redo())
  }

  return (
    <>
      <div className="w-[180px] bg-white rounded-lg shadow-sm p-4 space-y-4 h-fit">
        <div className="flex justify-between border-b pb-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleUndo} disabled={!canUndo}>
            <RotateCcw size={16} className={!canUndo ? "text-gray-300" : ""} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRedo} disabled={!canRedo}>
            <RotateCw size={16} className={!canRedo ? "text-gray-300" : ""} />
          </Button>
        </div>

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal"
            onClick={() => dispatch(setAddSectionModal({ isOpen: true, column: "left" }))}
          >
            <FilePlus size={16} className="mr-2" />
            Add section
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal"
            onClick={() => setShowRearrangeModal(true)}
          >
            <MoveVertical size={16} className="mr-2" />
            Rearrange
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal"
            onClick={() => dispatch(setTemplatesModal(true))}
          >
            <Layout size={16} className="mr-2" />
            Templates
          </Button>
        </div>

        <div className="border-t pt-2 space-y-1">
          <Button variant="ghost" className="w-full justify-start text-sm font-normal">
            <Download size={16} className="mr-2" />
            Download
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm font-normal">
            <Share size={16} className="mr-2" />
            Share
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm font-normal">
            <Clock size={16} className="mr-2" />
            History
          </Button>
        </div>

        <div className="border-t pt-2 flex items-center justify-between">
          <span className="text-sm">Branding</span>
          <div
            className="relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none"
            onClick={() => dispatch(toggleBranding())}
          >
            <span className="translate-x-4 pointer-events-none inline-block h-3 w-3 transform rounded-full bg-teal-500 shadow ring-0 transition duration-200 ease-in-out"></span>
          </div>
        </div>
      </div>

      <RearrangeSectionsModal isOpen={showRearrangeModal} onClose={() => setShowRearrangeModal(false)} />
    </>
  )
}
