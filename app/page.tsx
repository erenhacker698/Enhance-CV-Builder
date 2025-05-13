"use client"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import ResumeBuilder from "@/components/resume-builder"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <ResumeBuilder />
        </main>
        <Footer />
      </div>
    </Provider>
  )
}
