export type TemplateKey = "double-column" | "elegant" | "left-sidebar"

export type TemplateDefaults = {
  baseFontSizeRem: number
  baseLineHeight: number
  pageMargins: number
  sectionSpacing: number
  headingColor: string
  sidebar?: {
    widthPx: number
    bgColor: string
    textColor: string
    position: "left" | "right"
  }
}

const DEFAULTS: Record<TemplateKey, TemplateDefaults> = {
  "double-column": {
    baseFontSizeRem: 1,
    baseLineHeight: 1.4,
    pageMargins: 36,
    sectionSpacing: 24,
    headingColor: "#3e3e3e",
  },
  elegant: {
    baseFontSizeRem: 1,
    baseLineHeight: 1.4,
    pageMargins: 12, // tighter margins by design
    sectionSpacing: 22, // slightly tighter spacing
    headingColor: "#3e3e3e",
    sidebar: {
      widthPx: 220,
      bgColor: "#22405c",
      textColor: "#ffffff",
      position: "right",
    },
  },
  "left-sidebar": {
    baseFontSizeRem: 1,
    baseLineHeight: 1.4,
    pageMargins: 36,
    sectionSpacing: 24,
    headingColor: "#3e3e3e",
    sidebar: {
      widthPx: 240,
      bgColor: "#22405c",
      textColor: "#ffffff",
      position: "left",
    },
  },
}

export function getTemplateDefaults(key: TemplateKey): TemplateDefaults {
  return DEFAULTS[key]
}
