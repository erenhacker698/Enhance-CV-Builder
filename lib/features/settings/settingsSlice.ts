import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { SettingsState } from "@/lib/types"

const initialState: SettingsState = {
    branding: true,
    theme: "light",
    fontSize: 1,
    fontFamily: "Inter",
    template: "standard",
}

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
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
    },
})

export const { toggleBranding, setTheme, setFontSize, setFontFamily, setTemplate } = settingsSlice.actions

export default settingsSlice.reducer
