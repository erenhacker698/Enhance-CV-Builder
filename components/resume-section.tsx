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
    toggleEducationContentVisibility,
} from "@/lib/features/resume/resumeSlice"
import { EducationContentVisibility, type Section, SectionTypeEnum } from "@/lib/types"
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
import EducationSettingsPanel from "./education-settings-panel"

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

    // useEffect(() => {
    //     console.log("activeEntryId= ", activeEntryId)
    // }, [activeEntryId])

    const handleActivateSection = () => {
        // console.log("handleActivateSection() called")
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
        // console.log("sectionType in handleAddEntry= ", sectionType)
        // console.log("sectionId in handleAddEntry= ", sectionId)
        switch (sectionType) {
            case SectionTypeEnum.EDUCATION:
                dispatch(
                    addEducation({
                        sectionId,
                        education: {
                            id: `edu-${Date.now()}`,
                            school: "",
                            degree: "",
                            location: "",
                            gpa: "",
                            logo: "",
                            period: "",
                            bullets: [],
                            visibility: {
                                bullets: false,
                                gpa: false,
                                location: false,
                                logo: false,
                                period: false
                            }
                        },
                    }),
                )
                break
            case SectionTypeEnum.PROJECTS:
                dispatch(
                    addProject({
                        sectionId,
                        project: {
                            id: `project-${Date.now()}`,
                            projectName: '',
                            description: '',
                            link: '',
                            period: '',
                            location: '',
                            bullets: [],
                            visibility: {
                                bullets: false,
                                description: false,
                                link: false,
                                location: false,
                                period: false
                            }
                        },
                    }),
                )
                break
            case SectionTypeEnum.LANGUAGES:
                dispatch(
                    addLanguage({
                        sectionId,
                        language: {
                            id: `lang-${Date.now()}`,
                            name: "Language",
                            level: "Beginner",
                            proficiency: 1,
                            visibility: {
                                proficiency: false,
                                slider: false,
                            }
                        },
                    }),
                )
                break
            case SectionTypeEnum.SKILLS:
                dispatch(
                    addSkill({
                        sectionId,
                        groupId: "",
                        skill: "",
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

    const handleEntrySwitch = (e: React.MouseEvent, entryId: string) => {
        // console.log("Inside handleEntryToggle: ", entryId)
        e.stopPropagation()
        setActiveEntryId(entryId)
    }

    const handleContextMenu = (e: React.MouseEvent, entryId?: string) => {
        // console.log("entryId:= ", entryId)
        e.preventDefault()
        if (entryId) {
            setActiveEntryId(entryId)
        } else {
            setActiveEntryId(null)
        }
        setMenuPosition({ x: e.clientX, y: e.clientY })
        setShowVisibilityMenu(true)
    }

    const handleToggleVisibility = (field: keyof EducationContentVisibility, value: boolean) => {
        console.log('handleToggleVisibility called()')
        console.log(`
            {
                section.id: ${section.id}
                activeEntryId: ${activeEntryId}
                field: ${field},
                value: ${value}
            }
                `)
        if (activeEntryId) {
            dispatch(
                toggleEducationContentVisibility({
                    sectionId: section.id,
                    entryId: activeEntryId,
                    field,
                    value,
                }),
            )
        }
    }

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

    const renderSectionContent = () => {

        switch (section.type) {
            case SectionTypeEnum.EDUCATION:
                return <EducationSection section={section} isActive={isActive} darkMode={darkMode} handleContextMenu={handleContextMenu} handleEntrySwitch={handleEntrySwitch} handleActivateSection={handleActivateSection} />
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
            className={cn("mb-6 relative group p-4", isActive && "ring-1 ring-gray-300 rounded-md resume-section-active", darkMode && "resume-section-active--darkmode")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false)
                if (!isActive) setShowToolbar(false)
            }}
            onClick={handleActivateSection}
        >
            {(isActive) && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-3">
                    <SectionToolbar
                        section={section}
                        activeEntryId={activeEntryId}
                        onAddEntry={() => handleAddEntry(section.type, section.id)}
                        onDragStart={handleDragStartSection}
                        onMoveToColumn={handleMoveToColumn}
                        onShowSettingsPanel={() => setShowVisibilityMenu(!showVisibilityMenu)}
                        darkMode={darkMode}
                    />
                    {showVisibilityMenu && activeEntryId && (
                        <EducationSettingsPanel
                            education={section.content.educations?.find((e) => e.id === activeEntryId) || null}
                            onToggleVisibility={handleToggleVisibility}
                            onClose={() => setShowVisibilityMenu(false)}
                        />
                    )}
                </div>
            )}

            <div className={cn("mb-2", darkMode ? "" : "")}>
                <EditableText
                    value={section.title}
                    onChange={handleTitleChange}
                    className={cn("SectionNameItemElegant-module_sectionName", darkMode && "text-white")}
                    placeholder="EDUCATION"
                />
            </div>

            {renderSectionContent()}

            {/* {showVisibilityMenu && activeEntryId && (
                <FieldVisibilityMenu
                    position={menuPosition}
                    onClose={() => setShowVisibilityMenu(false)}
                    visibility={section.content?.educations?.find((e) => e.id === activeEntryId)?.visibility || null}
                    onToggle={() => handleToggleVisibility}
                />
            )} */}
        </div>
    )
}
