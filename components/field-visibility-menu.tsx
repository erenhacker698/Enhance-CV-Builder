"use client";

import { EducationContentVisibility, EducationFields } from "@/lib/types";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface FieldVisibilityMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  visibility: EducationContentVisibility | null;
  onToggle: (field: keyof EducationContentVisibility, value: boolean) => void;
}

export default function FieldVisibilityMenu({
  position,
  onClose,
  visibility,
  onToggle,
}: FieldVisibilityMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 250),
    y: Math.min(position.y, window.innerHeight - 300),
  };

  return createPortal(
    <div
      ref={menuRef}
      className="fixed bg-white rounded-md shadow-lg border border-gray-200 z-50 w-64"
      style={{
        top: `${adjustedPosition.y}px`,
        left: `${adjustedPosition.x}px`,
      }}
    >
      <div className="p-3 space-y-3">
        {EducationFields.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={`show-${key}`} className="text-sm">
              {label}
            </Label>
            <Switch
              id={`show-${key}`}
              checked={visibility![key] ?? false}
              onCheckedChange={(checked) => onToggle(key, checked)}
              className="data-[state=checked]:bg-teal-500"
            />
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}
