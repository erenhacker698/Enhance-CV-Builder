"use client"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import ResumeBuilder from "@/components/resume-builder"
import Header from "@/components/header"
import AddSectionModal from "@/components/add-section-modal"
import TemplatesModal from "@/components/templates-modal"

export default function Home() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
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
