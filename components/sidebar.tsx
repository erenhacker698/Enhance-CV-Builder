"use client"

import { useRef, useState } from "react"
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
import { setTemplatesModal, setAddSectionModal } from "@/lib/features/settings/settingsSlice"
import { undo, redo } from "@/lib/features/resume/resumeSlice"
import RearrangeSectionsModal from "@/components/rearrange-sections-modal"
import type { RootState } from "@/lib/store"
import PDFExportButton from "./pdf-export-button"

interface SidebarProps {
  resumeRef: React.RefObject<HTMLDivElement>
}

export default function Sidebar({ resumeRef }: SidebarProps) {
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
      <div className="w-full md:w-[180px] bg-white md:rounded-lg shadow-sm p-1 px-3 md:p-4 md:space-y-4 h-fit w-full mobile_stickey_menu">
        <div className="md:space-y-1 grid grid-cols-5 gap-1 md:flex md:flex-col">
          <div className="w-auto md:w-full grid grid-cols-2 gap-2 md:gap-0 pe-3 md:pe-0 md:flex md:items-center md:justify-between md:border-b md:pb-2 border-r md:border-r-0">
            <Button variant="ghost" size="icon" className="w-full h-full md:h-8 md:w-8" onClick={handleUndo} disabled={!canUndo}>
              <RotateCcw size={16} className={!canUndo ? "text-gray-800" : ""} />
            </Button>
            <Button variant="ghost" size="icon" className="w-full h-full md:h-8 md:w-8" onClick={handleRedo} disabled={!canRedo}>
              <RotateCw size={16} className={!canRedo ? "text-gray-800" : ""} />
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-auto md:w-full flex items-center justify-center md:justify-start text-sm font-normal cursor-pointer"
            onClick={() => dispatch(setAddSectionModal({ isOpen: true, column: "left" }))}
          >
            <FilePlus size={16} className="md:mr-2" />
            <div className="hidden md:flex">
              Add section
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-auto md:w-full flex items-center justify-center md:justify-start text-sm font-normal cursor-pointer"
            onClick={() => setShowRearrangeModal(true)}
          >
            <MoveVertical size={16} className="md:mr-2" />
            <div className="hidden md:flex">
              Rearrange
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-auto md:w-full flex items-center justify-center md:justify-start text-sm font-normal cursor-pointer"
            onClick={() => dispatch(setTemplatesModal(true))}
          >
            <Layout size={16} className="md:mr-2" />
            <div className="hidden md:flex">
              Templates</div>
          </Button>
          <PDFExportButton resumeRef={resumeRef} />
        </div>
      </div>

      <RearrangeSectionsModal isOpen={showRearrangeModal} onClose={() => setShowRearrangeModal(false)} />
    </>
  )
}
