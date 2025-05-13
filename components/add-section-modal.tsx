"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { addSection } from "@/lib/features/resume/resumeSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AddSectionModalProps {
    isOpen: boolean
    onClose: () => void
}

const sectionTypes = [
    {
        id: "experience",
        title: "Experience",
        description: "Work experience, internships, etc.",
        type: "entries",
    },
    {
        id: "skills",
        title: "Skills",
        description: "Technical, soft skills, etc.",
        type: "text",
    },
    {
        id: "education",
        title: "Education",
        description: "Degrees, courses, certifications",
        type: "entries",
    },
    
]

export default function AddSectionModal({ isOpen, onClose }: AddSectionModalProps) {
    const dispatch = useDispatch()
    const [selectedType, setSelectedType] = useState("")

    const handleAddSection = (sectionType: string) => {
        const section = sectionTypes.find((s) => s.id === sectionType)

        if (section) {
            dispatch(
                addSection({
                    id: `section-${Date.now()}`,
                    type: section.type as "text" | "entries",
                    content: {
                        title: section.title.toUpperCase(),
                        text: section.type === "text" ? "" : undefined,
                        entries: section.type === "entries" ? [] : undefined,
                    },
                }),
            )

            onClose()
            setSelectedType("")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add a new section</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-4 py-4">
                    {sectionTypes.map((section) => (
                        <div
                            key={section.id}
                            className={`border rounded-md p-4 cursor-pointer hover:border-teal-500 transition-colors ${selectedType === section.id ? "border-teal-500 bg-teal-50" : ""
                                }`}
                            onClick={() => setSelectedType(section.id)}
                        >
                            <h3 className="font-medium">{section.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{section.description}</p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" onClick={onClose} className="mr-2">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleAddSection(selectedType)}
                        disabled={!selectedType}
                        className="bg-teal-500 hover:bg-teal-600"
                    >
                        Add to resume
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
