"use client"

import type React from "react"

import { useState } from "react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import type { RootState } from "@/lib/store"

interface PDFExportButtonProps {
    resumeRef: React.RefObject<HTMLDivElement>
}

export default function PDFExportButton({ resumeRef }: PDFExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false)
    const { header } = useSelector((state: RootState) => state.resume)

    const handleExport = async () => {
        if (!resumeRef.current) return

        setIsExporting(true)

        try {
            const resumeElement = resumeRef.current
            const clone = resumeElement.cloneNode(true) as HTMLElement

            clone.style.width = "794px" // A4 width in pixels at 96 DPI
            clone.style.height = "1123px" // A4 height in pixels at 96 DPI
            clone.style.padding = "40px"
            clone.style.position = "absolute"
            clone.style.top = "-9999px"
            clone.style.left = "-9999px"
            document.body.appendChild(clone)

            const buttons = clone.querySelectorAll("button")
            buttons.forEach((button) => button.remove())

            const hoverElements = clone.querySelectorAll(".group, .hover\\:bg-gray-50")
            hoverElements.forEach((el) => {
                if (el instanceof HTMLElement) {
                    el.classList.remove("group", "hover:bg-gray-50")
                }
            })

            const canvas = await html2canvas(clone, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
            })

            document.body.removeChild(clone)

            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            })

            const imgWidth = 210 // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

            const fileName = header.name ? `${header.name.toLowerCase().replace(/\s+/g, "_")}_resume.pdf` : "resume.pdf"

            pdf.save(fileName)
        } catch (error) {
            console.error("Error generating PDF:", error)
            alert("There was an error generating your PDF. Please try again.")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <Button onClick={handleExport} disabled={isExporting} variant="ghost" className="w-full justify-start text-sm font-normal cursor-pointer">
            {isExporting ? (
                <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Generating PDF...
                </>
            ) : (
                <>
                    <Download size={16} className="mr-2" />
                    Download
                </>
            )}
        </Button>
    )
}
