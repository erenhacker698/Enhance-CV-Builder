"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Check } from "lucide-react"
import { setTemplate, setTemplatesModal } from "@/lib/features/settings/settingsSlice"
import type { RootState } from "@/lib/store"

type TemplatesModalProps = {}

const templates = [
    {
        id: "double-column",
        name: "Double Column",
        description: "Classic two-column layout",
        image: "/templates/Double Column.png",
    },
    {
        id: "elegant",
        name: "Elegant",
        description: "Professional design with sidebar",
        image: "/templates/Elegent.png",
    },
    {
        id: "left-sidebar",
        name: "Left Sidebar",
        description: "Sidebar on the left with main content on right",
        image: "/templates/modern.png",
    },
     {
         id: "timeline",
     name: "Timeline",
     description: "Chronological timeline format",
     image: "/templates/Timeline.png",
     },
]

export default function TemplatesModal({ }: TemplatesModalProps) {
    const dispatch = useDispatch()
    const { template, showTemplatesModal } = useSelector((state: RootState) => state.settings)
    const [selectedTemplate, setSelectedTemplate] = useState(template)

    const handleSelectTemplate = (templateId: string) => {
        setSelectedTemplate(templateId)
    }

    const handleApplyTemplate = () => {
        dispatch(setTemplate({ template: selectedTemplate }))
        onClose()
    }

    const onClose = () => {
        dispatch(setTemplatesModal(false))
    }

    return (
        <Dialog open={showTemplatesModal} onOpenChange={(open) => dispatch(setTemplatesModal(open))}>
            <DialogContent className="w-[98%] max-w-md sm:max-w-2xl lg:max-w-3/4 max-h-[90vh] p-0 overflow-auto scrollbar-none drop-shadow-2xl border-none shadow-none">
                <DialogHeader className="p-4 sm:p-6 lg:p-7 xl:p-10 !pb-1">
                    <DialogTitle className="font-normal text-center text-lg md:text-xl lg:text-2xl xl:text-3xl">Choose a template</DialogTitle>
                    <p className="text-gray-600 text-center text-sm md:text-base">Select a template to change the look of your resume</p>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-6 lg:p-7 xl:p-10 !pt-1">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className={`border rounded-md overflow-hidden cursor-pointer transition-colors ${selectedTemplate === template.id
                                ? "border-teal-500 ring-1 ring-teal-500"
                                : "border-gray-200 hover:border-teal-500"
                                }`}
                            onClick={() => handleSelectTemplate(template.id)}
                        >
                            <div className="relative">
                                <img src={template.image || "/placeholder.svg"} alt={template.name} className="w-full h-auto" />
                                {selectedTemplate === template.id && (
                                    <div className="absolute top-2 right-2 bg-teal-500 text-white rounded-full p-1">
                                        <Check size={16} />
                                    </div>
                                )}
                            </div>
                            <div className="p-3 border-t border-gray-200">
                                <h3 className="font-medium">{template.name}</h3>
                                <p className="text-sm text-gray-500">{template.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end p-4 border-t border-gray-200">
                    <Button variant="outline" onClick={() => dispatch(setTemplatesModal(false))} className="mr-2 text-base py-2.5 px-3.5 cursor-pointer rounded-sm font-rubik font-medium transition-all duration-300 ease-in-out">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            dispatch(setTemplate({ template: selectedTemplate }))
                            dispatch(setTemplatesModal(false))
                        }}
                        className="text-base py-2.5 px-3.5 text-white bg-[#2dc08d] hover:bg-[#57cda4] border-none cursor-pointer rounded-sm font-rubik font-medium transition-all duration-300 ease-in-out"
                    >
                        Apply Template
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
