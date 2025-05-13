"use client"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import Header from "@/components/header"

export default function Home() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto py-6 px-4">
          Hi
        </main>
      </div>
    </Provider>
  )
}
