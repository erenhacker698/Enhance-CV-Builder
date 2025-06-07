"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import type { RootState } from "@/lib/store"

interface PDFExportButtonProps {
    resumeRef: React.RefObject<HTMLDivElement>
}

// This is from where I resolved the v4 tailwind related error:
// Error: Attempting to parse an unsupported color function "oklch"
// Ref: https://github.com/niklasvh/html2canvas/issues/2700

export default function PDFExportButton({ resumeRef }: PDFExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false)
    const { header } = useSelector((state: RootState) => state.resume)

    const handleExport = async () => {
        if (!resumeRef.current) return

        setIsExporting(true)

        try {
            // Create a clone of the resume element to modify for PDF export
            const resumeElement = resumeRef.current
            const clone = resumeElement.cloneNode(true) as HTMLElement

            // Apply some styling for better PDF output
            clone.style.width = "794px" // A4 width in pixels at 96 DPI
            clone.style.height = "1123px" // A4 height in pixels at 96 DPI
            clone.style.padding = "40px"
            clone.style.position = "absolute"
            clone.style.top = "-9999px"
            clone.style.left = "-9999px"


            // Remove any buttons or interactive elements
            const buttons = clone.querySelectorAll("button")
            buttons.forEach((button) => button.remove())

            // Remove any hover effects or unnecessary styling
            const hoverElements = clone.querySelectorAll(".group, .hover\\:bg-gray-50")
            hoverElements.forEach((el) => {
                if (el instanceof HTMLElement) {
                    el.classList.remove("group", "hover:bg-gray-50")
                }
            })

            // Convert problematic color functions to simple RGB
            // This is a workaround for the "oklch" color function issue
            const elementsWithColor = clone.querySelectorAll("*")
            elementsWithColor.forEach((el) => {
                if (el instanceof HTMLElement) {
                    // Replace any oklch colors with a safe fallback
                    if (el.style.color && el.style.color.includes("oklch")) {
                        el.style.color = "#000000"
                    }
                    if (el.style.backgroundColor && el.style.backgroundColor.includes("oklch")) {
                        el.style.backgroundColor = "#ffffff"
                    }
                    if (el.style.borderColor && el.style.borderColor.includes("oklch")) {
                        el.style.borderColor = "#cccccc"
                    }
                }
            })

            // Add the clone to the document body temporarily
            document.body.appendChild(clone)

            // Generate canvas from the clone
            const canvas = await html2canvas(clone, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
            })

            // Remove the clone from the DOM
            document.body.removeChild(clone)

            // Create PDF
            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            })

            // Calculate dimensions
            const imgWidth = 210 // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

            // Generate filename from header name or use default
            const fileName = header.name ? `${header.name.toLowerCase().replace(/\s+/g, "_")}_resume.pdf` : "resume.pdf"

            // Download PDF
            pdf.save(fileName)
        } catch (error) {
            console.error("Error generating PDF:", error)
            alert("There was an error generating your PDF. Please try again.")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <Button onClick={handleExport} disabled={isExporting} className="w-full flex items-center justify-center md:justify-start text-sm font-normal cursor-pointer text-[#384347] hover:text-[#5f4dc7]" variant="ghost">
            {isExporting ? (
                <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    <div className="hidden md:block">
                        Generating PDF...
                    </div>
                </>
            ) : (
                <>
                    <Download size={16} className="mr-2" />
                    <div className="hidden md:block">
                        Export as PDF
                    </div>
                </>
            )}
        </Button>
    )
}
