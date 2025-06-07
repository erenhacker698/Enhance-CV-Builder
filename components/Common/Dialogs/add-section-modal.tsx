"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addSection } from "@/lib/features/resume/resumeSlice"
import { setAddSectionModal } from "@/lib/features/settings/settingsSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { SectionTypeEnum, type Section } from "@/lib/types"
import type { RootState } from "@/lib/store"
import { getDefaultSection } from "@/lib/utils/sectionDefaults"
import { Award } from "lucide-react"

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
    {
        title: "Achievements",
        type: SectionTypeEnum.ACHIEVEMENTS,
        preview: (
            <div className="">
                <div className="uppercase font-bold border-b border-gray-800 mb-2">ACHIEVEMENTS</div>
                <div className="flex items-start">
                    <div className="bg-teal-100 rounded-full p-2 mr-3 text-teal-500 flex-shrink-0">
                        <Award size={16} />
                    </div>

                    <div className="flex-1">
                        <p className="font-medium">Won First Prize at Hackathon</p>
                        <p className="text-xs text-gray-600 pt-1">Secured first place among 200+ teams in a national-level coding event.</p>
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
        const sectionMeta = sectionTypes.find((s) => s.type === sectionType)
        if (!sectionMeta) return

        const section = getDefaultSection(sectionMeta.type, addSectionColumn, sectionMeta.title.toUpperCase())
        if (section) {
            dispatch(addSection({ section, column: addSectionColumn }))
            dispatch(setAddSectionModal({ isOpen: false }))
            setSelectedType("")
        }
    }

    return (
        <Dialog open={showAddSectionModal} onOpenChange={(open) => dispatch(setAddSectionModal({ isOpen: open }))}>
            <DialogContent className="w-[98%] max-w-md sm:max-w-2xl lg:max-w-3/4 max-h-[90vh] p-0 overflow-auto scrollbar-none drop-shadow-2xl border-none shadow-none">
                <DialogHeader className="p-4 sm:p-6 lg:p-7 xl:p-10 !pb-1">
                    <DialogTitle className="font-normal text-center text-lg md:text-xl lg:text-2xl xl:text-3xl">Add a new section</DialogTitle>
                    <p className="text-gray-600 text-center text-sm md:text-base">Click on a section to add it to your resume</p>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-6 lg:p-7 xl:p-10 !pt-1">
                    {sectionTypes.map((section) => (
                        <div
                            key={section.title}
                            className={cn(
                                "border rounded-md overflow-hidden cursor-pointer hover:border-teal-500 transition-colors h-[180px] relative",
                                selectedType === section.title ? "border-teal-500 ring-1 ring-teal-500" : "border-gray-200",
                            )}
                            onClick={() => {
                                setSelectedType(section.type)
                                handleAddSection(section.type)
                            }}
                        >
                            <div className="p-4 h-full">{section.preview}</div>
                            <div className="mt-auto bg-white border-t border-gray-200 p-2 text-center">
                                {section.title}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
