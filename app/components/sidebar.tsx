"use client"

import { Button } from "@/components/ui/button"
import {
  RotateCcw,
  RotateCw,
  FilePlus,
  MoveVertical,
  Layout,
  Edit,
  Check,
  Download,
} from "lucide-react"

export default function Sidebar() {

  return (
    <div className="w-[180px] bg-white rounded-lg shadow-sm p-4 space-y-4 h-fit">
      <div className="flex justify-between border-b pb-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <RotateCcw size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <RotateCw size={16} />
        </Button>
      </div>

      <div className="space-y-1">
        <Button variant="ghost" className="w-full justify-start text-sm font-normal">
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

      <div className="border-t pt-2 space-y-1">
        <Button variant="ghost" className="w-full justify-start text-sm font-normal">
          <Edit size={16} className="mr-2" />
          Improve text
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm font-normal">
          <Check size={16} className="mr-2" />
          Check
        </Button>
      </div>

      <div className="border-t pt-2 space-y-1">
        <Button variant="ghost" className="w-full justify-start text-sm font-normal">
          <Download size={16} className="mr-2" />
          Download
        </Button>
      </div>
    </div>
  )
}
