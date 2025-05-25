"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addSection } from "@/lib/features/resume/resumeSlice"
import { setAddSectionModal } from "@/lib/features/settings/settingsSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { SectionTypeEnum, type Section } from "@/lib/types"
import type { RootState } from "@/lib/store"

type AddSectionModalProps = {}

const sectionTypes = [
    {
        title: "Skills",
        type: SectionTypeEnum.SKILLS,
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
        title: "Education",
        type: SectionTypeEnum.EDUCATION,
        preview: (
            <div>
                <div className="uppercase font-bold border-b border-gray-800 mb-2">Education</div>
                <div className="flex flex-col items-start mb-3">
                    <div className="flex flex-col justify-start ">
                        <div className="font-medium">Degree and Field of Study</div>
                        <div className="font-medium text-teal-500">School or University</div>
                        <div className="text-xs text-gray-500">10/2014 - 06/2015</div>
                    </div>
                    <div className="text-xs text-gray-600">Description text goes here</div>
                </div>
            </div>
        ),
    },
    {
        title: "Languages",
        type: SectionTypeEnum.LANGUAGES,
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
        title: "Projects",
        type: SectionTypeEnum.PROJECTS,
        preview: (
            <div>
                <div className="uppercase font-bold border-b border-gray-800 mb-2">PROJECTS</div>
                <div>
                    <div className="font-medium">Project Name</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                        <span className="mr-4">11/2015 - 04/2016</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                        <span className="mr-4">project.vercel.app</span>
                    </div>
                    <ul className="list-disc pl-5 text-xs text-gray-600">
                        <li>Project description point 1</li>
                        <li>Project description point 2</li>
                    </ul>
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
        const section = sectionTypes.find((s) => s.type === sectionType)

        if (section) {
            switch (section.type) {
                case SectionTypeEnum.EDUCATION:
                    const education: Section = {
                        id: `section-${Date.now()}`,
                        type: SectionTypeEnum.EDUCATION,
                        column: addSectionColumn,
                        title: section.title.toUpperCase(),
                        content: {
                            educations: [
                                {
                                    id: `entry-${Date.now()}`,
                                    school: "School or University Name",
                                    degree: "BCA",
                                    period: "Date period",
                                    location: "",
                                    bullets: [],
                                    gpa: "",
                                    logo:""
                                },
                            ],
                        },
                    }
                    dispatch(addSection({ section: education, column: addSectionColumn }))
                    break

                case SectionTypeEnum.SKILLS:
                    const skillsSection: Section = {
                        id: `section-${Date.now()}`,
                        type: SectionTypeEnum.SKILLS,
                        column: addSectionColumn,
                        title: section.title.toUpperCase(),
                        content: {
                            skills: [
                                {
                                    id: `group-${Date.now()}`,
                                    groupName: "Technical Skills",
                                    skills: ["HTML", "CSS", "JavaScript", "React"],
                                    borderStyle: "all",
                                    compactMode: false
                                },
                            ],
                        },
                    }
                    dispatch(addSection({ section: skillsSection, column: addSectionColumn }))
                    break

                case SectionTypeEnum.LANGUAGES:
                    const languagesSection: Section = {
                        id: `section-${Date.now()}`,
                        type: SectionTypeEnum.LANGUAGES,
                        column: addSectionColumn,
                        title: section.title.toUpperCase(),
                        content: {
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
                                },
                            ],
                        },
                    }
                    dispatch(addSection({ section: languagesSection, column: addSectionColumn }))
                    break

                case SectionTypeEnum.PROJECTS:
                    const entriesSection: Section = {
                        id: `section-${Date.now()}`,
                        type: SectionTypeEnum.PROJECTS,
                        column: addSectionColumn,
                        title: section.title.toUpperCase(),
                        content: {
                            projects: [
                                {
                                    id: `entry-${Date.now()}`,
                                    projectName: "Project Name",
                                    link: "",
                                    period: "Date period",
                                    location: "",
                                    description: "Project description",
                                    bullets: ["Project detail 1", "Project detail 2"],
                                },
                            ],
                        },
                    }
                    dispatch(addSection({ section: entriesSection, column: addSectionColumn }))
                    break
            }

            dispatch(setAddSectionModal({ isOpen: false }))
            setSelectedType("")
        }
    }

    return (
        <Dialog open={showAddSectionModal} onOpenChange={(open) => dispatch(setAddSectionModal({ isOpen: open }))}>
            <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-auto">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-2xl font-bold">Add a new section</DialogTitle>
                    </div>
                    <p className="text-gray-600">Click on a section to add it to your resume</p>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    {sectionTypes.map((section) => (
                        <div
                            key={section.title}
                            className={cn(
                                "border rounded-md overflow-hidden cursor-pointer hover:border-teal-500 transition-colors h-[280px] relative",
                                selectedType === section.title ? "border-teal-500 ring-1 ring-teal-500" : "border-gray-200",
                            )}
                            onClick={() => {
                                setSelectedType(section.type)
                                handleAddSection(section.type)
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
