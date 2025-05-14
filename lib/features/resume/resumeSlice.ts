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
      id: "section-summary",
      type: "text",
      content: {
        title: "SUMMARY",
        text: "Briefly explain why you're a great fit for the role - use the AI assistant to tailor this summary for each job posting.",
      },
    },
    {
      id: "section-education",
      type: "entries",
      content: {
        title: "EDUCATION",
        entries: [
          {
            id: "entry-1",
            title: "Degree and Field of Study",
            subtitle: "School or University",
            dateRange: "Date period",
            location: "Location",
            description: "",
            bullets: [],
            visibility: {
              title: true,
              subtitle: true,
              dateRange: true,
              location: true,
              description: true,
              bullets: true,
              link: false,
              logo: false,
            },
          },
        ],
      },
    },
    {
      id: "section-experience",
      type: "entries",
      content: {
        title: "EXPERIENCE",
        entries: [
          {
            id: "entry-2",
            title: "Title",
            subtitle: "Company Name",
            dateRange: "Date period",
            location: "Location",
            description: "Company Description",
            bullets: ["Highlight your accomplishments, using numbers if possible."],
            visibility: {
              title: true,
              subtitle: true,
              dateRange: true,
              location: true,
              description: true,
              bullets: true,
              link: false,
              logo: false,
            },
          },
        ],
      },
    },
  ],
  activeSectionId: null,
}

export const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    // Header actions
    updateHeaderField: (
      state,
      action: PayloadAction<{
        field: string
        value: string
      }>,
    ) => {
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
      const { field, value } = action.payload
      state.header.visibility[field as keyof typeof state.header.visibility] = value
    },

    toggleUppercaseName: (
      state,
      action: PayloadAction<{
        value: boolean
      }>,
    ) => {
      state.header.uppercaseName = action.payload.value
    },

    togglePhotoStyle: (
      state,
      action: PayloadAction<{
        value: boolean
      }>,
    ) => {
      state.header.roundPhoto = action.payload.value
    },

    uploadProfilePhoto: (
      state,
      action: PayloadAction<{
        photoUrl: string
      }>,
    ) => {
      state.header.photoUrl = action.payload.photoUrl
    },

    // Section actions
    setActiveSection: (state, action: PayloadAction<{ sectionId: string | null }>) => {
      state.activeSectionId = action.payload.sectionId
    },

    addSection: (state, action: PayloadAction<Section>) => {
      state.sections.push(action.payload)
      state.activeSectionId = action.payload.id
    },

    removeSection: (state, action: PayloadAction<{ sectionId: string }>) => {
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
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section) {
        section.content = action.payload.content
      }
    },

    reorderSections: (state, action: PayloadAction<{ sections: Section[] }>) => {
      state.sections = action.payload.sections
    },

    // Entry actions
    addEntry: (
      state,
      action: PayloadAction<{
        sectionId: string
        entry: Entry
      }>,
    ) => {
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.entries) {
        section.content.entries.push(action.payload.entry)
      }
    },

    removeEntry: (
      state,
      action: PayloadAction<{
        sectionId: string
        entryId: string
      }>,
    ) => {
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
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.skills) {
        section.content.skills.push(action.payload.skillGroup)
      }
    },

    updateSkillGroup: (
      state,
      action: PayloadAction<{
        sectionId: string
        groupId: string
        field: string
        value: string | string[]
      }>,
    ) => {
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.skills) {
        const group = section.content.skills.find((g) => g.id === action.payload.groupId)
        if (group) {
          ; (group as any)[action.payload.field] = action.payload.value
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
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.skills) {
        const group = section.content.skills.find((g) => g.id === action.payload.groupId)
        if (group) {
          group.items.push(action.payload.skill)
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
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.skills) {
        const group = section.content.skills.find((g) => g.id === action.payload.groupId)
        if (group) {
          group.items.splice(action.payload.skillIndex, 1)
        }
      }
    },

    // Languages actions
    addLanguage: (
      state,
      action: PayloadAction<{
        sectionId: string
        language: Language
      }>,
    ) => {
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.languages) {
        section.content.languages.push(action.payload.language)
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
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.languages) {
        section.content.languages = section.content.languages.filter((lang) => lang.id !== action.payload.langId)
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
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.achievements) {
        section.content.achievements.push(action.payload.achievement)
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
      const section = state.sections.find((s) => s.id === action.payload.sectionId)
      if (section && section.content.items) {
        section.content.items.push(action.payload.item)
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
  addAchievement,
  updateAchievement,
  removeAchievement,
  addCustomItem,
  updateCustomItem,
  removeCustomItem,
  toggleCustomItemFeatured,
} = resumeSlice.actions

export default resumeSlice.reducer
