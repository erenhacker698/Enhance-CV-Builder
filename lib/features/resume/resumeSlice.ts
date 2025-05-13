import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ResumeState, Section, Entry, FieldVisibility } from "@/lib/types"

const initialState: ResumeState = {
  sections: [
    {
      id: "section-header",
      type: "text",
      content: {
        title: "OM SHARMA",
        text: "Software Clerk",
      },
    },
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
          ;(entry as any)[action.payload.field] = action.payload.value
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
  },
})

export const {
  setActiveSection,
  addSection,
  removeSection,
  updateSectionContent,
  reorderSections,
  addEntry,
  removeEntry,
  updateEntry,
  toggleFieldVisibility,
} = resumeSlice.actions

export default resumeSlice.reducer
