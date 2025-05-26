"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { User, Trash2 } from "lucide-react"

interface PhotoUploadModalProps {
    isOpen: boolean
    onClose: () => void
    onUpload: (photoUrl: string) => void
    currentPhotoUrl?: string
    storageKey?: string
}

export default function PhotoUploadModal({
    isOpen,
    onClose,
    onUpload,
    currentPhotoUrl,
    storageKey = "resume_profile_photo"
}: PhotoUploadModalProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Load from localStorage on component mount
    useEffect(() => {
        const savedPhoto = localStorage.getItem(storageKey)
        if (savedPhoto && !currentPhotoUrl) {
            setPreviewUrl(savedPhoto)
        }
    }, [storageKey, currentPhotoUrl])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file size (optional - limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size should be less than 5MB")
                return
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert("Please select a valid image file")
                return
            }

            const reader = new FileReader()
            reader.onload = () => {
                const result = reader.result as string
                setPreviewUrl(result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleSave = () => {
        if (previewUrl) {
            try {
                // Save to localStorage
                localStorage.setItem(storageKey, previewUrl)

                // Call parent callback
                onUpload(previewUrl)

                // Close modal
                onClose()
            } catch (error) {
                console.error("Error saving photo to localStorage:", error)
                alert("Error saving photo. The image might be too large.")
            }
        }
    }

    const handleRemovePhoto = () => {
        setPreviewUrl(null)
        localStorage.removeItem(storageKey)
        onUpload("") // Notify parent that photo was removed
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
                                src={previewUrl}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={64} className="text-gray-400" />
                        )}
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleUploadClick}
                            className="w-24"
                        >
                            Upload
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={!previewUrl}
                            className="w-24 bg-teal-500 hover:bg-teal-600"
                        >
                            Save
                        </Button>

                        {previewUrl && (
                            <Button
                                variant="outline"
                                onClick={handleRemovePhoto}
                                className="w-24 text-red-600 hover:text-red-700"
                            >
                                <Trash2 size={16} />
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}