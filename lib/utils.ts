import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Map friendly font names to CSS stacks; unrecognized values fall back to system sans.
export function resolveFontFamily(name?: string): string {
  const map: Record<string, string> = {
    Rubik: "Rubik, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    Arimo: "Arimo, Arial, sans-serif",
    Lato: "Lato, 'Helvetica Neue', Arial, sans-serif",
    Raleway: "Raleway, 'Helvetica Neue', Arial, sans-serif",
    Bitter: "Bitter, Georgia, 'Times New Roman', serif",
    "Exo 2": "'Exo 2', Arial, sans-serif",
    Chivo: "Chivo, Arial, sans-serif",
    Tinos: "Tinos, 'Times New Roman', serif",
    Montserrat: "Montserrat, 'Helvetica Neue', Arial, sans-serif",
    Oswald: "Oswald, Arial, sans-serif",
    Volkhov: "Volkhov, Georgia, serif",
    Gelasio: "Gelasio, Georgia, serif",
    Inter: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
  }
  return name && map[name] ? map[name] : map['Inter']
}

// Returns CSS background style properties for a page based on color and pattern/gradient settings.
export function getPageBackgroundStyle(
  color: string,
  pattern: 'none' | 'dots' | 'diagonal-stripes' | 'grid' | 'crosshatch',
  mode: 'solid' | 'pattern' | 'gradient' = 'solid',
  gradientTo?: string,
  angle: number = 180,
): { backgroundColor: string; backgroundImage?: string; backgroundSize?: string; backgroundAttachment?: string } {
  const base = color || '#ffffff'
  if (mode === 'gradient') {
    const to = gradientTo || base
    const safeAngle = isFinite(angle) ? angle : 180
    return {
      backgroundColor: base,
      backgroundImage: `linear-gradient(${safeAngle}deg, ${base}, ${to})`,
      backgroundAttachment: 'local',
    }
  }

  if (mode === 'pattern') switch (pattern) {
    case 'dots':
      // Subtle dot pattern overlay
      return {
        backgroundColor: base,
        backgroundImage: `radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)`,
        backgroundSize: '12px 12px',
      }
    case 'diagonal-stripes':
      return {
        backgroundColor: base,
        backgroundImage: `repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0 10px, transparent 10px 20px)`,
        backgroundSize: 'auto',
      }
    case 'grid':
      return {
        backgroundColor: base,
        backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
        backgroundSize: '24px 24px, 24px 24px',
      }
    case 'crosshatch':
      return {
        backgroundColor: base,
        backgroundImage: `repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 12px)`,
        backgroundSize: 'auto',
      }
  }
  return { backgroundColor: base }
}

// Compute style for an optional transparent image overlay placed relative to the page
export function getOverlayStyle(opts: {
  enabled?: boolean
  image?: string | null
  opacity?: number
  scale?: number
  x?: number // 0..100
  y?: number // 0..100
}): React.CSSProperties | undefined {
  const { enabled, image, opacity = 0.2, scale = 1, x = 50, y = 50 } = opts || {}
  if (!enabled || !image) return undefined
  const clampedOpacity = Math.max(0, Math.min(1, opacity))
  const clampedScale = Math.max(0.25, Math.min(4, scale))
  const clampedX = Math.max(0, Math.min(100, x))
  const clampedY = Math.max(0, Math.min(100, y))

  // The overlay will be absolutely positioned inside the page container
  return {
    position: 'absolute',
    left: `${clampedX}%`,
    top: `${clampedY}%`,
    transform: `translate(-50%, -50%) scale(${clampedScale})`,
    opacity: clampedOpacity,
    pointerEvents: 'none',
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    width: '40%', // base footprint before scale (responsive)
    height: '40%',
  }
}
