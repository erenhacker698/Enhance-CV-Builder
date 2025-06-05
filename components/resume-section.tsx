"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    updateSectionColumn,
    updateSectionTitle,
    addEntryEducation,
    addEntryProject,
    addEntryLanguage,
    addEntrySkill,
    toggleEntryVisibility_Education,
    toggleEntryVisibility_Project,
    toggleEntryVisibility_Language,
    toggleEntryVisibility_SkillsContent,
    addEntrySkillGroup,
    upsertActiveSection,
} from "@/lib/features/resume/resumeSlice"
import { EducationContentVisibility, EducationSectionItem, LanguageContentVisibility, LanguageSectionItem, ProjectContentVisibility, ProjectSectionItem, type Section, SectionTypeEnum, SkillVisibility, VisibilityDispatchMap } from "@/lib/types"
import { cn } from "@/lib/utils"
import EditableText from "@/components/Shared/editable-text"
import SectionToolbar from "@/components/Common/Sections/section-toolbar"
import SkillsSection from "@/components/Sections/Skills/skills-section"
import SkillsSettingsPanel from "./Sections/Skills/SettingsPannel/skills-settings-panel"
import LanguageSection from "@/components/Sections/Language/language-section"
import EducationSection from "./Sections/Education/education-section"
import ProjectsSection from "./Sections/Projects/projects-section"
import EducationSettingsPanel from "./Sections/Education/SettingsPannel/education-settings-panel"
import ProjectsSettingsPanel from "./Sections/Projects/SettingsPannel/projects-settings-panel"
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
    const activeSection = useSelector((state: RootState) => state.resume.activeSection)
    const { activeSkillData } = useSelector((state: RootState) => state.resume)
    const [isHovered, setIsHovered] = useState(false)
    const [showVisibilityMenu, setShowVisibilityMenu] = useState(false)
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null)
    const [showToolbar, setShowToolbar] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    // console.log('activeSection outside: ', activeSection)
    // console.log('activeSkillData outside: ', activeSkillData)

    const handleSectionSelection = () => {
        dispatch(upsertActiveSection({
            activeSection: {
                id: section.id,
                title: section.title,
                column: section.column,
                type: section.type,
                entryId: null
            }
        }))
        setShowToolbar(true)
        console.log('handleSectionSelection')
        console.log('activeSection?.entryId= ', activeSection?.entryId)
    }

    const handleEntryToggle = (e: React.MouseEvent, entryId: string) => {
        e.stopPropagation()
        dispatch(upsertActiveSection({
            activeSection: {
                id: section.id,
                title: section.title,
                column: section.column,
                type: section.type,
                entryId: entryId
            }
        }))
        console.log('handleEntryToggle')
    }

    const handleContextMenu = (e: React.MouseEvent, entryId?: string, groupId?: string) => {
        e.preventDefault()
        if (entryId) {
            dispatch(upsertActiveSection({
                activeSection: {
                    id: section.id,
                    title: section.title,
                    column: section.column,
                    type: section.type,
                    entryId: entryId
                }
            }))
            setActiveGroupId(groupId ?? null)
        } else {
            dispatch(upsertActiveSection({
                activeSection: null
            }))
            setActiveGroupId(groupId ?? null)
        }
        setMenuPosition({ x: e.clientX, y: e.clientY })
        setShowVisibilityMenu(true)
        console.log('handleContextMenu')
    }

    const handleUpdateSectionChange = (newTitle: string) => {
        dispatch(
            updateSectionTitle({
                sectionId: section.id,
                title: newTitle
            }),
        )
    }

    const handleAddEntry = () => {
        const entry = getDefaultEntry(section.type)

        if (!entry) return

        switch (section.type) {
            case SectionTypeEnum.EDUCATION:
                dispatch(addEntryEducation({ sectionId: section.id, education: entry as EducationSectionItem }))
                break
            case SectionTypeEnum.PROJECTS:
                dispatch(addEntryProject({ sectionId: section.id, project: entry as ProjectSectionItem }))
                break
            case SectionTypeEnum.LANGUAGES:
                dispatch(addEntryLanguage({ sectionId: section.id, language: entry as LanguageSectionItem }))
                break
            case SectionTypeEnum.SKILLS:
                if (activeSection && activeSection.entryId) {
                    dispatch(addEntrySkill({ sectionId: section.id, groupId: activeSection.entryId, skill: "Your Skill" }))
                }
                break
        }
    }

    const handleAddGroup = () => {
        dispatch(
            addEntrySkillGroup({
                sectionId: section.id,
                skillItem: {
                    id: `group-${Date.now()}`,
                    groupName: "New Group",
                    skills: ["Skill1", "Skill2"],
                    visibility: {
                        groupName: true,
                        compactMode: false
                    }
                },
            }),
        )
    }

    const visibilityDispatchMap: VisibilityDispatchMap = {
        [SectionTypeEnum.EDUCATION]: toggleEntryVisibility_Education,
        [SectionTypeEnum.PROJECTS]: toggleEntryVisibility_Project,
        [SectionTypeEnum.LANGUAGES]: toggleEntryVisibility_Language,
        [SectionTypeEnum.SKILLS]: toggleEntryVisibility_SkillsContent,
    }

    const handleToggleVisibility = (
        field: keyof EducationContentVisibility | keyof ProjectContentVisibility | keyof LanguageContentVisibility | keyof SkillVisibility,
        value: boolean
    ) => {
        if (activeSection?.entryId && section.type in visibilityDispatchMap) {
            const actionCreator = visibilityDispatchMap[section.type as keyof VisibilityDispatchMap] as (
                payload: any
            ) => any

            dispatch(
                actionCreator({
                    sectionId: section.id,
                    entryId: activeSection?.entryId,
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
        if (!isActive) return
        const handleClickOutside__Section = (event: MouseEvent) => {
            if (sectionRef.current && !sectionRef.current.contains(event.target as Node)) {
                setShowVisibilityMenu(false)
                dispatch(
                    upsertActiveSection({
                        activeSection: null
                    })
                )
                console.log('sectionRef.current= ', sectionRef.current)
                console.log('event.target= ', event.target)
                // console.log('handleClickOutside__Section')
            }
        }

        document.addEventListener("mousedown", handleClickOutside__Section)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside__Section)
        }
    }, [isActive])

    const renderSectionContent = () => {
        switch (section.type) {
            case SectionTypeEnum.EDUCATION:
                return <EducationSection section={section} isActive={isActive} darkMode={darkMode} handleEntryToggle={handleEntryToggle} handleContextMenu={handleContextMenu} />
            case SectionTypeEnum.PROJECTS:
                return <ProjectsSection section={section} isActive={isActive} darkMode={darkMode} handleEntryToggle={handleEntryToggle} handleContextMenu={handleContextMenu} />
            case SectionTypeEnum.LANGUAGES:
                return <LanguageSection section={section} isActive={isActive} darkMode={darkMode} handleEntryToggle={handleEntryToggle} handleContextMenu={handleContextMenu} />
            case SectionTypeEnum.SKILLS:
                return <SkillsSection section={section} isActive={isActive} darkMode={darkMode} handleEntryToggle={handleEntryToggle} handleContextMenu={handleContextMenu} />
            default:
                return null
        }
    }

    return (
        <div
            ref={isActive ? sectionRef : null}
            data-active-section-type={section.type}
            className={cn("mb-6 relative group p-4", isActive && "p-[15px] resume-section-active", darkMode && "resume-section-active--darkmode")}
            onClick={handleSectionSelection}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false)
                if (!isActive) setShowToolbar(false)
            }}
        >
            {(isActive) && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-3">
                    <SectionToolbar
                        section={section}
                        isActive={isActive}
                        onAddEntry={() => handleAddEntry()}
                        onAddGroup={() => handleAddGroup()}
                        onDragStart={handleDragStartSection}
                        onMoveToColumn={handleMoveToColumn}
                        onShowSettingsPanel={() => setShowVisibilityMenu(prev => !prev)}
                        darkMode={darkMode}
                    />
                    {showVisibilityMenu && activeSection?.entryId && (
                        <>
                            {section.type === SectionTypeEnum.EDUCATION && (
                                <EducationSettingsPanel
                                    education={section.content.educations?.find((e) => e.id === activeSection.entryId) || null}
                                    onToggleVisibility={handleToggleVisibility}
                                    onClose={() => setShowVisibilityMenu(false)}
                                />
                            )}

                            {section.type === SectionTypeEnum.PROJECTS && (
                                <ProjectsSettingsPanel
                                    projectItem={section.content.projects?.find((e) => e.id === activeSection.entryId) || null}
                                    onToggleVisibility={handleToggleVisibility}
                                    onClose={() => setShowVisibilityMenu(false)}
                                />
                            )}

                            {section.type === SectionTypeEnum.LANGUAGES && (
                                <LanguageSettingsPanel
                                    language={section.content.languages?.find((e) => e.id === activeSection.entryId) || null}
                                    onToggleVisibility={handleToggleVisibility}
                                    onClose={() => setShowVisibilityMenu(false)}
                                />
                            )}

                            {section.type === SectionTypeEnum.SKILLS && (
                                <SkillsSettingsPanel
                                    skill={section.content.skills?.find((e) => e.id === activeSection.entryId) || null}
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
                    onChange={handleUpdateSectionChange}
                    className={cn("SectionNameItemElegant-module_sectionName", darkMode && "text-white")}
                    placeholder="EDUCATION"
                />
            </div>

            {renderSectionContent()}
        </div>
    )
}
