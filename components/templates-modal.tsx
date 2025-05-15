"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Check } from "lucide-react"
import { setTemplate } from "@/lib/features/settings/settingsSlice"
import type { RootState } from "@/lib/store"

interface TemplatesModalProps {
    isOpen: boolean
    onClose: () => void
}

const templates = [
    {
        id: "standard",
        name: "Standard",
        description: "Classic two-column layout",
        image: "/placeholder.svg?height=200&width=150",
    },
    {
        id: "modern",
        name: "Modern",
        description: "Clean single-column design",
        image: "/placeholder.svg?height=200&width=150",
    },
    {
        id: "timeline",
        name: "Timeline",
        description: "Vertical timeline format",
        image: "/placeholder.svg?height=200&width=150",
    },
]

export default function TemplatesModal({ isOpen, onClose }: TemplatesModalProps) {
    const dispatch = useDispatch()
    const currentTemplate = useSelector((state: RootState) => state.settings.template)
    const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate)

    const handleSelectTemplate = (templateId: string) => {
        setSelectedTemplate(templateId)
    }

    const handleApplyTemplate = () => {
        dispatch(setTemplate({ template: selectedTemplate }))
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-2xl font-bold">Choose a template</DialogTitle>
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <X size={18} />
                            </Button>
                        </DialogClose>
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
                    <Button variant="outline" onClick={onClose} className="mr-2">
                        Cancel
                    </Button>
                    <Button onClick={handleApplyTemplate} className="bg-teal-500 hover:bg-teal-600">
                        Apply Template
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
