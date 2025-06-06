"use client"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import ResumeBuilder from "@/components/resume-builder"
import Header from "@/components/Common/Header/header"
import AddSectionModal from "@/components/Common/Dialogs/add-section-modal"
import TemplatesModal from "@/components/Common/Dialogs/templates-modal"

export default function Home() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-[#fafbfd]">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <ResumeBuilder />
        </main>
        <AddSectionModal />
        <TemplatesModal />
      </div>
    </Provider>
  )
}
