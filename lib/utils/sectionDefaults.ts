import { SectionTypeEnum, Section, EducationSectionItem, ProjectSectionItem, LanguageSectionItem, SkillSectionItem, AchievementSectionItem, VolunteeringItem, MyTimeItem, IndustryExpertiseItem } from "@/lib/types"

export const getDefaultEntry = (sectionType: SectionTypeEnum) => {
  const timestamp = Date.now()

  switch (sectionType) {
    case SectionTypeEnum.EDUCATION:
      return {
        id: `edu-${timestamp}`,
        school: "School or University",
        degree: "Degree and Field of Study",
        location: "City, Country",
        gpa: "3.8 / 4.0",
        logo: "/placeholder.svg",
        period: "2018 – 2022",
        bullets: ["Graduated with honors", "Member of Coding Club"],
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
        projectName: "Awesome Project",
        description: "Built a full-stack application using React and Node.js.",
        link: "https://github.com/yourusername/project",
        period: "Jan 2023 – Mar 2023",
        location: "Remote",
        bullets: ["Implemented real-time chat using WebSockets", "Integrated payment gateway"],
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
        name: "English",
        level: "Fluent",
        proficiency: 5,
        visibility: {
          proficiency: true,
          slider: true,
        },
      }

    case SectionTypeEnum.SKILLS:
      return {
        id: `group-${timestamp}`,
        groupName: "Technical Skills",
        skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
        borderStyle: "all",
        compactMode: true,
        visibility: {
          groupName: true,
          compactMode: true,
        },
      }

    case SectionTypeEnum.ACHIEVEMENTS:
      return {
        id: `achievement-${timestamp}`,
        title: "Winner - CodeSprint 2024",
        description: "Secured 1st place in a national-level coding competition among 5000+ participants.",
        icon: "award",
        visibility: {
          title: true,
          description: true,
          icon: true,
        },
      }   

    case SectionTypeEnum.VOLUNTEERING:
      return {
        id: `vol-${timestamp}`,
        role: "Executive Member",
        organization: "AIESEC",
        period: "09/2014 – Present",
        description: "Contributed to leadership development and cross‑cultural initiatives.",
        visibility: { period: true, description: true }
      } as VolunteeringItem

    case SectionTypeEnum.MY_TIME:
      return {
        id: `time-${timestamp}`,
        label: "Designing",
        value: 20,
        color: "#14b8a6"
      } as MyTimeItem

    case SectionTypeEnum.INDUSTRY_EXPERTISE:
      return {
        id: `ind-${timestamp}`,
        name: "Field or Industry",
        percent: 60,
        color: "#14b8a6",
        style: "solid",
        // gradientTo can be set when user selects Gradient style
      } as IndustryExpertiseItem

    default:
      return null
  }
}

export const getDefaultSection = (sectionType: SectionTypeEnum, column: "left" | "right", title: string, inSSR?: boolean): Section | null => {
  const sectionId = inSSR
    ? `section-${sectionType.toLowerCase()}`
    : `section-${Date.now()}-${Math.floor(Math.random() * 1000)}`

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

    case SectionTypeEnum.ACHIEVEMENTS:
      return {
        id: sectionId,
        type: SectionTypeEnum.ACHIEVEMENTS,
        column,
        title,
        content: {
          achievements: [entry as AchievementSectionItem]
        }
      }   

    case SectionTypeEnum.VOLUNTEERING:
      return {
        id: sectionId,
        type: SectionTypeEnum.VOLUNTEERING,
        column,
        title,
        content: {
          volunteering: [entry as VolunteeringItem],
        },
      }
    case SectionTypeEnum.MY_TIME:
      return {
        id: sectionId,
        type: SectionTypeEnum.MY_TIME,
        column,
        title,
        content: {
          my_time: [
            entry as MyTimeItem,
            { id: `time-${Date.now()}-2`, label: "Drawing", value: 15, color: "#f59e0b" },
            { id: `time-${Date.now()}-3`, label: "Brainstorming", value: 30, color: "#3b82f6" },
          ],
        },
      }

    case SectionTypeEnum.INDUSTRY_EXPERTISE:
      return {
        id: sectionId,
        type: SectionTypeEnum.INDUSTRY_EXPERTISE,
        column,
        title,
        content: {
          industry_expertise: [
            entry as IndustryExpertiseItem,
            { id: `ind-${Date.now()}-2`, name: "Consulting", percent: 40, color: "#3b82f6", style: "striped" },
          ],
        },
      }

    default:
      return null
  }
}
