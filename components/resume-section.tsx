"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    setActiveSection,
    updateSectionColumn,
    updateSectionTitle,
    addEducation,
    addProject,
    addLanguage,
    addSkill,
    toggleEducationContentVisibility,
    toggleProjectContentVisibility,
    toggleLanguageVisibility,
    toggleSkillsContentVisibility,
    addSkillGroup,
} from "@/lib/features/resume/resumeSlice"
import { EducationContentVisibility, EducationSectionItem, LanguageContentVisibility, LanguageSectionItem, ProjectContentVisibility, ProjectSectionItem, type Section, SectionTypeEnum, SkillVisibility, VisibilityDispatchMap } from "@/lib/types"
import { cn } from "@/lib/utils"
import EditableText from "@/components/editable-text"
import SectionToolbar from "@/components/section-toolbar"
import SkillsSection from "@/components/Sections/Skills/SettingsPannel/skills-section"
import LanguageSection from "@/components/Sections/Language/language-section"
import EducationSection from "./Sections/Education/education-section"
import ProjectsSection from "./projects-section"
import EducationSettingsPanel from "./Sections/Education/SettingsPannel/education-settings-panel"
import ProjectsSettingsPanel from "./projects-settings-panel"
import SkillsSettingsPanel from "./Sections/Skills/SettingsPannel/skills-settings-panel"
import LanguageSettingsPanel from "./Sections/Language/SettingsPannel/language-settings-panel"
import { getDefaultEntry } from "@/lib/utils/sectionDefaults"
import { RootState } from "@/lib/store"

interface ResumeSectionProps {
    section: Section
    isActive: boolean
    onDragStart?: (sectionId: string) => void
    darkMode?: boolean
};

export default function ResumeSection({ section, isActive, onDragStart, darkMode = false }: ResumeSectionProps) {
    const dispatch = useDispatch()
    const { activeSkillData } = useSelector((state: RootState) => state.resume)
    const [isHovered, setIsHovered] = useState(false)
    const [showVisibilityMenu, setShowVisibilityMenu] = useState(false)
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null)
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null)
    const [showToolbar, setShowToolbar] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    const handleActivateSection = () => {
        dispatch(setActiveSection({ sectionId: section.id, sectionType: section.type }))
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
        const entry = getDefaultEntry(sectionType)

        if (!entry) return

        switch (sectionType) {
            case SectionTypeEnum.EDUCATION:
                dispatch(addEducation({ sectionId, education: entry as EducationSectionItem }))
                break
            case SectionTypeEnum.PROJECTS:
                dispatch(addProject({ sectionId, project: entry as ProjectSectionItem }))
                break
            case SectionTypeEnum.LANGUAGES:
                dispatch(addLanguage({ sectionId, language: entry as LanguageSectionItem }))
                break
            case SectionTypeEnum.SKILLS:
                if (activeSkillData?.groupId) {
                    dispatch(addSkill({ sectionId, groupId: activeSkillData.groupId, skill: "Your Skill" }))
                }
                break
        }
    }

    const handleAddGroup = () => {
        dispatch(
            addSkillGroup({
                sectionId: section.id,
                skillItem: {
                    id: `group-${Date.now()}`,
                    groupName: "New Group",
                    skills: ["Skill1", "Skill2"],
                    compactMode: false,
                    borderStyle: "bottom",
                    visibility: {
                        groupName: true,
                        compactMode: false
                    }
                },
            }),
        )
    }

    const handleEntrySwitch = (e: React.MouseEvent, entryId: string) => {
        e.stopPropagation()
        setActiveEntryId(entryId)
    }

    const handleGroupSwitch = (e: React.MouseEvent, entryId: string, groupId: string) => {
        e.stopPropagation()
        setActiveGroupId(groupId)
    }

    const handleContextMenu = (e: React.MouseEvent, entryId?: string, groupId?: string) => {
        // console.log("entryId:= ", entryId)
        e.preventDefault()
        if (entryId) {
            setActiveEntryId(entryId)
            setActiveGroupId(groupId ?? null)
        } else {
            setActiveEntryId(null)
            setActiveGroupId(groupId ?? null)
        }
        setMenuPosition({ x: e.clientX, y: e.clientY })
        setShowVisibilityMenu(true)
    }

    const visibilityDispatchMap: VisibilityDispatchMap = {
        [SectionTypeEnum.EDUCATION]: toggleEducationContentVisibility,
        [SectionTypeEnum.PROJECTS]: toggleProjectContentVisibility,
        [SectionTypeEnum.LANGUAGES]: toggleLanguageVisibility,
        [SectionTypeEnum.SKILLS]: toggleSkillsContentVisibility,
    }

    const handleToggleVisibility = (
        field: keyof EducationContentVisibility | keyof ProjectContentVisibility | keyof LanguageContentVisibility | keyof SkillVisibility,
        value: boolean
    ) => {
        if (activeEntryId && section.type in visibilityDispatchMap) {
            const actionCreator = visibilityDispatchMap[section.type as keyof VisibilityDispatchMap] as (
                payload: any
            ) => any

            dispatch(
                actionCreator({
                    sectionId: section.id,
                    entryId: activeEntryId,
                    field,
                    value,
                })
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
                return <ProjectsSection section={section} isActive={isActive} darkMode={darkMode} handleContextMenu={handleContextMenu} handleEntrySwitch={handleEntrySwitch} handleActivateSection={handleActivateSection} />
            case SectionTypeEnum.LANGUAGES:
                return <LanguageSection section={section} isActive={isActive} darkMode={darkMode} handleContextMenu={handleContextMenu} handleEntrySwitch={handleEntrySwitch} handleActivateSection={handleActivateSection} />
            case SectionTypeEnum.SKILLS:
                return <SkillsSection section={section} isActive={isActive} darkMode={darkMode} handleContextMenu={handleContextMenu} handleEntrySwitch={handleEntrySwitch} handleActivateSection={handleActivateSection} />
            default:
                return null
        }
    }

    return (
        <div
            ref={sectionRef}
            data-active-section-type={section.type}
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
                        onAddGroup={() => handleAddGroup()}
                        onDragStart={handleDragStartSection}
                        onMoveToColumn={handleMoveToColumn}
                        onShowSettingsPanel={() => setShowVisibilityMenu(prev => !prev)}
                        darkMode={darkMode}
                    />
                    {showVisibilityMenu && activeEntryId && (
                        <>
                            {section.type === SectionTypeEnum.EDUCATION && (
                                <EducationSettingsPanel
                                    education={section.content.educations?.find((e) => e.id === activeEntryId) || null}
                                    onToggleVisibility={handleToggleVisibility}
                                    onClose={() => setShowVisibilityMenu(false)}
                                />
                            )}

                            {section.type === SectionTypeEnum.PROJECTS && (
                                <ProjectsSettingsPanel
                                    projectItem={section.content.projects?.find((e) => e.id === activeEntryId) || null}
                                    onToggleVisibility={handleToggleVisibility}
                                    onClose={() => setShowVisibilityMenu(false)}
                                />
                            )}

                            {section.type === SectionTypeEnum.LANGUAGES && (
                                <LanguageSettingsPanel
                                    language={section.content.languages?.find((e) => e.id === activeEntryId) || null}
                                    onToggleVisibility={handleToggleVisibility}
                                    onClose={() => setShowVisibilityMenu(false)}
                                />
                            )}

                            {section.type === SectionTypeEnum.SKILLS && (
                                <SkillsSettingsPanel
                                    skill={section.content.skills?.find((e) => e.id === activeEntryId) || null}
                                    onToggleVisibility={handleToggleVisibility}
                                    onClose={() => setShowVisibilityMenu(false)}
                                />
                            )}
                        </>
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
        </div>
    )
}
