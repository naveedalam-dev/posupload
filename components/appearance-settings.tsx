"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import { Separator } from "@/components/ui/separator"
import { Palette, Monitor, Moon, Sun } from "lucide-react"

interface AppearanceSettings {
  theme: "light" | "dark" | "system"
  primaryColor: string
  fontSize: number
  compactMode: boolean
  showAnimations: boolean
  sidebarCollapsed: boolean
  showTooltips: boolean
  highContrast: boolean
}

const THEME_COLORS = [
  { value: "blue", label: "Blue", color: "hsl(221.2 83.2% 53.3%)" },
  { value: "green", label: "Green", color: "hsl(142.1 76.2% 36.3%)" },
  { value: "purple", label: "Purple", color: "hsl(262.1 83.3% 57.8%)" },
  { value: "red", label: "Red", color: "hsl(346.8 77.2% 49.8%)" },
  { value: "orange", label: "Orange", color: "hsl(24.6 95% 53.1%)" },
  { value: "yellow", label: "Yellow", color: "hsl(47.9 95.8% 53.1%)" },
]

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState<AppearanceSettings>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pos_appearance_settings")
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (error) {
          console.error("Failed to parse appearance settings:", error)
        }
      }
    }
    
    return {
      theme: "system",
      primaryColor: "blue",
      fontSize: 14,
      compactMode: false,
      showAnimations: true,
      sidebarCollapsed: false,
      showTooltips: true,
      highContrast: false,
    }
  })

  // Apply theme changes
  useEffect(() => {
    setTheme(settings.theme)
  }, [settings.theme, setTheme])

  // Apply custom CSS variables
  useEffect(() => {
    const root = document.documentElement
    
    // Apply primary color
    const selectedColor = THEME_COLORS.find(c => c.value === settings.primaryColor)
    if (selectedColor) {
      root.style.setProperty('--primary', selectedColor.color)
    }

    // Apply font size
    root.style.setProperty('--font-size-base', `${settings.fontSize}px`)

    // Apply compact mode
    if (settings.compactMode) {
      root.classList.add('compact-mode')
    } else {
      root.classList.remove('compact-mode')
    }

    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Apply animations
    if (!settings.showAnimations) {
      root.classList.add('no-animations')
    } else {
      root.classList.remove('no-animations')
    }
  }, [settings])

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // Save to localStorage
      localStorage.setItem("pos_appearance_settings", JSON.stringify(settings))
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Appearance saved",
        description: "Your appearance settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save appearance settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    const defaultSettings: AppearanceSettings = {
      theme: "system",
      primaryColor: "blue",
      fontSize: 14,
      compactMode: false,
      showAnimations: true,
      sidebarCollapsed: false,
      showTooltips: true,
      highContrast: false,
    }
    
    setSettings(defaultSettings)
    
    toast({
      title: "Appearance reset",
      description: "Appearance settings have been reset to default values.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme & Colors
          </CardTitle>
          <CardDescription>Customize the visual appearance of your POS system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Theme Mode</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={settings.theme === "light" ? "default" : "outline"}
                onClick={() => setSettings({ ...settings, theme: "light" })}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant={settings.theme === "dark" ? "default" : "outline"}
                onClick={() => setSettings({ ...settings, theme: "dark" })}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
              <Button
                variant={settings.theme === "system" ? "default" : "outline"}
                onClick={() => setSettings({ ...settings, theme: "system" })}
                className="flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                System
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Primary Color</Label>
            <div className="grid grid-cols-3 gap-3">
              {THEME_COLORS.map((color) => (
                <Button
                  key={color.value}
                  variant={settings.primaryColor === color.value ? "default" : "outline"}
                  onClick={() => setSettings({ ...settings, primaryColor: color.value })}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: color.color }}
                  />
                  {color.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout & Typography</CardTitle>
          <CardDescription>Adjust layout density and text size</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Font Size: {settings.fontSize}px</Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={(value) => setSettings({ ...settings, fontSize: value[0] })}
              min={12}
              max={18}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Small (12px)</span>
              <span>Medium (14px)</span>
              <span>Large (18px)</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compact Mode</Label>
              <p className="text-sm text-muted-foreground">
                Reduce spacing and padding for more content
              </p>
            </div>
            <Switch
              checked={settings.compactMode}
              onCheckedChange={(checked) => setSettings({ ...settings, compactMode: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sidebar Collapsed by Default</Label>
              <p className="text-sm text-muted-foreground">
                Start with sidebar in collapsed state
              </p>
            </div>
            <Switch
              checked={settings.sidebarCollapsed}
              onCheckedChange={(checked) => setSettings({ ...settings, sidebarCollapsed: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility & Interactions</CardTitle>
          <CardDescription>Configure accessibility and interaction preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>High Contrast Mode</Label>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(checked) => setSettings({ ...settings, highContrast: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Animations</Label>
              <p className="text-sm text-muted-foreground">
                Enable smooth transitions and animations
              </p>
            </div>
            <Switch
              checked={settings.showAnimations}
              onCheckedChange={(checked) => setSettings({ ...settings, showAnimations: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Tooltips</Label>
              <p className="text-sm text-muted-foreground">
                Display helpful tooltips on hover
              </p>
            </div>
            <Switch
              checked={settings.showTooltips}
              onCheckedChange={(checked) => setSettings({ ...settings, showTooltips: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Appearance"}
        </Button>
      </div>
    </div>
  )
}