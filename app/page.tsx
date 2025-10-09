"use client"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import ResumeBuilder from "@/components/resume-builder"
import Header from "@/components/Common/Header/header"
import AddSectionModal from "@/components/Common/Dialogs/add-section-modal"
import TemplatesModal from "@/components/Common/Dialogs/templates-modal"
import HistoryModal from "@/components/Common/Dialogs/history-modal"

export default function Home() {
  return (
    <Provider store={store}>
      <div className="min-h-screen">
        <Header />
        <main className="w-full max-w-none mx-auto py-6 px-1 md:pl-[328px] md:pr-[396px]">
          <ResumeBuilder />
        </main>
        <AddSectionModal />
        <TemplatesModal />
        <HistoryModal />
      </div>
    </Provider>
  )
}
