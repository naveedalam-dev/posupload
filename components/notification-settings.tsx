"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, MessageSquare, AlertTriangle } from "lucide-react"

interface NotificationSettings {
  // General notifications
  enableNotifications: boolean
  notificationSound: boolean
  desktopNotifications: boolean
  
  // Business alerts
  lowStockAlerts: boolean
  lowStockThreshold: number
  dailySalesReport: boolean
  salesReportTime: string
  
  // Order notifications
  newOrderNotification: boolean
  orderStatusUpdates: boolean
  paymentNotifications: boolean
  
  // System notifications
  systemUpdates: boolean
  securityAlerts: boolean
  backupReminders: boolean
  
  // Email notifications
  emailNotifications: boolean
  emailAddress: string
  weeklyReports: boolean
  monthlyReports: boolean
  
  // SMS notifications (future feature)
  smsNotifications: boolean
  phoneNumber: string
}

const NOTIFICATION_SOUNDS = [
  { value: "default", label: "Default" },
  { value: "chime", label: "Chime" },
  { value: "bell", label: "Bell" },
  { value: "ding", label: "Ding" },
  { value: "none", label: "No Sound" },
]

export function NotificationSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pos_notification_settings")
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (error) {
          console.error("Failed to parse notification settings:", error)
        }
      }
    }
    
    return {
      enableNotifications: true,
      notificationSound: true,
      desktopNotifications: true,
      
      lowStockAlerts: true,
      lowStockThreshold: 10,
      dailySalesReport: true,
      salesReportTime: "18:00",
      
      newOrderNotification: true,
      orderStatusUpdates: true,
      paymentNotifications: true,
      
      systemUpdates: true,
      securityAlerts: true,
      backupReminders: true,
      
      emailNotifications: false,
      emailAddress: "",
      weeklyReports: false,
      monthlyReports: false,
      
      smsNotifications: false,
      phoneNumber: "",
    }
  })

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // Save to localStorage
      localStorage.setItem("pos_notification_settings", JSON.stringify(settings))
      
      // Request notification permission if enabled
      if (settings.desktopNotifications && "Notification" in window) {
        if (Notification.permission === "default") {
          await Notification.requestPermission()
        }
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Notifications saved",
        description: "Your notification settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    const defaultSettings: NotificationSettings = {
      enableNotifications: true,
      notificationSound: true,
      desktopNotifications: true,
      
      lowStockAlerts: true,
      lowStockThreshold: 10,
      dailySalesReport: true,
      salesReportTime: "18:00",
      
      newOrderNotification: true,
      orderStatusUpdates: true,
      paymentNotifications: true,
      
      systemUpdates: true,
      securityAlerts: true,
      backupReminders: true,
      
      emailNotifications: false,
      emailAddress: "",
      weeklyReports: false,
      monthlyReports: false,
      
      smsNotifications: false,
      phoneNumber: "",
    }
    
    setSettings(defaultSettings)
    
    toast({
      title: "Notifications reset",
      description: "Notification settings have been reset to default values.",
    })
  }

  const testNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Test Notification", {
        body: "This is a test notification from your POS system.",
        icon: "/placeholder.svg?height=64&width=64",
      })
    } else {
      toast({
        title: "Test notification",
        description: "This is how notifications will appear in your system.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            General Notifications
          </CardTitle>
          <CardDescription>Configure basic notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Master switch for all notifications
              </p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Desktop Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show browser notifications
              </p>
            </div>
            <Switch
              checked={settings.desktopNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, desktopNotifications: checked })}
              disabled={!settings.enableNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notification Sound</Label>
              <p className="text-sm text-muted-foreground">
                Play sound with notifications
              </p>
            </div>
            <Switch
              checked={settings.notificationSound}
              onCheckedChange={(checked) => setSettings({ ...settings, notificationSound: checked })}
              disabled={!settings.enableNotifications}
            />
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={testNotification}>
              Test Notification
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Business Alerts
          </CardTitle>
          <CardDescription>Important business-related notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when products are running low
              </p>
            </div>
            <Switch
              checked={settings.lowStockAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, lowStockAlerts: checked })}
              disabled={!settings.enableNotifications}
            />
          </div>

          {settings.lowStockAlerts && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="lowStockThreshold">Alert Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="1"
                max="100"
                value={settings.lowStockThreshold}
                onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 10 })}
                className="w-32"
              />
              <p className="text-sm text-muted-foreground">
                Alert when stock falls below this number
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Sales Report</Label>
              <p className="text-sm text-muted-foreground">
                Receive daily sales summary
              </p>
            </div>
            <Switch
              checked={settings.dailySalesReport}
              onCheckedChange={(checked) => setSettings({ ...settings, dailySalesReport: checked })}
              disabled={!settings.enableNotifications}
            />
          </div>

          {settings.dailySalesReport && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="salesReportTime">Report Time</Label>
              <Input
                id="salesReportTime"
                type="time"
                value={settings.salesReportTime}
                onChange={(e) => setSettings({ ...settings, salesReportTime: e.target.value })}
                className="w-32"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order & Payment Notifications</CardTitle>
          <CardDescription>Stay updated on orders and payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Order Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Alert when new orders are created
              </p>
            </div>
            <Switch
              checked={settings.newOrderNotification}
              onCheckedChange={(checked) => setSettings({ ...settings, newOrderNotification: checked })}
              disabled={!settings.enableNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Order Status Updates</Label>
              <p className="text-sm text-muted-foreground">
                Notify when order status changes
              </p>
            </div>
            <Switch
              checked={settings.orderStatusUpdates}
              onCheckedChange={(checked) => setSettings({ ...settings, orderStatusUpdates: checked })}
              disabled={!settings.enableNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Payment Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Alert on successful payments
              </p>
            </div>
            <Switch
              checked={settings.paymentNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, paymentNotifications: checked })}
              disabled={!settings.enableNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>Configure email-based notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>

          {settings.emailNotifications && (
            <div className="space-y-4 ml-6">
              <div className="space-y-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={settings.emailAddress}
                  onChange={(e) => setSettings({ ...settings, emailAddress: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly business summary
                  </p>
                </div>
                <Switch
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Monthly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive monthly business summary
                  </p>
                </div>
                <Switch
                  checked={settings.monthlyReports}
                  onCheckedChange={(checked) => setSettings({ ...settings, monthlyReports: checked })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Notifications</CardTitle>
          <CardDescription>Important system and security alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>System Updates</Label>
              <p className="text-sm text-muted-foreground">
                Notify about system updates and maintenance
              </p>
            </div>
            <Switch
              checked={settings.systemUpdates}
              onCheckedChange={(checked) => setSettings({ ...settings, systemUpdates: checked })}
              disabled={!settings.enableNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Security Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Important security notifications
              </p>
            </div>
            <Switch
              checked={settings.securityAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, securityAlerts: checked })}
              disabled={!settings.enableNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Backup Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Remind to backup important data
              </p>
            </div>
            <Switch
              checked={settings.backupReminders}
              onCheckedChange={(checked) => setSettings({ ...settings, backupReminders: checked })}
              disabled={!settings.enableNotifications}
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
          {isLoading ? "Saving..." : "Save Notifications"}
        </Button>
      </div>
    </div>
  )
}