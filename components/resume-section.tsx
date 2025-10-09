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
    toggleEntryVisibility_Achievement,
    addAchievement,
    updateSectionContent,
} from "@/lib/features/resume/resumeSlice"
import { AchievementContentVisibility, AchievementSectionItem, EducationContentVisibility, EducationSectionItem, LanguageContentVisibility, LanguageSectionItem, ProjectContentVisibility, ProjectSectionItem, type Section, SectionTypeEnum, SkillVisibility, VisibilityDispatchMap, type MyTimeItem, type VolunteeringItem } from "@/lib/types"
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
import MyTimeSection from "@/components/Sections/MyTime/my-time-section"
import VolunteeringSection from "@/components/Sections/Volunteering/volunteering-section"
import MyTimeSettingsPanel from "@/components/Sections/MyTime/SettingsPannel/my-time-settings-panel"
import VolunteeringSettingsPanel from "@/components/Sections/Volunteering/SettingsPannel/volunteering-settings-panel"
import { getDefaultEntry } from "@/lib/utils/sectionDefaults"
import { RootState } from "@/lib/store"
import AchievementsSection from "./Sections/Achievements/achievements-section"
import AchievementsSettingsPanel from "./Sections/Achievements/SettingsPannel/achievements-settings-panel"
import IndustryExpertiseSection from "@/components/Sections/IndustryExpertise/industry-expertise-section"
import IndustryExpertiseSettingsPanel from "@/components/Sections/IndustryExpertise/SettingsPannel/industry-expertise-settings-panel"

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
            case SectionTypeEnum.ACHIEVEMENTS:
                dispatch(addAchievement({ sectionId: section.id, achievement: entry as AchievementSectionItem }))
                break
            case SectionTypeEnum.VOLUNTEERING: {
                const list = section.content.volunteering ?? []
                dispatch(updateSectionContent({
                    sectionId: section.id,
                    content: { ...section.content, volunteering: [...list, entry as VolunteeringItem] }
                }))
                break
            }
            case SectionTypeEnum.MY_TIME: {
                const list = section.content.my_time ?? []
                dispatch(updateSectionContent({
                    sectionId: section.id,
                    content: { ...section.content, my_time: [...list, entry as MyTimeItem] }
                }))
                break
            }
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
        [SectionTypeEnum.ACHIEVEMENTS]: toggleEntryVisibility_Achievement,
    }

    const handleToggleVisibility = (
        field: keyof EducationContentVisibility | keyof ProjectContentVisibility | keyof LanguageContentVisibility | keyof SkillVisibility | keyof AchievementContentVisibility,
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

    const handleMyTimeChange = (entryId: string, patch: Partial<MyTimeItem>) => {
        const list = section.content.my_time ?? []
        const next = list.map((i) => (i.id === entryId ? { ...i, ...patch } : i))
        dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, my_time: next } }))
    }

    const handleRemoveMyTime = (entryId: string) => {
        const list = section.content.my_time ?? []
        const next = list.filter((i) => i.id !== entryId)
        dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, my_time: next } }))
    }

    const handleToggleVolunteeringVisibility = (entryId: string, field: keyof NonNullable<VolunteeringItem['visibility']>, value: boolean) => {
        const list = section.content.volunteering ?? []
        const next: VolunteeringItem[] = list.map((i) => {
            if (i.id !== entryId) return i
            const prevVis = i.visibility ?? { period: true, description: true }
            const newVis: NonNullable<VolunteeringItem['visibility']> = { ...prevVis, [field]: value }
            return { ...i, visibility: newVis }
        })
        dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, volunteering: next } }))
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
            case SectionTypeEnum.ACHIEVEMENTS:
                return <AchievementsSection section={section} isActive={isActive} darkMode={darkMode} handleEntryToggle={handleEntryToggle} handleContextMenu={handleContextMenu} />
            case SectionTypeEnum.VOLUNTEERING:
                return <VolunteeringSection section={section} isActive={isActive} darkMode={darkMode} handleEntryToggle={handleEntryToggle} handleContextMenu={handleContextMenu} />
            case SectionTypeEnum.MY_TIME:
                return <MyTimeSection section={section} isActive={isActive} darkMode={darkMode} handleEntryToggle={handleEntryToggle} handleContextMenu={handleContextMenu} />
            case SectionTypeEnum.INDUSTRY_EXPERTISE:
                return <IndustryExpertiseSection section={section} isActive={isActive} darkMode={darkMode} handleEntryToggle={handleEntryToggle} handleContextMenu={handleContextMenu} />
            default:
                return null
        }
    }

    return (
        <div
            ref={isActive ? sectionRef : null}
            className={cn("mb-2 relative group p-4", isActive && !activeSection?.entryId && "p-[15px] resume-section-active !bg-white", darkMode && section.column === 'right' && isActive && "!bg-[#ffffff1f]")}
            onClick={handleSectionSelection}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false)
                if (!isActive) setShowToolbar(false)
            }}
            style={section.backgroundColor ? { backgroundColor: section.backgroundColor } : undefined}
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

                            {section.type === SectionTypeEnum.ACHIEVEMENTS && (
                                <AchievementsSettingsPanel
                                    achievement={section.content.achievements?.find((e) => e.id === activeSection.entryId) || null}
                                    onToggleVisibility={handleToggleVisibility}
                                    onClose={() => setShowVisibilityMenu(false)}
                                />
                            )}
                            {section.type === SectionTypeEnum.INDUSTRY_EXPERTISE && (
                                <IndustryExpertiseSettingsPanel
                                    item={section.content.industry_expertise?.find((e) => e.id === activeSection.entryId) || null}
                                    onChange={(patch) => {
                                        const list = section.content.industry_expertise ?? []
                                        const next = list.map((i) => i.id === activeSection!.entryId ? { ...i, ...patch } : i)
                                        dispatch(updateSectionContent({ sectionId: section.id, content: { ...section.content, industry_expertise: next } }))
                                    }}
                                    onClose={() => setShowVisibilityMenu(false)}
                                />
                            )}

                            {section.type === SectionTypeEnum.MY_TIME && (
                                <MyTimeSettingsPanel
                                    item={section.content.my_time?.find((e) => e.id === activeSection.entryId) || null}
                                    onChange={(patch) => handleMyTimeChange(activeSection.entryId!, patch)}
                                    onDelete={() => handleRemoveMyTime(activeSection.entryId!)}
                                    onClose={() => setShowVisibilityMenu(false)}
                                />
                            )}

                            {section.type === SectionTypeEnum.VOLUNTEERING && (
                                <VolunteeringSettingsPanel
                                    item={section.content.volunteering?.find((e) => e.id === activeSection.entryId) || null}
                                    onToggleVisibility={(field, value) => handleToggleVolunteeringVisibility(activeSection.entryId!, field, value)}
                                    onClose={() => setShowVisibilityMenu(false)}
                                />
                            )}
                        </>
                    )}
                </div>
            )}

            <div className={cn("mb-2")}>            
                <EditableText
                    value={section.title}
                    onChange={handleUpdateSectionChange}
                    className={cn(
                        "bg-transparent border-0 shadow-none m-0 min-h-[10px] outline-none p-0 resize-none break-words",
                        "font-normal uppercase resume-section-title",
                        darkMode && section.column === 'right' ? 'text-white' : '',
                        "w-full min-w-[2px] overflow-hidden block relative z-[1]",
                        "border-b border-[#bdbdbd] pb-2",
                        "whitespace-pre-wrap list-none",
                        "font-[Rubik,Arial,Helvetica,'Noto Sans Devanagari','Noto Sans CJK SC Thin','Noto Sans SC','Noto Sans Hebrew','Noto Sans Bengali',sans-serif]"
                    )}
                    placeholder="You Title"
                />
            </div>

            {renderSectionContent()}
        </div>
    )
}
