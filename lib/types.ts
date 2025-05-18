export interface FieldVisibility {
  title?: boolean
  subtitle?: boolean
  dateRange?: boolean
  location?: boolean
  description?: boolean
  bullets?: boolean
  link?: boolean
  linkUrl?: boolean
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
  imageUrl?: string
  linkUrl?: string
  subtitle: string
  dateRange: string
  location: string
  description: string
  bullets: string[]
  visibility: FieldVisibility
}

export interface Language {
  id: string
  name: string
  level: string
  proficiency: number // 1-5
  visibility: LanguageVisibility
}

export interface LanguageVisibility {
  proficiency: boolean
  slider: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  bullets: string[]
  location: string
  period: string
  link: string
  visibility: ProjectVisibility
}

export interface ProjectVisibility {
  description: boolean
  bullets: boolean
  location: boolean
  period: boolean
  link: boolean
}

export interface SkillGroup {
  id: string
  name: string
  skills: string[]
  visibility: SkillVisibility
}

export interface SkillVisibility {
  groupName: boolean
  compactMode: boolean
  borderStyle: "all" | "bottom"
}

export interface Education {
  id: string
  name: string
  gpa:string
  period: string
  location: string
  bullets: string[]
  logo: string
  visibility: EducationVisibility
}

export interface EducationVisibility {
  description: boolean
  bullets: boolean
  location: boolean
  period: boolean
  link: boolean
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

export enum SectionTypeEnum {
  TEXT = "text",
  ENTRIES = "entries",
  EDUCATION = "education",
  EXPERIENCE = "experience",
  SKILLS = "skills",
  LANGUAGES = "languages",
  PROJECTS = "projects",
  ACHIEVEMENTS = "achievements",
  CUSTOM = "custom",
}

export type SectionType =
  | "text"
  | "entries"
  | "education"
  | "experience"
  | "skills"
  | "languages"
  | "projects"
  | "achievements"
  | "custom";

export interface BaseSection {
  id: string;
  type: SectionType
  column: "left" | "right"
  content: SectionContent
}

export type SectionContent =
  | TextContent
  | EntriesContent
  | SkillsContent
  | LanguagesContent
  | AchievementsContent
  | CustomContent

export interface TextContent {
  type: SectionTypeEnum.TEXT;
  title: string;
  text: string;
}

export interface SkillsContent {
  type: SectionTypeEnum.SKILLS;
  title: string;
  skills: string[]
}

export interface LanguagesContent {
  type: SectionTypeEnum.LANGUAGES;
  title: string;
  languages: string[];
}

export interface AchievementsContent {
  type: SectionTypeEnum.ACHIEVEMENTS;
  title: string;
  achievements: string[];
}

export interface CustomContent {
  type: "custom";
  title: string;
  customData: unknown;
}

export interface EntriesContent {
  type: SectionTypeEnum.EXPERIENCE | SectionTypeEnum.EDUCATION | SectionTypeEnum.SKILLS | SectionTypeEnum.PROJECTS | SectionTypeEnum.LANGUAGES;
  title: string;
  entries: Entry[]
}

export interface Section {
  id: string
  type: SectionType
  column: "left" | "right"
  content: {
    title: string
    text?: string
    entries?: Entry[]
    skillGroups?: SkillGroup[]
    projects?: Project[]
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
  showTemplatesModal: boolean
  showAddSectionModal: boolean
  addSectionColumn: "left" | "right"
}

export interface RootState {
  resume: ResumeState
  settings: SettingsState
}
