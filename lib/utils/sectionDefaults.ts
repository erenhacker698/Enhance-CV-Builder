import { SectionTypeEnum, Section, EducationSectionItem, ProjectSectionItem, LanguageSectionItem, SkillSectionItem } from "@/lib/types"

export const getDefaultEntry = (sectionType: SectionTypeEnum) => {
    const timestamp = Date.now()

    switch (sectionType) {
        case SectionTypeEnum.EDUCATION:
            return {
                id: `edu-${timestamp}`,
                school: "",
                degree: "",
                location: "",
                gpa: "",
                logo: "",
                period: "",
                bullets: [],
                visibility: {
                    bullets: true,
                    gpa: true,
                    location: true,
                    logo: true,
                    period: true,
                },
            }

        case SectionTypeEnum.PROJECTS:
            return {
                id: `project-${timestamp}`,
                projectName: "",
                description: "",
                link: "",
                period: "",
                location: "",
                bullets: [],
                visibility: {
                    bullets: true,
                    description: true,
                    link: true,
                    location: true,
                    period: true,
                },
            }

        case SectionTypeEnum.LANGUAGES:
            return {
                id: `lang-${timestamp}`,
                name: "Language",
                level: "Beginner",
                proficiency: 1,
                visibility: {
                    proficiency: true,
                    slider: true,
                },
            }

        case SectionTypeEnum.SKILLS:
            return {
                id: `group-${timestamp}`,
                groupName: "Technical Skills",
                skills: ["HTML", "CSS", "JavaScript", "React"],
                borderStyle: "all",
                compactMode: true,
            }

        default:
            return null
    }
}

export const getDefaultSection = (sectionType: SectionTypeEnum, column: "left" | "right", title: string): Section | null => {
    const sectionId = `section-${Date.now()}`
    const entry = getDefaultEntry(sectionType)
    if (!entry) return null

    switch (sectionType) {
        case SectionTypeEnum.EDUCATION:
            return {
                id: sectionId,
                type: SectionTypeEnum.EDUCATION,
                column,
                title,
                content: {
                    educations: [entry as EducationSectionItem],
                },
            }

        case SectionTypeEnum.PROJECTS:
            return {
                id: sectionId,
                type: SectionTypeEnum.PROJECTS,
                column,
                title,
                content: {
                    projects: [entry as ProjectSectionItem],
                },
            }

        case SectionTypeEnum.LANGUAGES:
            return {
                id: sectionId,
                type: SectionTypeEnum.LANGUAGES,
                column,
                title,
                content: {
                    languages: [entry as LanguageSectionItem],
                },
            }

        case SectionTypeEnum.SKILLS:
            return {
                id: sectionId,
                type: SectionTypeEnum.SKILLS,
                column,
                title,
                content: {
                    skills: [entry as SkillSectionItem],
                },
            }

        default:
            return null
    }
}
