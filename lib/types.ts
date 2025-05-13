export interface FieldVisibility {
  title?: boolean
  subtitle?: boolean
  dateRange?: boolean
  location?: boolean
  description?: boolean
  bullets?: boolean
  link?: boolean
  logo?: boolean
}

export interface Entry {
  id: string
  title: string
  subtitle: string
  dateRange: string
  location: string
  description: string
  bullets: string[]
  visibility: FieldVisibility
}

export interface Section {
  id: string
  type: "text" | "entries"
  content: {
    title: string
    text?: string
    entries?: Entry[]
  }
}

export interface ResumeState {
  sections: Section[]
  activeSectionId: string | null
}

export interface SettingsState {
  branding: boolean
  theme: "light" | "dark"
  fontSize: number
  fontFamily: string
}

export interface RootState {
  resume: ResumeState
  settings: SettingsState
}
