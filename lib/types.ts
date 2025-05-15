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

export interface HeaderVisibility {
  title: boolean
  phone: boolean
  email: boolean
  link: boolean
  extraLink: boolean
  location: boolean
  photo: boolean
  extraField: boolean
}

export interface Header {
  name: string
  title: string
  phone: string
  email: string
  link: string
  extraLink: string
  location: string
  extraField: string
  photoUrl: string
  visibility: HeaderVisibility
  uppercaseName: boolean
  roundPhoto: boolean
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

export interface LanguageVisibility {
  proficiency: boolean
  slider: boolean
}

export interface Language {
  id: string
  name: string
  level: string
  proficiency: number // 1-5
  visibility: LanguageVisibility
  sliderStyle: number // 0-4 for different styles
}

export interface SkillGroup {
  id: string
  name: string
  skills: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
}

export interface CustomItem {
  id: string
  title: string
  dateRange: string
  description: string
  icon: string
  featured: boolean
}

export interface Section {
  id: string
  type: "text" | "entries" | "skills" | "languages" | "achievements" | "custom"
  column: "left" | "right"
  content: {
    title: string
    text?: string
    entries?: Entry[]
    skillGroups?: SkillGroup[]
    languages?: Language[]
    achievements?: Achievement[]
    items?: CustomItem[]
  }
}

export interface ResumeState {
  header: Header
  sections: Section[]
  activeSectionId: string | null
  history: {
    past: Array<{
      header: Header
      sections: Section[]
    }>
    future: Array<{
      header: Header
      sections: Section[]
    }>
  }
}

export interface SettingsState {
  branding: boolean
  theme: "light" | "dark"
  fontSize: number
  fontFamily: string
  template: string
}

export interface RootState {
  resume: ResumeState
  settings: SettingsState
}
