"use client"

import { useRef, useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { RootState } from "@/lib/store"
import { clearAllSectionBackgrounds } from "@/lib/features/resume/resumeSlice"
import { setFontFamily, setFontSize, setLineHeight, setPageMargins, setPrimaryColor, setSectionSpacing, setPageBackgroundColor, setPageBackgroundPattern, setHeadingColor, setPageBackgroundMode, setPageBackgroundGradientTo, setPageBackgroundGradientAngle, setOverlayEnabled, setOverlayImage, setOverlayOpacity, setOverlayScale, setOverlayPositioning, resetDesignToDefaults, setLeftSidebarBgColor } from "@/lib/features/settings/settingsSlice"

export default function DesignFontPanel() {
  const dispatch = useDispatch()
  const panelRef = useRef<HTMLDivElement>(null)
  const { template, leftSidebarBgColor, pageMargins, sectionSpacing, fontFamily, fontSize, lineHeight, primaryColor, headingColor, pageBackgroundColor, pageBackgroundPattern, pageBackgroundMode, pageBackgroundGradientTo, pageBackgroundGradientAngle, overlayEnabled, overlayImage, overlayOpacity, overlayScale } = useSelector((s: RootState) => s.settings)
  const [patterns, setPatterns] = useState<{ name: string; path: string }[]>([])
  const [loadingPatterns, setLoadingPatterns] = useState(false)
  const [overlayPickerOpen, setOverlayPickerOpen] = useState(false)
  const [bgOpen, setBgOpen] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)

  // Always-visible panel: remove outside-click close behavior

  useEffect(() => {
    // fetch available overlay patterns
    let cancelled = false
    setLoadingPatterns(true)
    fetch('/api/background-patterns').then(r => r.json()).then((data) => {
      if (cancelled) return
      setPatterns(Array.isArray(data.files) ? data.files : [])
    }).catch(() => setPatterns([])).finally(() => setLoadingPatterns(false))
    return () => { cancelled = true }
  }, [])

  const fontOptions = [
    { label: "Inter", value: "Inter" },
    { label: "Rubik", value: "Rubik" },
    { label: "Arimo", value: "Arimo" },
    { label: "Lato", value: "Lato" },
    { label: "Raleway", value: "Raleway" },
    { label: "Bitter", value: "Bitter" },
    { label: "Exo 2", value: "Exo 2" },
    { label: "Chivo", value: "Chivo" },
    { label: "Tinos", value: "Tinos" },
    { label: "Montserrat", value: "Montserrat" },
    { label: "Oswald", value: "Oswald" },
    { label: "Volkhov", value: "Volkhov" },
    { label: "Gelasio", value: "Gelasio" },
  ]

  return (
    <div ref={panelRef} className="bg-white rounded-md shadow-sm md:shadow-hover border border-gray-200 w-full md:w-full p-3 space-y-3">
      <h3 className="text-base font-medium">Design & Font</h3>

      {/* Layout */}
      <div>
        <Label className="text-sm">Page Margins</Label>
        <input type="range" min={12} max={64} step={2} value={pageMargins} onChange={(e) => dispatch(setPageMargins(parseInt(e.target.value, 10)))} className="w-full" />
        <div className="text-xs text-gray-500 mt-1">{pageMargins}px</div>
      </div>
      <div>
        <Label className="text-sm">Section Spacing</Label>
        <input type="range" min={8} max={48} step={2} value={sectionSpacing} onChange={(e) => dispatch(setSectionSpacing(parseInt(e.target.value, 10)))} className="w-full" />
        <div className="text-xs text-gray-500 mt-1">{sectionSpacing}px</div>
      </div>
      {/* Typography */}
      <div>
        <Label className="text-sm">Font Style</Label>
        <select value={fontFamily} onChange={(e) => dispatch(setFontFamily(e.target.value))} className="w-full border rounded p-2 mt-1">
          {fontOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-sm">Font Size</Label>
          <select value={fontSize} onChange={(e) => dispatch(setFontSize(parseFloat(e.target.value)))} className="w-full border rounded p-2 mt-1">
            {[0.5,0.6,0.7,0.8,0.9,1,1.1,1.2,1.3].map(s => <option key={s} value={s}>{`${Math.round(s*100)}%`}</option>)}
          </select>
        </div>
        <div>
          <Label className="text-sm">Line Height</Label>
          <select value={lineHeight} onChange={(e) => dispatch(setLineHeight(parseFloat(e.target.value)))} className="w-full border rounded p-2 mt-1">
            {[1,1.2,1.4,1.6,1.8].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <hr className="my-2 border-gray-200" />
      {/* Colors */}
      <div>
        <Label className="text-sm">Primary Color</Label>
        <div className="flex items-center gap-2 mt-1">
          {['#14b8a6','#3b82f6','#ef4444','#eab308','#8b5cf6','#0ea5e9','#10b981','#374151'].map(c => (
            <button key={c} aria-label={c} className="w-6 h-6 rounded-full border" style={{ backgroundColor: c }} onClick={() => dispatch(setPrimaryColor(c))} />
          ))}
          <input type="color" value={primaryColor} onChange={(e) => dispatch(setPrimaryColor(e.target.value))} className="ml-auto h-6 w-10" />
        </div>
      </div>
      <div>
        <Label className="text-sm">Heading Color</Label>
        <div className="flex items-center gap-2 mt-1">
          {['#3e3e3e','#111827','#374151','#1f2937','#0f172a','#334155','#475569','#64748b'].map(c => (
            <button key={c} aria-label={c} className="w-6 h-6 rounded-full border" style={{ backgroundColor: c }} onClick={() => dispatch(setHeadingColor(c))} />
          ))}
          <input type="color" value={headingColor} onChange={(e) => dispatch(setHeadingColor(e.target.value))} className="ml-auto h-6 w-10" />
        </div>
      </div>

      {/* Template-specific settings */}
      {template === 'left-sidebar' && (
        <div className="bg-gray-50 p-2 rounded border border-gray-200">
          <span className="text-sm font-medium">Left Sidebar Background</span>
          <div className="flex items-center gap-2 mt-2">
            {['#22405c','#0f172a','#1f2937','#334155','#0369a1','#3b82f6','#111827','#0b1726'].map(c => (
              <button key={c} aria-label={c} className="w-6 h-6 rounded border" style={{ backgroundColor: c }} onClick={() => dispatch(setLeftSidebarBgColor(c))} />
            ))}
            <input type="color" value={leftSidebarBgColor || '#22405c'} onChange={(e) => dispatch(setLeftSidebarBgColor(e.target.value))} className="ml-auto h-6 w-10" />
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Applies only to the Left Sidebar template.</p>
        </div>
      )}
  <hr className="my-2 border-gray-200" />

  {/* Page Background (collapsible) */}
      <div className="bg-gray-50 p-2 rounded border border-gray-200">
        <button
          type="button"
          onClick={() => setBgOpen(v => !v)}
          className="w-full flex items-center justify-between py-1 cursor-pointer "
          aria-expanded={bgOpen}
          aria-controls="page-bg-section"
        >
          <span className="text-sm font-medium">Page Background</span>
          <ChevronDown size={16} className={`transition-transform ${bgOpen ? 'rotate-180' : ''}`} />
        </button>
        {bgOpen && (
          <div id="page-bg-section" className="mt-2 space-y-2">
            <div className="grid grid-cols-3 gap-1">
            <div className="flex items-center gap-2">
              <input type="color" value={pageBackgroundColor} onChange={(e) => dispatch(setPageBackgroundColor(e.target.value))} className="h-8 w-12" />
              <span className="text-xs text-gray-500">{pageBackgroundColor}</span>
            </div>
              <button className={`border rounded px-2 py-1 text-xs ${pageBackgroundMode==='pattern' ? 'bg-gray-900 text-white' : ''}`} onClick={() => dispatch(setPageBackgroundMode('pattern'))}>Pattern</button>
              <button className={`border rounded px-2 py-1 text-xs ${pageBackgroundMode==='gradient' ? 'bg-gray-900 text-white' : ''}`} onClick={() => dispatch(setPageBackgroundMode('gradient'))}>Gradient</button>
            </div>
          </div>
        )}
      </div>

      {bgOpen && pageBackgroundMode === 'pattern' && (
        <div className="space-y-2 bg-gray-50 p-2">
          <Label className="text-sm">Background Pattern</Label>
          <select value={pageBackgroundPattern} onChange={(e) => dispatch(setPageBackgroundPattern(e.target.value as any))} className="w-full border rounded p-2 mt-2">
            <option value="none">None</option>
            <option value="dots">Dots</option>
            <option value="diagonal-stripes">Diagonal stripes</option>
            <option value="grid">Grid</option>
            <option value="crosshatch">Crosshatch</option>
          </select>
          <div className="text-xs text-gray-500 mt-1">Patterns are semi-transparent overlays on your chosen color.</div>
        </div>
      )}

      {bgOpen && pageBackgroundMode === 'gradient' && (
        <div className="space-y-2 bg-gray-50 p-2">
          <div>
            
            <div className="flex items-center gap-2 mt-1">
               <Label className="text-sm mr-5">Gradient Second Color</Label>
              <input type="color" value={pageBackgroundGradientTo || '#f5f5f5'} onChange={(e) => dispatch(setPageBackgroundGradientTo(e.target.value))} className="h-8 w-12" />
              <span className="text-xs text-gray-500">{pageBackgroundGradientTo}</span>
            </div>
          </div>
          <div>
            <Label className="text-sm">Gradient Angle</Label>
            <input type="range" min={0} max={360} step={5} value={pageBackgroundGradientAngle ?? 180} onChange={(e) => dispatch(setPageBackgroundGradientAngle(parseInt(e.target.value, 10)))} className="w-full" />
            <div className="text-xs text-gray-500 mt-1">{pageBackgroundGradientAngle ?? 180}°</div>
          </div>
        </div>
      )}

      <hr className="my-2 border-gray-200" />

      {/* Image Overlay (collapsible) */}
      <div className="bg-gray-50 p-2 rounded border border-gray-200">
        <button
          type="button"
          onClick={() => setOverlayOpen(v => !v)}
          className="w-full flex items-center justify-between py-1 cursor-pointer"
          aria-expanded={overlayOpen}
          aria-controls="image-overlay-section"
        >
          <span className="text-sm font-medium">Image Overlay</span>
          <ChevronDown size={16} className={`transition-transform ${overlayOpen ? 'rotate-180' : ''}`} />
        </button>
  {overlayOpen && (
  <div id="image-overlay-section" className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-600">Enable</label>
            <input type="checkbox" checked={!!overlayEnabled} onChange={(e) => dispatch(setOverlayEnabled(e.target.checked))} />
          </div>
          <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setOverlayPickerOpen(true)}>Choose pattern…</Button>
            <span className="text-xs text-gray-500 truncate max-w-[140px]">{overlayImage ? overlayImage.split('/').pop() : 'None selected'}</span>
          </div>
          <Dialog open={overlayPickerOpen} onOpenChange={setOverlayPickerOpen}>
            <DialogContent className="w-[98%] max-w-2xl">
              <DialogHeader>
                <DialogTitle>Select an overlay pattern</DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                <div className="grid grid-cols-6 gap-3">
                  <button className={`border rounded flex items-center justify-center text-xs ${!overlayImage ? 'ring-2 ring-teal-500' : ''}`} style={{ width: 48, height: 48 }} onClick={() => { dispatch(setOverlayImage(null)); setOverlayPickerOpen(false); }}>None</button>
                  {loadingPatterns && <div className="col-span-5 text-xs text-gray-500">Loading…</div>}
                  {!loadingPatterns && patterns.map((p) => (
                    <button key={p.path} className={`border rounded overflow-hidden relative ${overlayImage===p.path ? 'ring-2 ring-teal-500' : ''}`} style={{ width: 48, height: 48 }} onClick={() => { dispatch(setOverlayImage(p.path)); setOverlayPickerOpen(false); }} title={p.name}>
                      <img src={p.path} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 mt-2">Place transparent PNGs/SVGs in <code>/public/background-patterns</code>. Thumbnails appear here automatically.</p>
              </div>
            </DialogContent>
          </Dialog>
          <div className="flex items-center gap-2">
            <label className="text-xs w-16">Opacity</label>
            <input type="range" className="flex-1" min={0} max={1} step={0.05} value={overlayOpacity ?? 0.2} onChange={(e) => dispatch(setOverlayOpacity(parseFloat(e.target.value)))} />
            <span className="text-xs w-10 text-right">{Math.round((overlayOpacity ?? 0.2)*100)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs w-16">Scale</label>
            <input type="range" className="flex-1" min={0.25} max={4} step={0.05} value={overlayScale ?? 1} onChange={(e) => dispatch(setOverlayScale(parseFloat(e.target.value)))} />
            <span className="text-xs w-10 text-right">{Math.round((overlayScale ?? 1)*100)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <button className="border rounded px-2 py-1 text-xs" onClick={() => dispatch(setOverlayPositioning(true))}>Drag to Position</button>
            <span className="text-xs text-gray-500">Position in canvas</span>
          </div>
        </div>
        </div>
        )}
      </div>

      <hr className="my-2 border-gray-200" />
        {/* Reset / Clear Buttons */}
      <div className="flex justify-center">
        <div className="flex gap-2 right-0">
        <Button variant="outline" onClick={() => dispatch(clearAllSectionBackgrounds())}>Clear sections style</Button>
        <Button variant="outline" onClick={() => dispatch(resetDesignToDefaults())}>Reset defaults</Button>  
        </div>
      </div>
    </div>
  )
}
