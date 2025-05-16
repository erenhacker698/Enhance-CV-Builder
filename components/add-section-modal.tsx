"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addSection } from "@/lib/features/resume/resumeSlice"
import { setAddSectionModal } from "@/lib/features/settings/settingsSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Section } from "@/lib/types"
import type { RootState } from "@/lib/store"

type AddSectionModalProps = {}

const sectionTypes = [
    {
        id: "skills",
        title: "Skills",
        type: "skills",
        preview: (
            <div>
                <div className="uppercase font-bold border-b border-gray-800 mb-2">SKILLS</div>
                <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded">HTML</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded">CSS</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded">JavaScript</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded">React</span>
                </div>
            </div>
        ),
    },
    {
        id: "custom",
        title: "Custom",
        type: "custom",
        preview: (
            <div>
                <div className="uppercase font-bold border-b border-gray-800 mb-2">CUSTOM TITLE</div>
                <div className="flex items-start mb-3">
                    <div className="bg-teal-100 rounded-full p-1 mr-2 text-teal-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path
                                d="M12 8H12.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <div className="font-medium">Custom Item</div>
                            <div className="text-xs text-gray-500">10/2014 - 06/2015</div>
                        </div>
                        <div className="text-xs text-gray-600">Description text goes here</div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "languages",
        title: "Languages",
        type: "languages",
        preview: (
            <div>
                <div className="uppercase font-bold border-b border-gray-800 mb-2">LANGUAGES</div>
                <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">English</div>
                    <div className="flex">
                        <div className="w-4 h-4 rounded-full bg-teal-500 mx-0.5"></div>
                        <div className="w-4 h-4 rounded-full bg-teal-500 mx-0.5"></div>
                        <div className="w-4 h-4 rounded-full bg-teal-500 mx-0.5"></div>
                        <div className="w-4 h-4 rounded-full bg-teal-500 mx-0.5"></div>
                        <div className="w-4 h-4 rounded-full bg-gray-200 mx-0.5"></div>
                    </div>
                </div>
                <div className="text-xs text-gray-500 mb-3">Proficient</div>
            </div>
        ),
    },
    {
        id: "training",
        title: "Training / Courses",
        type: "entries",
        preview: (
            <div>
                <div className="uppercase font-bold border-b border-gray-800 mb-2">TRAINING / COURSES</div>
                <div className="mb-3">
                    <div className="text-teal-500 font-medium">Creative Writing</div>
                    <div className="text-xs text-gray-600">An intensive 4 week course for developing creative writing skills</div>
                </div>
            </div>
        ),
    },
    {
        id: "projects",
        title: "Projects",
        type: "entries",
        preview: (
            <div>
                <div className="uppercase font-bold border-b border-gray-800 mb-2">PROJECTS</div>
                <div>
                    <div className="font-medium">Project Name</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                        <span className="mr-4">11/2015 - 04/2016</span>
                    </div>
                    <ul className="list-disc pl-5 text-xs text-gray-600">
                        <li>Project description point 1</li>
                        <li>Project description point 2</li>
                    </ul>
                </div>
            </div>
        ),
    },
    {
        id: "achievements",
        title: "Key Achievements",
        type: "achievements",
        preview: (
            <div>
                <div className="uppercase font-bold border-b border-gray-800 mb-2">KEY ACHIEVEMENTS</div>
                <div className="flex items-start mb-3">
                    <div className="bg-teal-100 rounded-full p-1 mr-2 text-teal-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path
                                d="M12 8H12.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="font-medium">Achievement Title</div>
                        <div className="text-xs text-gray-600">Achievement description text</div>
                    </div>
                </div>
            </div>
        ),
    },
]

export default function AddSectionModal({ }: AddSectionModalProps) {
    const dispatch = useDispatch()
    const { showAddSectionModal, addSectionColumn } = useSelector((state: RootState) => state.settings)
    const [selectedType, setSelectedType] = useState("")

    const handleAddSection = (sectionType: string) => {
        const section = sectionTypes.find((s) => s.id === sectionType)

        if (section) {
            // Create different section structures based on type
            switch (section.id) {
                case "skills":
                    const skillsSection: Section = {
                        id: `section-${Date.now()}`,
                        type: "skills",
                        column: addSectionColumn,
                        content: {
                            title: section.title.toUpperCase(),
                            skillGroups: [
                                {
                                    id: `group-${Date.now()}`,
                                    name: "Technical Skills",
                                    skills: ["HTML", "CSS", "JavaScript", "React"],
                                },
                            ],
                        },
                    }
                    dispatch(addSection({ section: skillsSection, column: addSectionColumn }))
                    break

                case "languages":
                    const languagesSection: Section = {
                        id: `section-${Date.now()}`,
                        type: "languages",
                        column: addSectionColumn,
                        content: {
                            title: section.title.toUpperCase(),
                            languages: [
                                {
                                    id: `lang-${Date.now()}`,
                                    name: "English",
                                    level: "Proficient",
                                    proficiency: 4,
                                    visibility: {
                                        proficiency: true,
                                        slider: true,
                                    },
                                    sliderStyle: 0,
                                },
                            ],
                        },
                    }
                    dispatch(addSection({ section: languagesSection, column: addSectionColumn }))
                    break

                case "training":
                case "projects":
                    const entriesSection: Section = {
                        id: `section-${Date.now()}`,
                        type: "entries",
                        column: addSectionColumn,
                        content: {
                            title: section.title.toUpperCase(),
                            entries: [
                                {
                                    id: `entry-${Date.now()}`,
                                    title: section.id === "training" ? "Course Name" : "Project Name",
                                    subtitle: section.id === "training" ? "Institution" : "",
                                    dateRange: "Date period",
                                    location: "",
                                    description: section.id === "training" ? "Course description" : "Project description",
                                    bullets: section.id === "projects" ? ["Project detail 1", "Project detail 2"] : [],
                                    visibility: {
                                        title: true,
                                        subtitle: section.id === "training",
                                        dateRange: true,
                                        location: false,
                                        description: true,
                                        bullets: section.id === "projects",
                                        link: false,
                                        logo: false,
                                    },
                                },
                            ],
                        },
                    }
                    dispatch(addSection({ section: entriesSection, column: addSectionColumn }))
                    break

                case "achievements":
                    const achievementsSection: Section = {
                        id: `section-${Date.now()}`,
                        type: "achievements",
                        column: addSectionColumn,
                        content: {
                            title: section.title.toUpperCase(),
                            achievements: [
                                {
                                    id: `achievement-${Date.now()}`,
                                    title: "Achievement Title",
                                    description: "Achievement description",
                                    icon: "info",
                                },
                            ],
                        },
                    }
                    dispatch(addSection({ section: achievementsSection, column: addSectionColumn }))
                    break

                case "custom":
                    const customSection: Section = {
                        id: `section-${Date.now()}`,
                        type: "custom",
                        column: addSectionColumn,
                        content: {
                            title: section.title.toUpperCase(),
                            items: [
                                {
                                    id: `custom-${Date.now()}`,
                                    title: "Custom Item",
                                    dateRange: "Date period",
                                    description: "Description text",
                                    icon: "info",
                                    featured: false,
                                },
                            ],
                        },
                    }
                    dispatch(addSection({ section: customSection, column: addSectionColumn }))
                    break
            }

            dispatch(setAddSectionModal({ isOpen: false }))
            setSelectedType("")
        }
    }

    return (
        <Dialog open={showAddSectionModal} onOpenChange={(open) => dispatch(setAddSectionModal({ isOpen: open }))}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-2xl font-bold">Add a new section</DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => dispatch(setAddSectionModal({ isOpen: false }))}
                        >
                            <X size={18} />
                        </Button>
                    </div>
                    <p className="text-gray-600">Click on a section to add it to your resume</p>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-6 p-6">
                    {sectionTypes.map((section) => (
                        <div
                            key={section.id}
                            className={cn(
                                "border rounded-md overflow-hidden cursor-pointer hover:border-teal-500 transition-colors h-[280px] relative",
                                selectedType === section.id ? "border-teal-500 ring-1 ring-teal-500" : "border-gray-200",
                            )}
                            onClick={() => {
                                setSelectedType(section.id)
                                handleAddSection(section.id)
                            }}
                        >
                            <div className="p-4 h-full">{section.preview}</div>
                            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 text-center">
                                {section.title}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
