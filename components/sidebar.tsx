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
import { setTemplatesModal, setAddSectionModal, setCurrentCvId, setShowHistoryModal } from "@/lib/features/settings/settingsSlice"
import { undo, redo } from "@/lib/features/resume/resumeSlice"
import RearrangeSectionsModal from "@/components/Common/Dialogs/rearrange-sections-modal"
import type { RootState } from "@/lib/store"
import PDFExportButton from "./Common/ExportResume/pdf-export-button"
import DesignFontPanel from "@/components/Common/Design/design-font-panel"
import { setDesignPanel } from "@/lib/features/settings/settingsSlice"
import { createCv, saveCv } from "@/lib/client/api"
import { store } from "@/lib/store"

interface SidebarProps {
  resumeRef: React.RefObject<HTMLDivElement | null>
}

export default function Sidebar({ resumeRef }: SidebarProps) {
  const dispatch = useDispatch()
  const [showRearrangeModal, setShowRearrangeModal] = useState(false)
  const { history } = useSelector((state: RootState) => state.resume)
  const { showDesignPanel } = useSelector((state: RootState) => state.settings)
  const { currentCvId } = useSelector((state: RootState) => state.settings)

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  const handleUndo = () => {
    dispatch(undo())
  }

  const handleRedo = () => {
    dispatch(redo())
  }

  const handleSave = async () => {
    const state = store.getState()
    try {
      const name = window.prompt('Name this snapshot (optional):', '') || undefined
      if (!currentCvId) {
        const { id } = await createCv(state, name)
        dispatch(setCurrentCvId(id))
        // update URL param
        const url = new URL(window.location.href)
        url.searchParams.set("cv", id)
        window.history.replaceState({}, "", url.toString())
      } else {
        await saveCv(currentCvId, state, name)
      }
    } catch (e) {
      console.error("Save failed", e)
      alert("Failed to save CV")
    }
  }

  // Zoom controls removed per user request; default zoom is applied globally

  return (
    <>
      <div className="w-full md:w-[280px] bg-white m-2 md:rounded-[6px] md:border-t-8 md:border-b-8 md:border-[#f5f7fc] shadow-sm md:shadow-hover p-1 px-3 md:p-4 md:space-y-4 h-fit mobile_stickey_menu">
        <div className="md:space-y-1 grid grid-cols-5 gap-1 md:flex md:flex-col">
          <div className="w-auto md:w-full grid grid-cols-2 gap-2 md:gap-0 pe-3 md:pe-0 md:flex md:items-center md:justify-between md:border-b md:pb-2 border-r md:border-r-0">
            <Button variant="ghost" size="icon" className="w-full h-full md:h-8 md:w-8 text-[#384347] hover:text-[#5f4dc7]" onClick={handleUndo} disabled={!canUndo}>
              <RotateCcw size={16} className={!canUndo ? "text-gray-800" : ""} />
            </Button>
            <Button variant="ghost" size="icon" className="w-full h-full md:h-8 md:w-8 text-[#384347] hover:text-[#5f4dc7]" onClick={handleRedo} disabled={!canRedo}>
              <RotateCw size={16} className={!canRedo ? "text-gray-800" : ""} />
            </Button>
          </div>

          {/* Zoom controls removed */}

          <Button
            variant="ghost"
            className="w-auto md:w-full flex items-center justify-center md:justify-start text-sm font-normal cursor-pointer text-[#384347] hover:text-[#5f4dc7]"
            onClick={() => dispatch(setAddSectionModal({ isOpen: true, column: "left" }))}
          >
            <FilePlus size={16} className="md:mr-2" />
            <div className="hidden md:flex">
              Add section
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-auto md:w-full flex items-center justify-center md:justify-start text-sm font-normal cursor-pointer text-[#384347] hover:text-[#5f4dc7]"
            onClick={() => setShowRearrangeModal(true)}
          >
            <MoveVertical size={16} className="md:mr-2" />
            <div className="hidden md:flex">
              Rearrange
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-auto md:w-full flex items-center justify-center md:justify-start text-sm font-normal cursor-pointer text-[#384347] hover:text-[#5f4dc7]"
            onClick={() => dispatch(setTemplatesModal(true))}
          >
            <Layout size={16} className="md:mr-2" />
            <div className="hidden md:flex">
              Templates</div>
          </Button>

          <Button
            variant="ghost"
            className="w-auto md:w-full flex items-center justify-center md:justify-start text-sm font-normal cursor-pointer text-[#384347] hover:text-[#5f4dc7]"
            onClick={() => dispatch(setDesignPanel(true))}
          >
            <Palette size={16} className="md:mr-2" />
            <div className="hidden md:flex">
              Design & Font</div>
          </Button>
 
          <Button
            variant="ghost"
            className="w-auto md:w-full flex items-center justify-center md:justify-start text-sm font-normal cursor-pointer text-[#384347] hover:text-[#5f4dc7]"
            onClick={handleSave}
          >
            <Check size={16} className="md:mr-2" />
            <div className="hidden md:flex">Save</div>
          </Button>
          <Button
            variant="ghost"
            className="w-auto md:w-full flex items-center justify-center md:justify-start text-sm font-normal cursor-pointer text-[#384347] hover:text-[#5f4dc7]"
            onClick={() => dispatch(setShowHistoryModal(true))}
          >
            <Clock size={16} className="md:mr-2" />
            <div className="hidden md:flex">History</div>
          </Button>
          <PDFExportButton resumeRef={resumeRef} />
        </div>
      </div>

      {showDesignPanel && (
        <div className="fixed right-4 top-24 z-50">
          <DesignFontPanel />
        </div>
      )}

      <RearrangeSectionsModal isOpen={showRearrangeModal} onClose={() => setShowRearrangeModal(false)} />
    </>
  )
}
