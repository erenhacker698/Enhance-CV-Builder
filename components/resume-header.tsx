"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    updateHeaderField,
    toggleHeaderFieldVisibility,
    uploadProfilePhoto,
    toggleUppercaseName,
    togglePhotoStyle,
} from "@/lib/features/resume/resumeSlice"
import { Camera, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditableText from "@/components/editable-text"
import HeaderSettingsPanel from "@/components/header-settings-panel"
import PhotoUploadModal from "@/components/photo-upload-modal"
import { cn } from "@/lib/utils"
import type { RootState } from "@/lib/store"

interface ResumeHeaderProps {
    isActive: boolean
    hidePhoto?: boolean
}

export default function ResumeHeader({ isActive, hidePhoto = false }: ResumeHeaderProps) {
    const dispatch = useDispatch()
    const header = useSelector((state: RootState) => state.resume.header)
    const [isHovered, setIsHovered] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [showPhotoUpload, setShowPhotoUpload] = useState(false)
    const settingsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleOpenPhotoUpload = () => {
            setShowPhotoUpload(true)
        }

        window.addEventListener("openPhotoUpload", handleOpenPhotoUpload)
        return () => {
            window.removeEventListener("openPhotoUpload", handleOpenPhotoUpload)
        }
    }, [])

    const handleFieldChange = (field: string, value: string) => {
        dispatch(updateHeaderField({ field, value }))
    }

    const handleToggleVisibility = (field: string, value: boolean) => {
        dispatch(toggleHeaderFieldVisibility({ field, value }))
    }

    const handleToggleUppercase = (value: boolean) => {
        dispatch(toggleUppercaseName({ value }))
    }

    const handleTogglePhotoStyle = (value: boolean) => {
        dispatch(togglePhotoStyle({ value }))
    }

    const handlePhotoUpload = (photoUrl: string) => {
        dispatch(uploadProfilePhoto({ photoUrl }))
        setShowPhotoUpload(false)
    }

    return (
        <div
            className={cn(
                "relative border border-transparent rounded-md transition-all",
                isActive && "ring-1 ring-teal-500 resume-header-active",
                (isActive || isHovered) && "border-gray-200",
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="p-6 flex justify-between items-start">
                <div className="flex-1">
                    <div className={cn("font-bold text-3xl", header.uppercaseName && "uppercase")}>
                        <EditableText
                            value={header.name}
                            onChange={(value) => handleFieldChange("name", value)}
                            className="w-full"
                        />
                    </div>

                    {header.visibility.title && (
                        <div className="text-teal-500 text-xl mt-1">
                            <EditableText
                                value={header.title}
                                onChange={(value) => handleFieldChange("title", value)}
                                className="w-full"
                            />
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4 mt-3">
                        {header.visibility.phone && header.phone !== "" && (
                            <div className="flex items-center text-gray-600">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-1"
                                >
                                    <path
                                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <EditableText
                                    value={header.phone}
                                    onChange={(value) => handleFieldChange("phone", value)}
                                    placeholder="Phone"
                                    className="text-sm"
                                />
                            </div>
                        )}

                        {header.visibility.email && (
                            <div className="flex items-center text-gray-600">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-1"
                                >
                                    <path
                                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M22 6l-10 7L2 6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <EditableText
                                    value={header.email}
                                    onChange={(value) => handleFieldChange("email", value)}
                                    placeholder="Email"
                                    className="text-sm"
                                />
                            </div>
                        )}

                        {header.visibility.link && (
                            <div className="flex items-center text-gray-600">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-1"
                                >
                                    <path
                                        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <EditableText
                                    value={header.link}
                                    onChange={(value) => handleFieldChange("link", value)}
                                    placeholder="LinkedIn/Portfolio"
                                    className="text-sm"
                                />
                            </div>
                        )}

                        {header.visibility.extraLink && (
                            <div className="flex items-center text-gray-600">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-1"
                                >
                                    <path
                                        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <EditableText
                                    value={header.extraLink}
                                    onChange={(value) => handleFieldChange("extraLink", value)}
                                    placeholder="Extra Link"
                                    className="text-sm"
                                />
                            </div>
                        )}

                        {header.visibility.location && (
                            <div className="flex items-center text-gray-600">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-1"
                                >
                                    <path
                                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <circle
                                        cx="12"
                                        cy="10"
                                        r="3"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <EditableText
                                    value={header.location}
                                    onChange={(value) => handleFieldChange("location", value)}
                                    placeholder="Location"
                                    className="text-sm"
                                />
                            </div>
                        )}

                        {header.visibility.extraField && (
                            <div className="flex items-center text-gray-600">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-1"
                                >
                                    <path
                                        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <EditableText
                                    value={header.extraField}
                                    onChange={(value) => handleFieldChange("extraField", value)}
                                    placeholder="Extra Field"
                                    className="text-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {header.visibility.photo && !hidePhoto && (
                    <div
                        className={cn(
                            "w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer",
                            header.roundPhoto ? "rounded-full" : "rounded-md",
                        )}
                        onClick={() => setShowPhotoUpload(true)}
                    >
                        {header.photoUrl ? (
                            <img src={header.photoUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <Camera size={24} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {(isActive || isHovered) && (
                <div className="absolute top-2 right-2 flex space-x-1">
                    {header.visibility.photo && !hidePhoto && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white border shadow-sm"
                            onClick={() => setShowPhotoUpload(true)}
                        >
                            <Camera size={14} />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white border shadow-sm"
                        onClick={() => setShowSettings(!showSettings)}
                    >
                        <Settings size={14} />
                    </Button>
                </div>
            )}

            {showSettings && (
                <div ref={settingsRef} className="absolute right-0 top-12 z-50">
                    <HeaderSettingsPanel
                        visibility={header.visibility}
                        uppercaseName={header.uppercaseName}
                        roundPhoto={header.roundPhoto}
                        onToggleVisibility={handleToggleVisibility}
                        onToggleUppercase={handleToggleUppercase}
                        onTogglePhotoStyle={handleTogglePhotoStyle}
                        onClose={() => setShowSettings(false)}
                    />
                </div>
            )}

            {showPhotoUpload && (
                <PhotoUploadModal
                    isOpen={showPhotoUpload}
                    onClose={() => setShowPhotoUpload(false)}
                    onUpload={handlePhotoUpload}
                    currentPhotoUrl={header.photoUrl}
                />
            )}
        </div>
    )
}
