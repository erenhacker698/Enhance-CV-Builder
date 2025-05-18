import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type {
  ResumeState,
  Section,
  Entry,
  FieldVisibility,
  SkillGroup,
  Language,
  Achievement,
  CustomItem,
} from "@/lib/types"

const initialState: ResumeState = {
  header: {
    name: "OM SHARMA",
    title: "Software Clerk",
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
      type: "entries",
      column: "left",
      content: {
        title: "EDUCATION",
        entries: [
          {
            id: "entry-1",
            degreeField: "Degree and Field of Study",
            schoolName: "School or University",
            logo: "/placeholder.svg",
            dateRange: "Date period",
            location: "Location",
            gpa: "",
            bullets: [],
            visibility: {
              degreeField: true,
              schoolName: true,
              logo: false,
              dateRange: true,
              location: false,
              gpa: false,
              bullets: false,
            },
          },
        ],
      },
    },
    {
      id: "section-skills",
      type: "skills",
      column: "right",
      content: {
        title: "SKILLS",
        skillGroups: [
          {
            id: "group-1",
            name: "Technical Skills",
            groupName:"",
            skills: ["HTML", "CSS", "JavaScript", "React"],
            borderStyle:  "All" | "Bottom",
            visibility: {
              name: true,
              groupName: true,
              compactMode: false,
              borderStyle: "All",
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
  if (state.history.past.length > 30) {
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

    // Entry actions
    addEntry: (
      state,
      action: PayloadAction<{
        sectionId: string
        entry: Entry
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.entries) {
        section.content.entries.push(action.payload.entry)
      } else if (section) {
        section.content.entries = [action.payload.entry]
      }
    },

    removeEntry: (
      state,
      action: PayloadAction<{
        sectionId: string
        entryId: string
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.entries) {
        section.content.entries = section.content.entries.filter((entry) => entry.id !== action.payload.entryId)
      }
    },

    updateEntry: (
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
      if (section && section.content.entries) {
        const entry = section.content.entries.find((e) => e.id === action.payload.entryId)
        if (entry) {
          ; (entry as any)[action.payload.field] = action.payload.value
        }
      }
    },

    toggleFieldVisibility: (
      state,
      action: PayloadAction<{
        sectionId: string
        entryId: string
        field: keyof FieldVisibility
        value: boolean
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.entries) {
        const entry = section.content.entries.find((e) => e.id === action.payload.entryId)
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
        skillGroup: SkillGroup
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.skillGroups) {
        section.content.skillGroups.push(action.payload.skillGroup)
      } else if (section) {
        section.content.skillGroups = [action.payload.skillGroup]
      }
    },

    updateSkillGroup: (
      state,
      action: PayloadAction<{
        sectionId: string
        groupId: string
        name: string
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.skillGroups) {
        const group = section.content.skillGroups.find((g) => g.id === action.payload.groupId)
        if (group) {
          group.name = action.payload.name
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
      if (section && section.content.skillGroups) {
        section.content.skillGroups = section.content.skillGroups.filter((group) => group.id !== action.payload.groupId)
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
      if (section && section.content.skillGroups) {
        const group = section.content.skillGroups.find((g) => g.id === action.payload.groupId)
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
      if (section && section.content.skillGroups) {
        const group = section.content.skillGroups.find((g) => g.id === action.payload.groupId)
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
        language: Language
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
          ; (language.visibility as any)[action.payload.field] = action.payload.value
        }
      }
    },

    toggleSliderStyle: (
      state,
      action: PayloadAction<{
        sectionId: string
        langId: string
        value: number
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.languages) {
        const language = section.content.languages.find((l) => l.id === action.payload.langId)
        if (language) {
          language.sliderStyle = action.payload.value
        }
      }
    },

    // Achievements actions
    addAchievement: (
      state,
      action: PayloadAction<{
        sectionId: string
        achievement: Achievement
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.achievements) {
        section.content.achievements.push(action.payload.achievement)
      } else if (section) {
        section.content.achievements = [action.payload.achievement]
      }
    },

    updateAchievement: (
      state,
      action: PayloadAction<{
        sectionId: string
        achievementId: string
        field: string
        value: string
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.achievements) {
        const achievement = section.content.achievements.find((a) => a.id === action.payload.achievementId)
        if (achievement) {
          ; (achievement as any)[action.payload.field] = action.payload.value
        }
      }
    },

    removeAchievement: (
      state,
      action: PayloadAction<{
        sectionId: string
        achievementId: string
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.achievements) {
        section.content.achievements = section.content.achievements.filter(
          (achievement) => achievement.id !== action.payload.achievementId,
        )
      }
    },

    // Custom items actions
    addCustomItem: (
      state,
      action: PayloadAction<{
        sectionId: string
        item: CustomItem
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.items) {
        section.content.items.push(action.payload.item)
      } else if (section) {
        section.content.items = [action.payload.item]
      }
    },

    updateCustomItem: (
      state,
      action: PayloadAction<{
        sectionId: string
        itemId: string
        field: string
        value: string
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.items) {
        const item = section.content.items.find((i) => i.id === action.payload.itemId)
        if (item) {
          ; (item as any)[action.payload.field] = action.payload.value
        }
      }
    },

    removeCustomItem: (
      state,
      action: PayloadAction<{
        sectionId: string
        itemId: string
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.items) {
        section.content.items = section.content.items.filter((item) => item.id !== action.payload.itemId)
      }
    },

    toggleCustomItemFeatured: (
      state,
      action: PayloadAction<{
        sectionId: string
        itemId: string
      }>,
    ) => {
      saveToHistory(state)
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.items) {
        const item = section.content.items.find((i) => i.id === action.payload.itemId)
        if (item) {
          item.featured = !item.featured
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
  updateSectionContent,
  reorderSections,
  updateSectionColumn,
  addEntry,
  removeEntry,
  updateEntry,
  toggleFieldVisibility,
  addSkillGroup,
  updateSkillGroup,
  removeSkillGroup,
  addSkill,
  removeSkill,
  addLanguage,
  updateLanguage,
  removeLanguage,
  toggleLanguageVisibility,
  toggleSliderStyle,
  addAchievement,
  updateAchievement,
  removeAchievement,
  addCustomItem,
  updateCustomItem,
  removeCustomItem,
  toggleCustomItemFeatured,
  undo,
  redo,
} = resumeSlice.actions

export default resumeSlice.reducer
