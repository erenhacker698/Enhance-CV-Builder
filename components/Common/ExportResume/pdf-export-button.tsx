"use client"

import type React from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import type { RootState } from "@/lib/store"

interface PDFExportButtonProps {
    resumeRef: React.RefObject<HTMLDivElement | null>
}

export default function PDFExportButton({ resumeRef }: PDFExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false)
    const { header } = useSelector((state: RootState) => state.resume)

    const capturePages = async (): Promise<{ dataUrl: string; width: number; height: number }[]> => {
        const container = resumeRef.current
        if (!container) return []

        const pages = Array.from(container.querySelectorAll('.resume-page')) as HTMLElement[]
        const results: { dataUrl: string; width: number; height: number }[] = []

        if (pages.length > 0) {
            for (const page of pages) {
                const clone = page.cloneNode(true) as HTMLElement
                clone.style.width = '794px'
                clone.style.height = '1123px'
                clone.style.position = 'absolute'
                clone.style.top = '-9999px'
                clone.style.left = '-9999px'
                const buttons = clone.querySelectorAll('button')
                buttons.forEach((b) => b.remove())
                document.body.appendChild(clone)
                const canvas = await html2canvas(clone, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff' })
                document.body.removeChild(clone)
                results.push({ dataUrl: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height })
            }
            return results
        }

        const clone = container.cloneNode(true) as HTMLElement
        clone.style.width = '794px'
        clone.style.position = 'absolute'
        clone.style.top = '-9999px'
        clone.style.left = '-9999px'
        const buttons = clone.querySelectorAll('button')
        buttons.forEach((b) => b.remove())
        document.body.appendChild(clone)
        const canvas = await html2canvas(clone, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff' })
        document.body.removeChild(clone)
        const pageHeightPx = Math.round((1123 / 794) * canvas.width)
        const totalPages = Math.ceil(canvas.height / pageHeightPx)
        for (let i = 0; i < totalPages; i++) {
            const sliceCanvas = document.createElement('canvas')
            const sliceHeight = Math.min(pageHeightPx, canvas.height - i * pageHeightPx)
            sliceCanvas.width = canvas.width
            sliceCanvas.height = sliceHeight
            const ctx = sliceCanvas.getContext('2d')!
            ctx.drawImage(canvas, 0, i * pageHeightPx, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight)
            results.push({ dataUrl: sliceCanvas.toDataURL('image/png'), width: sliceCanvas.width, height: sliceCanvas.height })
        }
        return results
    }

    const handleExportPDF = async () => {
        if (!resumeRef.current) return
        setIsExporting(true)
        try {
            const captures = await capturePages()
            if (!captures.length) return
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
            const imgWidth = 210
            captures.forEach((c, i) => {
                const imgHeight = (c.height * imgWidth) / c.width
                if (i > 0) pdf.addPage()
                pdf.addImage(c.dataUrl, 'PNG', 0, 0, imgWidth, imgHeight)
            })
            const fileName = header.name ? `${header.name.toLowerCase().replace(/\s+/g, '_')}_resume.pdf` : 'resume.pdf'
            pdf.save(fileName)
        } catch (e) {
            console.error('Error generating PDF', e)
            alert('There was an error generating your PDF. Please try again.')
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="relative">
            <Button onClick={handleExportPDF} disabled={isExporting} className="w-full flex items-center justify-center md:justify-start text-sm font-normal cursor-pointer text-[#384347] hover:text-[#5f4dc7]" variant="ghost">
                {isExporting ? (
                    <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        <div className="hidden md:block">Preparing...</div>
                    </>
                ) : (
                    <>
                        <Download size={16} className="mr-2" />
                        <div className="hidden md:block">Export as PDF</div>
                    </>
                )}
            </Button>
        </div>
    )
}
