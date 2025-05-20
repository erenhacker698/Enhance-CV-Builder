"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import {
    setActiveSection,
    updateSectionContent,
    updateSectionColumn,
    updateSectionTitle,
    addSection,
    addEducation,
    addProject,
    addLanguage,
    addSkill,
} from "@/lib/features/resume/resumeSlice"
import { type Section, SectionTypeEnum } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, Calendar, MapPin, Link } from "lucide-react"
import { cn } from "@/lib/utils"
import EditableText from "@/components/editable-text"
import FieldVisibilityMenu from "@/components/field-visibility-menu"
import SectionToolbar from "@/components/section-toolbar"
import SkillsSection from "@/components/skills-section"
import LanguageSection from "@/components/language-section"
import EducationSection from "./education-section"
import ProjectsSection from "./projects-section"

interface ResumeSectionProps {
    section: Section
    isActive: boolean
    onDragStart?: (sectionId: string) => void
    darkMode?: boolean
}

const sectionComponentMap = {
    education: EducationSection,
    projects: ProjectsSection,
    skills: SkillsSection,
    languages: LanguageSection,
};

export default function ResumeSection({ section, isActive, onDragStart, darkMode = false }: ResumeSectionProps) {
    const dispatch = useDispatch()
    const [isHovered, setIsHovered] = useState(false)
    const [showVisibilityMenu, setShowVisibilityMenu] = useState(false)
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null)
    const [showToolbar, setShowToolbar] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    const handleActivateSection = () => {
        dispatch(setActiveSection({ sectionId: section.id }))
        setShowToolbar(true)
    }

    const handleTitleChange = (newTitle: string) => {
        dispatch(
            updateSectionTitle({
                sectionId: section.id,
                title: newTitle
            }),
        )
    }

    const handleAddEntry = (sectionType: SectionTypeEnum, sectionId: string) => {
        switch (sectionType) {
            case SectionTypeEnum.EDUCATION:
                dispatch(
                    addEducation({
                        sectionId: section.id,
                        education: {
                            id: `edu-${Date.now()}`,
                            school: "",
                            degree: "",
                            location: "",
                            gpa: "",
                            logo: "",
                            period: "",
                            bullets: [],
                        },
                    }),
                )
                break
            case SectionTypeEnum.PROJECTS:
                dispatch(
                    addProject({
                        sectionId: section.id,
                        project: {
                            id: `project-${Date.now()}`,
                            projectName: '',
                            description: '',
                            link: '',
                            period: '',
                            location: '',
                            bullets: [],
                        },
                    }),
                )
                break
            case SectionTypeEnum.LANGUAGES:
                dispatch(
                    addLanguage({
                        sectionId: section.id,
                        language: {
                            id: `lang-${Date.now()}`,
                            name: "Language",
                            level: "Beginner",
                            proficiency: 1,
                        },
                    }),
                )
                break
            case SectionTypeEnum.SKILLS:
                dispatch(
                    addSkill({
                        sectionId: section.id,
                        groupId: "",
                        skill: ""
                    }),
                )
                break
        }
    }

    // const handleRemoveEntry = (entryId: string) => {
    //     dispatch(
    //         removeEntry({
    //             sectionId: section.id,
    //             entryId,
    //         }),
    //     )
    // }

    const handleContextMenu = (e: React.MouseEvent, entryId?: string) => {
        e.preventDefault()
        if (entryId) {
            setActiveEntryId(entryId)
        } else {
            setActiveEntryId(null)
        }
        setMenuPosition({ x: e.clientX, y: e.clientY })
        setShowVisibilityMenu(true)
    }

    // const handleToggleVisibility = (field: keyof FieldVisibility, value: boolean) => {
    //     if (activeEntryId) {
    //         dispatch(
    //             toggleFieldVisibility({
    //                 sectionId: section.id,
    //                 entryId: activeEntryId,
    //                 field,
    //                 value,
    //             }),
    //         )
    //     }
    // }

    const handleDragStartSection = () => {
        if (onDragStart) {
            onDragStart(section.id)
        }
    }

    const handleMoveToColumn = (targetColumn: "left" | "right") => {
        dispatch(
            updateSectionColumn({
                sectionId: section.id,
                column: targetColumn,
            }),
        )
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showVisibilityMenu && sectionRef.current && !sectionRef.current.contains(event.target as Node)) {
                setShowVisibilityMenu(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showVisibilityMenu])

    // Render different section types
    const renderSectionContent = () => {

        switch (section.type) {
            case SectionTypeEnum.EDUCATION:
                return <EducationSection section={section} isActive={isActive} darkMode={darkMode} />
            case SectionTypeEnum.PROJECTS:
                return <ProjectsSection section={section} isActive={isActive} darkMode={darkMode} />
            case SectionTypeEnum.LANGUAGES:
                return <LanguageSection section={section} isActive={isActive} darkMode={darkMode} />
            case SectionTypeEnum.SKILLS:
                return <SkillsSection section={section} isActive={isActive} darkMode={darkMode} />
            default:
                return null
        }
    }

    return (
        <div
            ref={sectionRef}
            className={cn("mb-6 relative group", isActive && "ring-1 ring-gray-300 rounded-md p-4 resume-section-active", darkMode && "resume-section-active--darkmode")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false)
                if (!isActive) setShowToolbar(false)
            }}
            onClick={handleActivateSection}
        >
            {(isActive || isHovered) && (
                <SectionToolbar
                    section={section}
                    onAddEntry={() => handleAddEntry(section.type, section.id)}
                    onDragStart={handleDragStartSection}
                    onMoveToColumn={handleMoveToColumn}
                    darkMode={darkMode}
                />
            )}

            <div className={cn("border-b mb-2", darkMode ? "border-slate-600" : "border-gray-800")}>
                <p>section type: {section.type}</p>
                <EditableText
                    value={section.title}
                    onChange={handleTitleChange}
                    className={cn("text-xl font-bold uppercase", darkMode && "text-white")}
                />
            </div>

            {renderSectionContent()}

            {/* {showVisibilityMenu && activeEntryId && (
                <FieldVisibilityMenu
                    position={menuPosition}
                    onClose={() => setShowVisibilityMenu(false)}
                    visibility={section.content.entries?.find((e) => e.id === activeEntryId)?.visibility || {}}
                    onToggle={handleToggleVisibility}
                />
            )} */}
        </div>
    )
}
