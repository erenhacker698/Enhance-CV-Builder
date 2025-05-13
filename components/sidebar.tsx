'use client'

import { Button } from "@/components/ui/button"
import {
  FilePlus,
  MoveVertical,
  Layout,
} from "lucide-react"
import AddSectionModal from "./add-section-modal"
import { useState } from "react"

export default function Sidebar() {
  const [showAddSectionModal, setShowAddSectionModal] = useState(false)

  return (
    <div className="w-[180px] bg-white rounded-lg shadow-sm p-4 space-y-4 h-fit">

      <div className="space-y-1">
        <Button variant="ghost" className="w-full justify-start text-sm font-normal cursor-pointer" onClick={() => setShowAddSectionModal(true)}>
          <FilePlus size={16} className="mr-2" />
          Add section
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm font-normal">
          <MoveVertical size={16} className="mr-2" />
          Rearrange
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm font-normal">
          <Layout size={16} className="mr-2" />
          Templates
        </Button>
      </div>

      <div className="border-t pt-2 flex items-center justify-between">
        <span className="text-sm">Branding</span>
        <div
          className="relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none"
        >
          <span className="translate-x-4 pointer-events-none inline-block h-3 w-3 transform rounded-full bg-teal-500 shadow ring-0 transition duration-200 ease-in-out"></span>
        </div>
      </div>

      <AddSectionModal isOpen={showAddSectionModal} onClose={() => setShowAddSectionModal(false)} />
    </div>
  )
}
