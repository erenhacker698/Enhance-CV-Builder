import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import {
  EducationContentVisibility,
  EducationSectionItem,
  LanguageSectionItem,
  ProjectContentVisibility,
  ProjectSectionItem,
  SectionContentMap,
  SectionTypeEnum,
  SkillSectionItem,
  type ResumeState,
  type Section,
} from "@/lib/types"

const initialState: ResumeState = {
  header: {
    name: "OM SHARMA",
    title: "Software Developer",
    phone: "123-456-7890",
    email: "om.sharma@example.com",
    link: "linkedin.com/in/omsharma",
    extraLink: "github.com/omsharma",
    location: "San Francisco, CA",
    extraField: "Available for hire",
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
      title: "",
      content: {
        educations: [
          {
            id: "entry-1",
            degree: "Degree and Field of Study",
            school: "School or University",
            gpa: "",
            location: "",
            period: "",
            bullets: [],
            logo: "/placeholder.svg",
            visibility: {
              gpa: true,
              location: true,
              period: true,
              bullets: true,
              logo: true,
            },
          },
        ],
      },
    },
    {
      id: "section-skills",
      type: SectionTypeEnum.SKILLS,
      column: "right",
      title: "SKILLS",
      content: {
        skills: [
          {
            id: "group-1",
            groupName: "Technical Skills",
            skills: ["HTML", "CSS", "JavaScript", "React"],
            compactMode: false,
            borderStyle: "all",
            visibility: {
              groupName: true,
              compactMode: false,
            },
          },
        ],
      },
    },
  ],
  activeSectionId: null,
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

    // Section actions
    setActiveSection: (state, action: PayloadAction<{ sectionId: string | null }>) => {
      state.activeSectionId = action.payload.sectionId
    },

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
      state.activeSectionId = newSection.id
    },

    removeSection: (state, action: PayloadAction<{ sectionId: string }>) => {
      saveToHistory(state)
      state.sections = state.sections.filter((section) => section.id !== action.payload.sectionId)
      if (state.activeSectionId === action.payload.sectionId) {
        state.activeSectionId = null
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
    addEducation: (
      state,
      action: PayloadAction<{
        sectionId: string
        education: EducationSectionItem
      }>,
    ) => {
      saveToHistory(state)
      // console.log("action.payload.sectionId= ", action.payload.sectionId)
      // console.log("action.payload.education= ", action.payload.education)
      // console.log("state.sections chck= ",JSON.parse(JSON.stringify(state.sections)))
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      // console.log("section chck= ", JSON.parse(JSON.stringify(section)))
      if (section && section.content.educations) {
        section.content.educations.push(action.payload.education)
        // console.log("this1")
      } else if (section) {
        section.content.educations = [action.payload.education]
        // console.log("this2")
      }
      // console.log("state.sections chck2= ",JSON.parse(JSON.stringify(state.sections)))
    },

    removeEducation: (
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

    updateEducation: (
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
      // console.log("action.payload.sectionId= ", action.payload.sectionId)
      // console.log("action.payload.entryId= ", action.payload.entryId)
      // console.log("state.sections chck= ", JSON.parse(JSON.stringify(state.sections)))
      if (section && section.content.educations) {
        const entry = section.content.educations.find((e) => e.id === action.payload.entryId)
        // console.log("entry= ", entry)
        if (entry) {
          (entry as any)[action.payload.field] = action.payload.value
        }
      }
    },

    toggleEducationContentVisibility: (
      state,
      action: PayloadAction<{
        sectionId: string
        entryId: string
        field: keyof EducationContentVisibility
        value: boolean
      }>,
    ) => {
      saveToHistory(state)
      console.log("action.payload.sectionId= ", action.payload.sectionId)
      console.log("action.payload.entryId= ", action.payload.entryId)
      console.log("action.payload.field= ", action.payload.field)
      console.log("action.payload.value= ", action.payload.value)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      console.log("section chck= ", JSON.parse(JSON.stringify(section)))
      if (section && section.content.educations) {
        console.log("section.content.educations chck= ", JSON.parse(JSON.stringify(section)))
        const entry = section.content.educations.find((e) => e.id === action.payload.entryId)
        if (entry && entry.visibility) {
          console.log("entry= ", JSON.stringify(entry))
          entry.visibility[action.payload.field] = action.payload.value
        }
      }
    },

    // Project actions
    addProject: (
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

    removeProject: (
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

    updateProject: (
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

    toggleProjectContentVisibility: (
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
    addSkillGroup: (
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

    updateSkillGroup: (
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

    removeSkillGroup: (
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

    addSkill: (
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

    removeSkill: (
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

    // Language actions
    addLanguage: (
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

    updateLanguage: (
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

    removeLanguage: (
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

    toggleLanguageVisibility: (
      state,
      action: PayloadAction<{
        sectionId: string
        langId: string
        field: string
        value: boolean
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.languages) {
        const language = section.content.languages.find((l) => l.id === action.payload.langId)
        if (language && language.visibility) {
          (language.visibility as any)[action.payload.field] = action.payload.value
        }
      }
    },
  },
})

export const {
  updateHeaderField,
  toggleHeaderFieldVisibility,
  toggleUppercaseName,
  togglePhotoStyle,
  uploadProfilePhoto,
  setActiveSection,
  addSection,
  removeSection,
  removeSectionEntry,
  updateSectionTitle,
  updateSectionContent,
  reorderSections,
  updateSectionColumn,
  addEducation,
  updateEducation,
  removeEducation,
  toggleEducationContentVisibility,
  addProject,
  updateProject,
  removeProject,
  toggleProjectContentVisibility,
  addSkillGroup,
  updateSkillGroup,
  removeSkillGroup,
  addSkill,
  removeSkill,
  addLanguage,
  updateLanguage,
  removeLanguage,
  toggleLanguageVisibility,
  undo,
  redo,
} = resumeSlice.actions

export default resumeSlice.reducer
