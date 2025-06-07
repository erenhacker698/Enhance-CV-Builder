import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import {
  AchievementSectionItem,
  ActiveSection,
  EducationContentVisibility,
  EducationSectionItem,
  LanguageSectionItem,
  ProjectContentVisibility,
  ProjectSectionItem,
  SectionTypeEnum,
  SkillSectionItem,
  SkillVisibility,
  type ResumeState,
  type Section,
} from "@/lib/types"

const initialState: ResumeState = {
  header: {
    name: "YOUR NAME",
    title: "The role you are applying for?",
    phone: "Phone",
    email: "Email",
    link: "LinkedIn/Portfolio",
    extraLink: "Extra Link",
    location: "Location",
    extraField: "Extra Field",
    photoUrl: "",
    visibility: {
      title: true,
      phone: true,
      email: true,
      link: true,
      extraLink: true,
      location: true,
      photo: true,
      extraField: true,
    },
    uppercaseName: true,
    roundPhoto: true,
  },
  sections: [
    {
      id: "section-education",
      type: SectionTypeEnum.EDUCATION,
      column: "left",
      title: "EDUCATION",
      content: {
        educations: [
          {
            id: "edu-1",
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
          },
        ],
      },
    },
    {
      id: "section-skills",
      type: SectionTypeEnum.SKILLS,
      column: "left",
      title: "SKILLS",
      content: {
        skills: [
          {
            id: "group-1",
            groupName: "Technical Skills",
            skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
            visibility: {
              groupName: true,
              compactMode: true,
            },
          },
        ],
      },
    },
    {
      id: "section-projects",
      type: SectionTypeEnum.PROJECTS,
      column: "right",
      title: "PROJECTS",
      content: {
        projects: [
          {
            id: "project-1",
            projectName: "Awesome Project",
            description: "Built a full-stack application using React and Node.js.",
            link: "https://github.com/yourusername/project",
            period: "Jan 2023 – Mar 2023",
            location: "Remote",
            bullets: [
              "Implemented real-time chat using WebSockets",
              "Integrated payment gateway",
            ],
            visibility: {
              bullets: true,
              description: true,
              link: true,
              location: true,
              period: true,
            },
          },
        ],
      },
    },
    {
      id: "section-languages",
      type: SectionTypeEnum.LANGUAGES,
      column: "right",
      title: "LANGUAGES",
      content: {
        languages: [
          {
            id: "lang-1",
            name: "English",
            level: "Fluent",
            proficiency: 5,
            visibility: {
              proficiency: true,
              slider: true,
            },
          },
        ],
      },
    },
    {
      id: `achievement-${Date.now()}`,
      type: SectionTypeEnum.ACHIEVEMENTS,
      column: "right",
      title: "ACHIEVEMENTS",
      content: {
        achievements: [
          {
            id: 'achievements-1',
            title: "Winner - CodeSprint 2024",
            description: "Secured 1st place in a national-level coding competition among 5000+ participants.",
            icon: "award",
            visibility: {
              description: true,
              icon: true,
            },
          }
        ]
      }
    }
  ],
  activeSection: null,
  activeSkillData: null,
  history: {
    past: [],
    future: [],
  },
}

// Helper function to save current state to history
const saveToHistory = (state: ResumeState) => {
  const currentState = {
    header: JSON.parse(JSON.stringify(state.header)),
    sections: JSON.parse(JSON.stringify(state.sections)),
  }

  state.history.past.push(currentState)

  // Limit history size to prevent memory issues
  if (state.history.past.length > 50) {
    state.history.past.shift()
  }

  // Clear future when a new action is performed
  state.history.future = []
}

export const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    // Undo/Redo actions
    undo: (state) => {
      const previous = state.history.past.pop()
      if (previous) {
        // Save current state to future
        const currentState = {
          header: JSON.parse(JSON.stringify(state.header)),
          sections: JSON.parse(JSON.stringify(state.sections)),
        }
        state.history.future.push(currentState)

        // Restore previous state
        state.header = previous.header
        state.sections = previous.sections
      }
    },

    redo: (state) => {
      const next = state.history.future.pop()
      if (next) {
        // Save current state to past
        const currentState = {
          header: JSON.parse(JSON.stringify(state.header)),
          sections: JSON.parse(JSON.stringify(state.sections)),
        }
        state.history.past.push(currentState)

        // Restore next state
        state.header = next.header
        state.sections = next.sections
      }
    },

    // Header actions
    updateHeaderField: (
      state,
      action: PayloadAction<{
        field: string
        value: string
      }>,
    ) => {
      saveToHistory(state)
      const { field, value } = action.payload
        ; (state.header as any)[field] = value
    },

    toggleHeaderFieldVisibility: (
      state,
      action: PayloadAction<{
        field: string
        value: boolean
      }>,
    ) => {
      saveToHistory(state)
      const { field, value } = action.payload
      state.header.visibility[field as keyof typeof state.header.visibility] = value
    },

    toggleUppercaseName: (
      state,
      action: PayloadAction<{
        value: boolean
      }>,
    ) => {
      saveToHistory(state)
      state.header.uppercaseName = action.payload.value
    },

    togglePhotoStyle: (
      state,
      action: PayloadAction<{
        value: boolean
      }>,
    ) => {
      saveToHistory(state)
      state.header.roundPhoto = action.payload.value
    },

    uploadProfilePhoto: (
      state,
      action: PayloadAction<{
        photoUrl: string
      }>,
    ) => {
      saveToHistory(state)
      state.header.photoUrl = action.payload.photoUrl
    },

    // Active section action
    upsertActiveSection: (state, action: PayloadAction<{
      activeSection: ActiveSection | null
    }>,
    ) => {
      if (action.payload.activeSection) {
        state.activeSection = action.payload.activeSection
      } else {
        state.activeSection = null
      }
    },

    // Section actions
    addSection: (
      state,
      action: PayloadAction<{
        section: Section
        column: "left" | "right"
      }>,
    ) => {
      saveToHistory(state)
      const newSection = {
        ...action.payload.section,
        column: action.payload.column,
      }
      state.sections.push(newSection)
    },

    removeSection: (state, action: PayloadAction<{ sectionId: string }>) => {
      saveToHistory(state)
      state.sections = state.sections.filter((section) => section.id !== action.payload.sectionId)
      if (state.activeSection?.id === action.payload.sectionId) {
        state.activeSection = null
      }
    },

    removeSectionEntry: (
      state,
      action: PayloadAction<{
        sectionId: string
        entryId: string
      }>
    ) => {
      saveToHistory(state)

      const section = state.sections.find((s) => s.id === action.payload.sectionId)

      if (section) {
        const sectionType = section.type

        if (sectionType === "educations" && section.content.educations) {
          section.content.educations = section.content.educations.filter((e) => e.id !== action.payload.entryId)
        } else if (sectionType === "projects" && section.content.projects) {
          section.content.projects = section.content.projects.filter((e) => e.id !== action.payload.entryId)
        } else if (sectionType === "skills" && section.content.skills) {
          section.content.skills = section.content.skills.filter((e) => e.id !== action.payload.entryId)
        } else if (sectionType === "languages" && section.content.languages) {
          section.content.languages = section.content.languages.filter((e) => e.id !== action.payload.entryId)
        }
      }
    }
    ,

    updateSectionTitle: (
      state,
      action: PayloadAction<{
        sectionId: string
        title: Section["title"]
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section) {
        section.title = action.payload.title
      }
    },

    updateSectionContent: (
      state,
      action: PayloadAction<{
        sectionId: string
        content: Section["content"]
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section) {
        section.content = action.payload.content
      }
    },

    reorderSections: (state, action: PayloadAction<{ sections: Section[] }>) => {
      saveToHistory(state)
      state.sections = action.payload.sections
    },

    updateSectionColumn: (
      state,
      action: PayloadAction<{
        sectionId: string
        column: "left" | "right"
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section) {
        section.column = action.payload.column
      }
    },

    // Education actions
    addEntryEducation: (
      state,
      action: PayloadAction<{
        sectionId: string
        education: EducationSectionItem
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.educations) {
        section.content.educations.push(action.payload.education)
      } else if (section) {
        section.content.educations = [action.payload.education]
      }
    },

    removeEntryEducation: (
      state,
      action: PayloadAction<{
        sectionId: string
        entryId: string
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.educations) {
        section.content.educations = section.content.educations.filter((e) => e.id !== action.payload.entryId)
      }
    },

    updateEntryEducation: (
      state,
      action: PayloadAction<{
        sectionId: string
        entryId: string
        field: string
        value: string | string[]
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)

      if (section && section.content.educations) {
        const entry = section.content.educations.find((e) => e.id === action.payload.entryId)
        if (entry) {
          (entry as any)[action.payload.field] = action.payload.value
        }
      }
    },

    toggleEntryVisibility_Education: (
      state,
      action: PayloadAction<{
        sectionId: string
        entryId: string
        field: keyof EducationContentVisibility
        value: boolean
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.educations) {
        const entry = section.content.educations.find((e) => e.id === action.payload.entryId)
        if (entry && entry.visibility) {
          entry.visibility[action.payload.field] = action.payload.value
        }
      }
    },

    // Project actions
    addEntryProject: (
      state,
      action: PayloadAction<{
        sectionId: string
        project: ProjectSectionItem
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.projects) {
        section.content.projects.push(action.payload.project)
      } else if (section) {
        section.content.projects = [action.payload.project]
      }
    },

    removeEntryProject: (
      state,
      action: PayloadAction<{
        sectionId: string
        projectId: string
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.projects) {
        section.content.projects = section.content.projects.filter((e) => e.id !== action.payload.projectId)
      }
    },

    updateEntryProject: (
      state,
      action: PayloadAction<{
        sectionId: string
        projectId: string
        field: string
        value: string | string[]
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.projects) {
        const entry = section.content.projects.find((e) => e.id === action.payload.projectId)
        if (entry) {
          (entry as any)[action.payload.field] = action.payload.value
        }
      }
    },

    toggleEntryVisibility_Project: (
      state,
      action: PayloadAction<{
        sectionId: string
        entryId: string
        field: keyof ProjectContentVisibility
        value: boolean
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.projects) {
        const entry = section.content.projects.find((e) => e.id === action.payload.entryId)
        if (entry && entry.visibility) {
          entry.visibility[action.payload.field] = action.payload.value
        }
      }
    },

    // Skills actions
    addEntrySkillGroup: (
      state,
      action: PayloadAction<{
        sectionId: string
        skillItem: SkillSectionItem
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.skills) {
        section.content.skills.push(action.payload.skillItem)
      } else if (section) {
        section.content.skills = [action.payload.skillItem]
      }
    },

    updateEntrySkillGroup: (
      state,
      action: PayloadAction<{
        sectionId: string
        groupId: string
        groupName: string
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.skills) {
        const group = section.content.skills.find((g) => g.id === action.payload.groupId)
        if (group) {
          group.groupName = action.payload.groupName
        }
      }
    },

    removeEntrySkillGroup: (
      state,
      action: PayloadAction<{
        sectionId: string
        groupId: string
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.skills) {
        section.content.skills = section.content.skills.filter((group) => group.id !== action.payload.groupId)
      }
    },

    setActiveSkillData: (
      state,
      action: PayloadAction<{
        sectionId: string
        groupId: string
        skillIndex: number
      } | null>
    ) => {
      if (action.payload) {
        const { sectionId, groupId, skillIndex } = action.payload
        state.activeSkillData = { sectionId, groupId, skillIndex }
      } else {
        state.activeSkillData = null
      }
    },

    addEntrySkill: (
      state,
      action: PayloadAction<{
        sectionId: string
        groupId: string
        skill: string
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.skills) {
        const group = section.content.skills.find((g) => g.id === action.payload.groupId)
        if (group) {
          group.skills.push(action.payload.skill)
        }
      }
    },

    updateEntrySkill: (
      state,
      action: PayloadAction<{
        sectionId: string
        groupId: string
        skillIndex: number
        newSkill: string
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section?.content.skills) {
        const group = section.content.skills.find((g) => g.id === action.payload.groupId)
        if (group) {
          group.skills[action.payload.skillIndex] = action.payload.newSkill
        }
      }
    },

    removeEntrySkill: (
      state,
      action: PayloadAction<{
        sectionId: string
        groupId: string
        skillIndex: number
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.skills) {
        const group = section.content.skills.find((g) => g.id === action.payload.groupId)
        if (group) {
          group.skills.splice(action.payload.skillIndex, 1)
        }
      }
    },

    toggleEntryVisibility_SkillsContent: (
      state,
      action: PayloadAction<{
        sectionId: string
        entryId: string
        field: keyof SkillVisibility
        value: boolean
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.skills) {
        const entry = section.content.skills.find((e) => e.id === action.payload.entryId)
        if (entry && entry.visibility) {
          entry.visibility[action.payload.field] = action.payload.value
        }
      }
    },

    // Language actions
    addEntryLanguage: (
      state,
      action: PayloadAction<{
        sectionId: string
        language: LanguageSectionItem
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.languages) {
        section.content.languages.push(action.payload.language)
      } else if (section) {
        section.content.languages = [action.payload.language]
      }
    },

    updateEntryLanguage: (
      state,
      action: PayloadAction<{
        sectionId: string
        langId: string
        field: string
        value: string | number
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.languages) {
        const language = section.content.languages.find((l) => l.id === action.payload.langId)
        if (language) {
          ; (language as any)[action.payload.field] = action.payload.value
        }
      }
    },

    removeEntryLanguage: (
      state,
      action: PayloadAction<{
        sectionId: string
        langId: string
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.languages) {
        section.content.languages = section.content.languages.filter((lang) => lang.id !== action.payload.langId)
      }
    },

    toggleEntryVisibility_Language: (
      state,
      action: PayloadAction<{
        sectionId: string
        entryId: string
        field: string
        value: boolean
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.languages) {
        const language = section.content.languages.find((l) => l.id === action.payload.entryId)
        if (language && language.visibility) {
          (language.visibility as any)[action.payload.field] = action.payload.value
        }
      }
    },

    // Achievements actions
    addAchievement: (
      state,
      action: PayloadAction<{
        sectionId: string
        achievement: AchievementSectionItem
      }>
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section) {
        if (!section.content.achievements) {
          section.content.achievements = []
        }
        section.content.achievements.push(action.payload.achievement)
      }
    },

    updateAchievement: (
      state,
      action: PayloadAction<{
        sectionId: string
        achievementId: string
        field: keyof AchievementSectionItem
        value: string
      }>
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section?.content.achievements) {
        const achievement = section.content.achievements.find((a) => a.id === action.payload.achievementId)
        if (achievement) {
          (achievement as any)[action.payload.field] = action.payload.value
        }
      }
    },

    removeAchievement: (
      state,
      action: PayloadAction<{
        sectionId: string
        achievementId: string
      }>
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section?.content.achievements) {
        section.content.achievements = section.content.achievements.filter(
          (a) => a.id !== action.payload.achievementId
        )
      }
    },

    toggleEntryVisibility_Achievement: (
      state,
      action: PayloadAction<{
        sectionId: string
        entryId: string
        field: string
        value: boolean
      }>
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section?.content.achievements) {
        const achievement = section.content.achievements.find((a) => a.id === action.payload.entryId)
        if (achievement?.visibility) {
          (achievement.visibility as any)[action.payload.field] = action.payload.value
        }
      }
    }
  },
})

export const {
  updateHeaderField,
  toggleHeaderFieldVisibility,
  toggleUppercaseName,
  togglePhotoStyle,
  uploadProfilePhoto,
  upsertActiveSection,
  addSection,
  removeSection,
  removeSectionEntry,
  updateSectionTitle,
  updateSectionContent,
  reorderSections,
  updateSectionColumn,
  addEntryEducation,
  updateEntryEducation,
  removeEntryEducation,
  toggleEntryVisibility_Education,
  addEntryProject,
  updateEntryProject,
  removeEntryProject,
  toggleEntryVisibility_Project,
  addEntrySkillGroup,
  updateEntrySkillGroup,
  removeEntrySkillGroup,
  setActiveSkillData,
  addEntrySkill,
  updateEntrySkill,
  removeEntrySkill,
  toggleEntryVisibility_SkillsContent,
  addEntryLanguage,
  updateEntryLanguage,
  removeEntryLanguage,
  toggleEntryVisibility_Language,
  addAchievement,
  updateAchievement,
  removeAchievement,
  toggleEntryVisibility_Achievement,
  undo,
  redo,
} = resumeSlice.actions

export default resumeSlice.reducer
