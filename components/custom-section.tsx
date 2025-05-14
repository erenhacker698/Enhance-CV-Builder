"use client"
import { useDispatch } from "react-redux"
import {
    addCustomItem,
    updateCustomItem,
    removeCustomItem,
    toggleCustomItemFeatured,
} from "@/lib/features/resume/resumeSlice"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Info, Star, Calendar } from "lucide-react"
import EditableText from "@/components/editable-text"
import { cn } from "@/lib/utils"
import type { Section, CustomItem } from "@/lib/types"

interface CustomSectionProps {
    section: Section
    isActive: boolean
}

export default function CustomSection({ section, isActive }: CustomSectionProps) {
    const dispatch = useDispatch()
    const items = section.content.items || []

    const handleAddItem = () => {
        dispatch(
            addCustomItem({
                sectionId: section.id,
                item: {
                    id: `custom-${Date.now()}`,
                    title: "New Item",
                    dateRange: "Date period",
                    description: "Item description",
                    icon: "info",
                    featured: false,
                },
            }),
        )
    }

    const handleUpdateItem = (itemId: string, field: string, value: string) => {
        dispatch(
            updateCustomItem({
                sectionId: section.id,
                itemId,
                field,
                value,
            }),
        )
    }

    const handleRemoveItem = (itemId: string) => {
        dispatch(
            removeCustomItem({
                sectionId: section.id,
                itemId,
            }),
        )
    }

    const handleToggleFeatured = (itemId: string) => {
        dispatch(
            toggleCustomItemFeatured({
                sectionId: section.id,
                itemId,
            }),
        )
    }

    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case "info":
                return <Info size={16} />
            default:
                return <Info size={16} />
        }
    }

    return (
        <div className="space-y-4">
            {items.map((item: CustomItem) => (
                <div
                    key={item.id}
                    className={cn("relative p-2 -mx-2 group/item flex items-start", isActive && "hover:bg-gray-50 rounded")}
                >
                    {isActive && (
                        <div className="absolute right-2 top-2 opacity-0 group-hover/item:opacity-100 transition-opacity flex space-x-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("h-6 w-6", item.featured ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400")}
                                onClick={() => handleToggleFeatured(item.id)}
                            >
                                <Star size={14} className={item.featured ? "fill-yellow-400" : ""} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-400 hover:text-red-500"
                                onClick={() => handleRemoveItem(item.id)}
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    )}

                    <div className="bg-teal-100 rounded-full p-2 mr-3 text-teal-500 flex-shrink-0">{renderIcon(item.icon)}</div>

                    <div className="flex-1">
                        <div className="flex justify-between">
                            <EditableText
                                value={item.title}
                                onChange={(value) => handleUpdateItem(item.id, "title", value)}
                                className="font-medium"
                            />
                            <div className="flex items-center text-xs text-gray-500">
                                <Calendar size={12} className="mr-1" />
                                <EditableText
                                    value={item.dateRange}
                                    onChange={(value) => handleUpdateItem(item.id, "dateRange", value)}
                                    className="text-xs"
                                />
                            </div>
                        </div>
                        <EditableText
                            value={item.description}
                            onChange={(value) => handleUpdateItem(item.id, "description", value)}
                            className="text-sm text-gray-600"
                            multiline
                        />
                    </div>
                </div>
            ))}

            {isActive && (
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={handleAddItem}>
                    <Plus size={14} className="mr-1" />
                    Add Item
                </Button>
            )}
        </div>
    )
}
