"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Settings, Printer, Wifi, CreditCard, Shield, Bell, Monitor } from "lucide-react"

export function POSSettings() {
  const [autoOpenDrawer, setAutoOpenDrawer] = React.useState(true)
  const [printReceipts, setPrintReceipts] = React.useState(true)
  const [soundEnabled, setSoundEnabled] = React.useState(true)
  const [taxRate, setTaxRate] = React.useState("8.5")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Settings className="mr-2 h-8 w-8" />
            POS Settings
          </h1>
          <p className="text-muted-foreground">Configure your point of sale system preferences</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="mr-2 h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic POS system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-id">Register ID</Label>
              <Input id="register-id" defaultValue="REG001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cashier-name">Cashier Name</Label>
              <Input id="cashier-name" defaultValue="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="cad">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

       

    
        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Security and access control settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">Cashier PIN</Label>
              <Input id="pin" type="password" placeholder="Enter 4-digit PIN" maxLength={4} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require PIN for Refunds</Label>
                <p className="text-sm text-muted-foreground">Manager PIN required for refunds</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require PIN for Voids</Label>
                <p className="text-sm text-muted-foreground">Manager PIN required to void transactions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="auto-logout">Auto Logout (minutes)</Label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sound Effects</Label>
                <p className="text-sm text-muted-foreground">Play sounds for scans and transactions</p>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert when items are low in stock</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Price Check Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert for price verification needed</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="alert-volume">Alert Volume</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="mute">Mute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Network Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wifi className="mr-2 h-5 w-5" />
              Network Settings
            </CardTitle>
            <CardDescription>Network and connectivity configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Connection Status</Label>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">WiFi: SuperMarket_POS</span>
                <Badge variant="default">Connected</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Server Connection</Label>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Main Server</span>
                <Badge variant="default">Online</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Offline Mode</Label>
                <p className="text-sm text-muted-foreground">Continue operations when offline</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="sync-interval">Sync Interval</Label>
              <Select defaultValue="5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current system status and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Software Version</Label>
              <div className="text-sm text-muted-foreground">POS v2.1.0</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Last Update</Label>
              <div className="text-sm text-muted-foreground">January 15, 2024</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">License</Label>
              <div className="text-sm text-muted-foreground">Enterprise</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Branch</Label>
              <div className="text-sm text-muted-foreground">Downtown Branch</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Terminal ID</Label>
              <div className="text-sm text-muted-foreground">TERM001</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Support</Label>
              <div className="text-sm text-muted-foreground">(555) 123-4567</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
