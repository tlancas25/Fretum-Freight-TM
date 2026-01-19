"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings,
  Building2,
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Upload,
  Shield,
  Key,
  Smartphone,
  History,
  Users,
  CreditCard,
  FileText,
  Truck,
  Clock,
  Calendar,
  DollarSign,
  Percent,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("company");
  const [theme, setTheme] = useState("light");
  
  // Company settings
  const [companyData, setCompanyData] = useState({
    name: "FocusFreight Logistics",
    legalName: "FocusFreight Logistics LLC",
    mcNumber: "MC-123456",
    dotNumber: "DOT-7891234",
    scac: "FFLT",
    address: "123 Logistics Way",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    phone: "(555) 123-4567",
    email: "dispatch@focusfreight.com",
    website: "www.focusfreight.com",
    taxId: "12-3456789",
  });

  // User profile
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@focusfreight.com",
    phone: "(555) 987-6543",
    role: "Dispatcher",
    department: "Operations",
    timezone: "America/Los_Angeles",
    language: "en",
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailLoadUpdates: true,
    emailNewLoads: true,
    emailPayments: true,
    pushLoadUpdates: true,
    pushNewLoads: false,
    pushPayments: true,
    smsLoadUpdates: false,
    smsUrgent: true,
    digestFrequency: "daily",
  });

  // Load defaults
  const [loadDefaults, setLoadDefaults] = useState({
    defaultEquipment: "dry-van",
    defaultOrigin: "Los Angeles, CA",
    ratePerMile: "2.50",
    fuelSurcharge: "15",
    defaultPaymentTerms: "net-30",
    autoAssign: true,
    requirePOD: true,
    trackingInterval: "30",
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-6 h-6 text-brand-600" />
                Settings
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage your company, profile, and application preferences
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Sidebar Navigation */}
            <div className="w-64 border-r bg-slate-50/50 p-4">
              <nav className="space-y-1">
                {[
                  { id: "company", label: "Company Profile", icon: Building2 },
                  { id: "profile", label: "My Profile", icon: User },
                  { id: "notifications", label: "Notifications", icon: Bell },
                  { id: "security", label: "Security", icon: Lock },
                  { id: "appearance", label: "Appearance", icon: Palette },
                  { id: "loads", label: "Load Defaults", icon: Truck },
                  { id: "billing", label: "Billing & Plans", icon: CreditCard },
                  { id: "team", label: "Team Members", icon: Users },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === item.id
                        ? "bg-white shadow-sm text-brand-600 font-medium"
                        : "text-slate-600 hover:bg-white hover:text-slate-900"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
              {/* Company Profile */}
              {activeTab === "company" && (
                <div className="max-w-3xl space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold">Company Profile</h2>
                    <p className="text-sm text-muted-foreground">
                      Update your company information and legal details
                    </p>
                  </div>

                  {/* Logo Upload */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Company Logo</CardTitle>
                      <CardDescription>Upload your company logo for documents and branding</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50">
                        <Building2 className="w-10 h-10 text-slate-400" />
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                        </Button>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB. Recommended 400x400px</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Company Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Company Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Company Name</Label>
                          <Input
                            value={companyData.name}
                            onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Legal Name</Label>
                          <Input
                            value={companyData.legalName}
                            onChange={(e) => setCompanyData({ ...companyData, legalName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>MC Number</Label>
                          <Input
                            value={companyData.mcNumber}
                            onChange={(e) => setCompanyData({ ...companyData, mcNumber: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>DOT Number</Label>
                          <Input
                            value={companyData.dotNumber}
                            onChange={(e) => setCompanyData({ ...companyData, dotNumber: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SCAC Code</Label>
                          <Input
                            value={companyData.scac}
                            onChange={(e) => setCompanyData({ ...companyData, scac: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tax ID (EIN)</Label>
                          <Input
                            value={companyData.taxId}
                            onChange={(e) => setCompanyData({ ...companyData, taxId: e.target.value })}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Business Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Street Address</Label>
                        <Input
                          value={companyData.address}
                          onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>City</Label>
                          <Input
                            value={companyData.city}
                            onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>State</Label>
                          <Input
                            value={companyData.state}
                            onChange={(e) => setCompanyData({ ...companyData, state: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ZIP Code</Label>
                          <Input
                            value={companyData.zip}
                            onChange={(e) => setCompanyData({ ...companyData, zip: e.target.value })}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            value={companyData.phone}
                            onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            value={companyData.email}
                            onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Website</Label>
                        <Input
                          value={companyData.website}
                          onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* My Profile */}
              {activeTab === "profile" && (
                <div className="max-w-3xl space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold">My Profile</h2>
                    <p className="text-sm text-muted-foreground">Manage your personal information and preferences</p>
                  </div>

                  {/* Avatar */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Profile Photo</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-6">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback className="text-xl bg-brand-100 text-brand-700">
                          {userData.firstName[0]}
                          {userData.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          Change Photo
                        </Button>
                        <p className="text-xs text-muted-foreground">JPG, PNG up to 2MB</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Personal Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input
                            value={userData.firstName}
                            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input
                            value={userData.lastName}
                            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            value={userData.phone}
                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Input value={userData.role} disabled className="bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Department</Label>
                          <Input
                            value={userData.department}
                            onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preferences */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Timezone</Label>
                          <Select value={userData.timezone} onValueChange={(v) => setUserData({ ...userData, timezone: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Language</Label>
                          <Select value={userData.language} onValueChange={(v) => setUserData({ ...userData, language: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="max-w-3xl space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
                  </div>

                  {/* Email Notifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Load Updates</p>
                          <p className="text-xs text-muted-foreground">Receive emails when loads are updated</p>
                        </div>
                        <Switch
                          checked={notifications.emailLoadUpdates}
                          onCheckedChange={(v) => setNotifications({ ...notifications, emailLoadUpdates: v })}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">New Loads</p>
                          <p className="text-xs text-muted-foreground">Get notified when new loads are created</p>
                        </div>
                        <Switch
                          checked={notifications.emailNewLoads}
                          onCheckedChange={(v) => setNotifications({ ...notifications, emailNewLoads: v })}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Payment Notifications</p>
                          <p className="text-xs text-muted-foreground">Receive payment and invoice updates</p>
                        </div>
                        <Switch
                          checked={notifications.emailPayments}
                          onCheckedChange={(v) => setNotifications({ ...notifications, emailPayments: v })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Push Notifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Push Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Load Updates</p>
                          <p className="text-xs text-muted-foreground">Browser push for load status changes</p>
                        </div>
                        <Switch
                          checked={notifications.pushLoadUpdates}
                          onCheckedChange={(v) => setNotifications({ ...notifications, pushLoadUpdates: v })}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">New Loads</p>
                          <p className="text-xs text-muted-foreground">Get push alerts for new load assignments</p>
                        </div>
                        <Switch
                          checked={notifications.pushNewLoads}
                          onCheckedChange={(v) => setNotifications({ ...notifications, pushNewLoads: v })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* SMS Notifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        SMS Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Urgent Alerts Only</p>
                          <p className="text-xs text-muted-foreground">Receive SMS for critical issues only</p>
                        </div>
                        <Switch
                          checked={notifications.smsUrgent}
                          onCheckedChange={(v) => setNotifications({ ...notifications, smsUrgent: v })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Digest */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Email Digest</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Digest Frequency</Label>
                        <Select
                          value={notifications.digestFrequency}
                          onValueChange={(v) => setNotifications({ ...notifications, digestFrequency: v })}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">Real-time</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <div className="max-w-3xl space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold">Security</h2>
                    <p className="text-sm text-muted-foreground">Manage your account security settings</p>
                  </div>

                  {/* Password */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        Password
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Change Password</p>
                          <p className="text-xs text-muted-foreground">Last changed 45 days ago</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Update Password
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Two-Factor */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Two-Factor Authentication
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Enable 2FA</p>
                          <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700">Not Enabled</Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Set Up 2FA
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Sessions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <History className="w-4 h-4" />
                        Active Sessions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Monitor className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Current Session</p>
                            <p className="text-xs text-muted-foreground">Windows • Chrome • Los Angeles, CA</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Sign Out All Other Sessions
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Appearance */}
              {activeTab === "appearance" && (
                <div className="max-w-3xl space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold">Appearance</h2>
                    <p className="text-sm text-muted-foreground">Customize how the app looks</p>
                  </div>

                  {/* Theme */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Theme</CardTitle>
                      <CardDescription>Choose your preferred color scheme</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: "light", label: "Light", icon: Sun },
                          { id: "dark", label: "Dark", icon: Moon },
                          { id: "system", label: "System", icon: Monitor },
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`p-4 rounded-lg border-2 transition-colors ${
                              theme === t.id
                                ? "border-brand-600 bg-brand-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <t.icon className={`w-6 h-6 mx-auto mb-2 ${theme === t.id ? "text-brand-600" : "text-slate-500"}`} />
                            <p className={`text-sm font-medium ${theme === t.id ? "text-brand-600" : "text-slate-700"}`}>
                              {t.label}
                            </p>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sidebar */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Sidebar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Compact Mode</p>
                          <p className="text-xs text-muted-foreground">Show smaller sidebar icons</p>
                        </div>
                        <Switch />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Show Badges</p>
                          <p className="text-xs text-muted-foreground">Display notification counts</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Load Defaults */}
              {activeTab === "loads" && (
                <div className="max-w-3xl space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold">Load Defaults</h2>
                    <p className="text-sm text-muted-foreground">Set default values for new loads</p>
                  </div>

                  {/* Equipment & Locations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Default Equipment & Locations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Default Equipment Type</Label>
                          <Select
                            value={loadDefaults.defaultEquipment}
                            onValueChange={(v) => setLoadDefaults({ ...loadDefaults, defaultEquipment: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dry-van">Dry Van</SelectItem>
                              <SelectItem value="reefer">Reefer</SelectItem>
                              <SelectItem value="flatbed">Flatbed</SelectItem>
                              <SelectItem value="step-deck">Step Deck</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Default Origin</Label>
                          <Input
                            value={loadDefaults.defaultOrigin}
                            onChange={(e) => setLoadDefaults({ ...loadDefaults, defaultOrigin: e.target.value })}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Rates */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Rate Defaults</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Default Rate per Mile</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              className="pl-8"
                              value={loadDefaults.ratePerMile}
                              onChange={(e) => setLoadDefaults({ ...loadDefaults, ratePerMile: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Fuel Surcharge</Label>
                          <div className="relative">
                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              className="pl-8"
                              value={loadDefaults.fuelSurcharge}
                              onChange={(e) => setLoadDefaults({ ...loadDefaults, fuelSurcharge: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Payment Terms</Label>
                          <Select
                            value={loadDefaults.defaultPaymentTerms}
                            onValueChange={(v) => setLoadDefaults({ ...loadDefaults, defaultPaymentTerms: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="net-15">Net 15</SelectItem>
                              <SelectItem value="net-30">Net 30</SelectItem>
                              <SelectItem value="net-45">Net 45</SelectItem>
                              <SelectItem value="quick-pay">Quick Pay</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Automation */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Automation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Auto-assign Drivers</p>
                          <p className="text-xs text-muted-foreground">Automatically suggest best available driver</p>
                        </div>
                        <Switch
                          checked={loadDefaults.autoAssign}
                          onCheckedChange={(v) => setLoadDefaults({ ...loadDefaults, autoAssign: v })}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Require POD</p>
                          <p className="text-xs text-muted-foreground">Require proof of delivery for completion</p>
                        </div>
                        <Switch
                          checked={loadDefaults.requirePOD}
                          onCheckedChange={(v) => setLoadDefaults({ ...loadDefaults, requirePOD: v })}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Tracking Update Interval</p>
                          <p className="text-xs text-muted-foreground">How often to request driver location</p>
                        </div>
                        <Select
                          value={loadDefaults.trackingInterval}
                          onValueChange={(v) => setLoadDefaults({ ...loadDefaults, trackingInterval: v })}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Billing */}
              {activeTab === "billing" && (
                <div className="max-w-3xl space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold">Billing & Plans</h2>
                    <p className="text-sm text-muted-foreground">Manage your subscription and billing</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">Current Plan</CardTitle>
                          <CardDescription>Enterprise - Full Access</CardDescription>
                        </div>
                        <Badge className="bg-brand-100 text-brand-700">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-brand-600 to-brand-700 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white/90">Your plan includes</p>
                            <p className="text-2xl font-bold mt-1 text-white">Unlimited Users & Loads</p>
                          </div>
                          <CheckCircle2 className="w-10 h-10 text-white/80" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-2xl font-bold text-brand-600">∞</p>
                          <p className="text-xs text-muted-foreground">Active Loads</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-2xl font-bold text-brand-600">∞</p>
                          <p className="text-xs text-muted-foreground">Team Members</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-2xl font-bold text-brand-600">∞</p>
                          <p className="text-xs text-muted-foreground">Integrations</p>
                        </div>
                      </div>
                      <p className="text-center text-sm text-muted-foreground">
                        You have full access to all FocusFreight features. No limitations.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Team */}
              {activeTab === "team" && (
                <div className="max-w-3xl space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">Team Members</h2>
                      <p className="text-sm text-muted-foreground">Manage your team and their permissions</p>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Users className="w-4 h-4 mr-2" />
                      Invite Member
                    </Button>
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {[
                          { name: "John Smith", email: "john@focusfreight.com", role: "Admin", status: "active" },
                          { name: "Sarah Johnson", email: "sarah@focusfreight.com", role: "Dispatcher", status: "active" },
                          { name: "Mike Williams", email: "mike@focusfreight.com", role: "Driver Manager", status: "active" },
                          { name: "Emily Brown", email: "emily@focusfreight.com", role: "Accounting", status: "pending" },
                        ].map((member, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-brand-100 text-brand-700">
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge variant="secondary">{member.role}</Badge>
                              {member.status === "active" ? (
                                <Badge className="bg-green-100 text-green-700">Active</Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                              )}
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
