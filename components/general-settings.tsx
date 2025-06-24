"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

interface StoreSettings {
  storeName: string
  storeAddress: string
  storePhone: string
  storeEmail: string
  taxId: string
  currency: string
  timezone: string
  language: string
  receiptFooter: string
  lowStockThreshold: number
}

const CURRENCIES = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "PKR", label: "Pakistani Rupee (Rs)" },
  { value: "INR", label: "Indian Rupee (₹)" },
]

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time" },
  { value: "America/Chicago", label: "Central Time" },
  { value: "America/Denver", label: "Mountain Time" },
  { value: "America/Los_Angeles", label: "Pacific Time" },
  { value: "Asia/Karachi", label: "Pakistan Standard Time" },
  { value: "Asia/Kolkata", label: "India Standard Time" },
]

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ur", label: "Urdu" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
]

export function GeneralSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState<StoreSettings>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pos_store_settings")
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (error) {
          console.error("Failed to parse store settings:", error)
        }
      }
    }
    
    return {
      storeName: "Wahab Kidney & General Hospital",
      storeAddress: "Timergara Dir Lower, KPK",
      storePhone: "(0945) 824362",
      storeEmail: "info@wkgh.com",
      taxId: "TAX-001",
      currency: "PKR",
      timezone: "Asia/Karachi",
      language: "en",
      receiptFooter: "Thank you for your business!",
      lowStockThreshold: 10,
    }
  })

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // Save to localStorage
      localStorage.setItem("pos_store_settings", JSON.stringify(settings))
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings saved",
        description: "Your store settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    const defaultSettings: StoreSettings = {
      storeName: "Wahab Kidney & General Hospital",
      storeAddress: "Timergara Dir Lower, KPK",
      storePhone: "(0945) 824362",
      storeEmail: "info@wkgh.com",
      taxId: "TAX-001",
      currency: "PKR",
      timezone: "Asia/Karachi",
      language: "en",
      receiptFooter: "Thank you for your business!",
      lowStockThreshold: 10,
    }
    
    setSettings(defaultSettings)
    
    toast({
      title: "Settings reset",
      description: "Settings have been reset to default values.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>Basic information about your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                placeholder="Enter store name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input
                id="storeEmail"
                type="email"
                value={settings.storeEmail}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                placeholder="Enter store email"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storePhone">Store Phone</Label>
              <Input
                id="storePhone"
                value={settings.storePhone}
                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                placeholder="Enter store phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={settings.taxId}
                onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
                placeholder="Enter tax ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeAddress">Store Address</Label>
            <Textarea
              id="storeAddress"
              value={settings.storeAddress}
              onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
              placeholder="Enter store address"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regional Settings</CardTitle>
          <CardDescription>Configure currency, timezone, and language preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((timezone) => (
                    <SelectItem key={timezone.value} value={timezone.value}>
                      {timezone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Settings</CardTitle>
          <CardDescription>Configure business-specific settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receiptFooter">Receipt Footer Message</Label>
            <Textarea
              id="receiptFooter"
              value={settings.receiptFooter}
              onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
              placeholder="Enter message to appear on receipts"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
            <Input
              id="lowStockThreshold"
              type="number"
              min="1"
              value={settings.lowStockThreshold}
              onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 10 })}
              placeholder="Enter minimum stock level"
            />
            <p className="text-sm text-muted-foreground">
              You'll receive alerts when product stock falls below this number
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}