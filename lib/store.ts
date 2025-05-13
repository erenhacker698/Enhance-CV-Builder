import { configureStore } from "@reduxjs/toolkit"
import resumeReducer from "@/lib/features/resume/resumeSlice"
import settingsReducer from "@/lib/features/settings/settingsSlice"

export const store = configureStore({
    reducer: {
        resume: resumeReducer,
        settings: settingsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
