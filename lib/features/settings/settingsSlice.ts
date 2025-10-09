import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { SettingsState } from "@/lib/types"

const initialState: SettingsState = {
    branding: true,
    theme: "light",
    fontSize: 1,
    fontFamily: "Inter",
    template: "double-column",
    editorZoom: 1.3,
    pageMargins: 36, // px padding around page
    sectionSpacing: 24, // px between sections
    lineHeight: 1.4,
    primaryColor: "#14b8a6", // teal-500
    headingColor: "#3e3e3e",
    leftSidebarBgColor: "#22405c",
    pageBackgroundColor: "#ffffff",
    pageBackgroundMode: 'solid',
    pageBackgroundPattern: "none",
    pageBackgroundGradientTo: "#f5f5f5",
    pageBackgroundGradientAngle: 180,
    overlayEnabled: false,
    overlayImage: null,
    overlayOpacity: 0.2,
    overlayScale: 1,
    overlayX: 85,
    overlayY: 15,
    overlayPositioning: false,
    showDesignPanel: false,
    showTemplatesModal: false,
    showAddSectionModal: false,
    addSectionColumn: "left",
    currentCvId: null,
    showHistoryModal: false,
}

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        resetDesignToDefaults: (state) => {
            state.fontSize = 1
            state.fontFamily = "Inter"
            state.lineHeight = 1.4
            state.primaryColor = "#14b8a6"
            state.headingColor = "#3e3e3e"
            state.leftSidebarBgColor = "#22405c"
            state.pageMargins = 36
            state.sectionSpacing = 24
            state.pageBackgroundColor = "#ffffff"
            state.pageBackgroundMode = 'solid'
            state.pageBackgroundPattern = "none"
            state.pageBackgroundGradientTo = "#f5f5f5"
            state.pageBackgroundGradientAngle = 180
            state.overlayEnabled = false
            state.overlayImage = null
            state.overlayOpacity = 0.2
            state.overlayScale = 1
            state.overlayX = 85
            state.overlayY = 15
        },
        setLeftSidebarBgColor: (state, action: PayloadAction<string>) => {
            state.leftSidebarBgColor = action.payload
        },
        hydrateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
            const incoming = action.payload
            // Preserve UI-only flags and currentCvId unless explicitly provided
            const {
                showDesignPanel,
                showTemplatesModal,
                showAddSectionModal,
                addSectionColumn,
                overlayPositioning,
                currentCvId,
                showHistoryModal,
                ...rest
            } = incoming as any
            Object.assign(state, rest)
            if (typeof currentCvId !== 'undefined') state.currentCvId = currentCvId
            // keep current runtime UI state otherwise
        },
        toggleBranding: (state) => {
            state.branding = !state.branding
        },

        setTheme: (state, action: PayloadAction<"light" | "dark">) => {
            state.theme = action.payload
        },

        setFontSize: (state, action: PayloadAction<number>) => {
            state.fontSize = action.payload
        },

        setFontFamily: (state, action: PayloadAction<string>) => {
            state.fontFamily = action.payload
        },

        setTemplate: (state, action: PayloadAction<{ template: string }>) => {
            state.template = action.payload.template
        },

        setEditorZoom: (state, action: PayloadAction<number>) => {
            // clamp between 0.5x and 2.0x
            const z = Math.max(0.5, Math.min(2, action.payload))
            state.editorZoom = z
        },

        setPageMargins: (state, action: PayloadAction<number>) => {
            // clamp sensible bounds
            const px = Math.max(12, Math.min(64, action.payload))
            state.pageMargins = px
        },

        setSectionSpacing: (state, action: PayloadAction<number>) => {
            const px = Math.max(8, Math.min(48, action.payload))
            state.sectionSpacing = px
        },

        setLineHeight: (state, action: PayloadAction<number>) => {
            const lh = Math.max(1, Math.min(2, action.payload))
            state.lineHeight = lh
        },

        setPrimaryColor: (state, action: PayloadAction<string>) => {
            state.primaryColor = action.payload
        },

        setHeadingColor: (state, action: PayloadAction<string>) => {
            state.headingColor = action.payload
        },

        setPageBackgroundColor: (state, action: PayloadAction<string>) => {
            state.pageBackgroundColor = action.payload
        },

        setPageBackgroundPattern: (state, action: PayloadAction<"none" | "dots" | "diagonal-stripes" | "grid" | "crosshatch">) => {
            state.pageBackgroundPattern = action.payload
        },

        setPageBackgroundMode: (state, action: PayloadAction<'solid' | 'pattern' | 'gradient'>) => {
            state.pageBackgroundMode = action.payload
        },

        setPageBackgroundGradientTo: (state, action: PayloadAction<string>) => {
            state.pageBackgroundGradientTo = action.payload
        },

        setPageBackgroundGradientAngle: (state, action: PayloadAction<number>) => {
            const a = Math.max(0, Math.min(360, action.payload))
            state.pageBackgroundGradientAngle = a
        },

        setDesignPanel: (state, action: PayloadAction<boolean>) => {
            state.showDesignPanel = action.payload
        },

        setTemplatesModal: (state, action: PayloadAction<boolean>) => {
            state.showTemplatesModal = action.payload
        },

        setAddSectionModal: (state, action: PayloadAction<{ isOpen: boolean; column?: "left" | "right" }>) => {
            state.showAddSectionModal = action.payload.isOpen
            if (action.payload.column) {
                state.addSectionColumn = action.payload.column
            }
        },

        setOverlayEnabled: (state, action: PayloadAction<boolean>) => {
            state.overlayEnabled = action.payload
        },
        setOverlayImage: (state, action: PayloadAction<string | null>) => {
            state.overlayImage = action.payload
        },
        setOverlayOpacity: (state, action: PayloadAction<number>) => {
            const v = Math.max(0, Math.min(1, action.payload))
            state.overlayOpacity = v
        },
        setOverlayScale: (state, action: PayloadAction<number>) => {
            const v = Math.max(0.25, Math.min(4, action.payload))
            state.overlayScale = v
        },
        setOverlayPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
            const x = Math.max(0, Math.min(100, action.payload.x))
            const y = Math.max(0, Math.min(100, action.payload.y))
            state.overlayX = x
            state.overlayY = y
        },
        setOverlayPositioning: (state, action: PayloadAction<boolean>) => {
            state.overlayPositioning = action.payload
        },

        setCurrentCvId: (state, action: PayloadAction<string | null>) => {
            state.currentCvId = action.payload
        },
        setShowHistoryModal: (state, action: PayloadAction<boolean>) => {
            state.showHistoryModal = action.payload
        },
    },
})

export const {
    toggleBranding,
    setTheme,
    setFontSize,
    setFontFamily,
    setTemplate,
    setEditorZoom,
    setPageMargins,
    setSectionSpacing,
    setLineHeight,
    setPrimaryColor,
    setHeadingColor,
    setPageBackgroundColor,
    setPageBackgroundPattern,
    setPageBackgroundMode,
    setPageBackgroundGradientTo,
    setPageBackgroundGradientAngle,
    setDesignPanel,
    setTemplatesModal,
    setAddSectionModal,
    setOverlayEnabled,
    setOverlayImage,
    setOverlayOpacity,
    setOverlayScale,
    setOverlayPosition,
    setOverlayPositioning,
    setCurrentCvId,
    setShowHistoryModal,
    setLeftSidebarBgColor,
    hydrateSettings,
    resetDesignToDefaults,
} = settingsSlice.actions

export default settingsSlice.reducer
