"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    updateHeaderField,
    toggleHeaderFieldVisibility,
    uploadProfilePhoto,
    toggleUppercaseName,
    togglePhotoStyle,
    setHeader,
} from "@/lib/features/resume/resumeSlice"
import { Camera, Link, LocateIcon, Mail, MapPin, Phone, Settings, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditableText from "@/components/Shared/editable-text"
import HeaderSettingsPanel from "@/components/Common/Header/header-settings-panel"
import PhotoUploadModal from "@/components/Common/Dialogs/photo-upload-modal"
import { cn } from "@/lib/utils"
import type { RootState } from "@/lib/store"

interface ResumeHeaderProps {
    isActive: boolean
    hidePhoto?: boolean
}

const STORAGE_KEY = 'resume_header_data'

export default function ResumeHeader({ isActive, hidePhoto = false }: ResumeHeaderProps) {
    const dispatch = useDispatch()
    const header = useSelector((state: RootState) => state.resume.header)
    const { primaryColor, currentCvId } = useSelector((state: RootState) => state.settings)
    const [isHovered, setIsHovered] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [showPhotoUpload, setShowPhotoUpload] = useState(false)
    const settingsRef = useRef<HTMLDivElement>(null)

    // Load data from localStorage on mount (only for unsaved sessions), without creating history steps
    useEffect(() => {
        try {
            if (currentCvId) return // when a document is open, do not override from localStorage
            const savedData = localStorage.getItem(STORAGE_KEY)
            if (!savedData) return
            const parsedData = JSON.parse(savedData)
            // Merge onto current header to keep defaults, then hydrate without logging history
            const merged = { ...header, ...parsedData, visibility: { ...header.visibility, ...(parsedData?.visibility || {}) } }
            dispatch(setHeader(merged))
        } catch (error) {
            console.error('Error loading header data from localStorage:', error)
        }
    }, [dispatch, currentCvId])

    // Save to localStorage whenever header state changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(header))
        } catch (error) {
            console.error('Error saving header data to localStorage:', error)
        }
    }, [header])

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

    // Add function to clear all data
    const handleClearData = () => {
        if (confirm('Are you sure you want to clear all resume data?')) {
            localStorage.removeItem(STORAGE_KEY)
            // You might want to dispatch actions to reset Redux state too
            window.location.reload() // Simple way to reset everything
        }
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
            <div className="p-4 flex flex-col-reverse lg:flex-row justify-between gap-3 lg:gap-0 items-start">
                <div className="flex-1">
                    <div className={cn("font-bold text-3xl", header.uppercaseName && "uppercase")}>
                        <EditableText
                            value={header.name}
                            onChange={(value) => handleFieldChange("name", value)}
                            className="w-full border-none outline-none"
                            placeholder="YOUR NAME"
                        />
                    </div>

                    {header.visibility.title && (
                        <div className="text-xl mt-1" style={{ color: primaryColor }}>
                            <EditableText
                                value={header.title}
                                onChange={(value) => handleFieldChange("title", value)}
                                className="w-full border-none outline-none"
                                placeholder="The role you are applying for?"
                            />
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4 mt-3">
                        {header.visibility.phone && header.phone !== "" && (
                            <div className="flex items-center text-gray-600">
                                <Phone className="w-4 h-4 mr-1" />
                                <EditableText
                                    value={header.phone}
                                    onChange={(value) => handleFieldChange("phone", value)}
                                    placeholder="Phone"
                                    className="text-sm border-none outline-none"
                                />
                            </div>
                        )}

                        {header.visibility.email && (
                            <div className="flex items-center text-gray-600">
                                <Mail className="w-4 h-4 mr-1" />
                                <EditableText
                                    value={header.email}
                                    onChange={(value) => handleFieldChange("email", value)}
                                    placeholder="Email"
                                    className="text-sm border-none outline-none"
                                />
                            </div>
                        )}

                        {header.visibility.link && (
                            <div className="flex items-center text-gray-600">
                                <Link className="w-4 h-4 mr-1" />
                                <EditableText
                                    value={header.link}
                                    onChange={(value) => handleFieldChange("link", value)}
                                    placeholder="LinkedIn/Portfolio"
                                    className="text-sm border-none outline-none"
                                />
                            </div>
                        )}

                        {header.visibility.extraLink && (
                            <div className="flex items-center text-gray-600">
                                <Link className="w-4 h-4 mr-1" />
                                <EditableText
                                    value={header.extraLink}
                                    onChange={(value) => handleFieldChange("extraLink", value)}
                                    placeholder="Extra Link"
                                    className="text-sm border-none outline-none"
                                />
                            </div>
                        )}

                        {header.visibility.location && (
                            <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-1" />
                                <EditableText
                                    value={header.location}
                                    onChange={(value) => handleFieldChange("location", value)}
                                    placeholder="Location"
                                    className="text-sm border-none outline-none"
                                />
                            </div>
                        )}

                        {header.visibility.extraField && (
                            <div className="flex items-center text-gray-600">
                                <Shield className="w-4 h-4 mr-1" />
                                <EditableText
                                    value={header.extraField}
                                    onChange={(value) => handleFieldChange("extraField", value)}
                                    placeholder="Extra Field"
                                    className="text-sm border-none outline-none"
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
                            <img src={header.photoUrl} alt="Profile" className="w-full h-full object-cover" />
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
                    storageKey="resume_profile_photo" // Separate key for just the photo
                />
            )}
        </div>
    )
}