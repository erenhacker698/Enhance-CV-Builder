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
            <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-auto">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-2xl font-bold">Choose a template</DialogTitle>
                    </div>
                    <p className="text-gray-600">Select a template to change the look of your resume</p>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-6 p-6">
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
                    <Button variant="outline" onClick={() => dispatch(setTemplatesModal(false))} className="mr-2">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            dispatch(setTemplate({ template: selectedTemplate }))
                            dispatch(setTemplatesModal(false))
                        }}
                        className="bg-teal-500 hover:bg-teal-600"
                    >
                        Apply Template
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
