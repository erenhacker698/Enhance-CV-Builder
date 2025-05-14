"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

interface PhotoUploadModalProps {
    isOpen: boolean
    onClose: () => void
    onUpload: (photoUrl: string) => void
    currentPhotoUrl?: string
}

export default function PhotoUploadModal({ isOpen, onClose, onUpload, currentPhotoUrl }: PhotoUploadModalProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleSave = () => {
        if (previewUrl) {
            onUpload(previewUrl)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">Upload photo:</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6 overflow-hidden">
                        {previewUrl ? (
                            <img
                                src={previewUrl || "/placeholder.svg"}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={64} className="text-gray-400" />
                        )}
                    </div>

                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleUploadClick} className="w-32">
                            Upload
                        </Button>

                        <Button onClick={handleSave} disabled={!previewUrl} className="w-32 bg-teal-500 hover:bg-teal-600">
                            Save
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
