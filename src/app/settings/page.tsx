"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
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
import { useFeatureAccess } from "@/lib/features/hooks";
import { TIER_INFO, TIER_FEATURES, Feature, SubscriptionTier, FEATURE_CATALOG, getTierFeaturesByCategory } from "@/lib/features";
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
  X,
  Sparkles,
  Star,
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

// Storage keys for localStorage
const STORAGE_KEYS = {
  company: 'settings_company',
  user: 'settings_user',
  notifications: 'settings_notifications',
  loadDefaults: 'settings_loadDefaults',
  companyLogo: 'settings_companyLogo',
  profilePhoto: 'settings_profilePhoto',
};

export default function SettingsPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("company");
  const [theme, setTheme] = useState("light");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  
  // Load tab from URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  
  // Company settings
  const [companyData, setCompanyData] = useState({
    name: "Fretum-Freight Logistics",
    legalName: "Fretum-Freight Logistics LLC",
    mcNumber: "MC-123456",
    dotNumber: "DOT-7891234",
    scac: "FFLT",
    address: "123 Logistics Way",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    phone: "(555) 123-4567",
    email: "dispatch@fretumfreight.com",
    website: "www.fretumfreight.com",
    taxId: "12-3456789",
  });

  // User profile
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@fretumfreight.com",
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

  // Load saved settings from localStorage on mount
  useEffect(() => {
    try {
      const savedCompany = localStorage.getItem(STORAGE_KEYS.company);
      const savedUser = localStorage.getItem(STORAGE_KEYS.user);
      const savedNotifications = localStorage.getItem(STORAGE_KEYS.notifications);
      const savedLoadDefaults = localStorage.getItem(STORAGE_KEYS.loadDefaults);
      const savedLogo = localStorage.getItem(STORAGE_KEYS.companyLogo);
      const savedProfilePhoto = localStorage.getItem(STORAGE_KEYS.profilePhoto);
      
      if (savedCompany) setCompanyData(JSON.parse(savedCompany));
      if (savedUser) setUserData(JSON.parse(savedUser));
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
      if (savedLoadDefaults) setLoadDefaults(JSON.parse(savedLoadDefaults));
      if (savedLogo) setCompanyLogo(savedLogo);
      if (savedProfilePhoto) setProfilePhoto(savedProfilePhoto);
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
  }, []);

  const handleSave = () => {
    try {
      // Save all settings to localStorage
      localStorage.setItem(STORAGE_KEYS.company, JSON.stringify(companyData));
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
      localStorage.setItem(STORAGE_KEYS.loadDefaults, JSON.stringify(loadDefaults));
      if (companyLogo) {
        localStorage.setItem(STORAGE_KEYS.companyLogo, companyLogo);
      }
      if (profilePhoto) {
        localStorage.setItem(STORAGE_KEYS.profilePhoto, profilePhoto);
      }
      
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error Saving Settings",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setCompanyLogo(base64);
      toast({
        title: "Logo Uploaded",
        description: "Company logo has been uploaded. Click Save to keep changes.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setCompanyLogo(null);
    localStorage.removeItem(STORAGE_KEYS.companyLogo);
    toast({
      title: "Logo Removed",
      description: "Company logo has been removed.",
    });
  };

  const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setProfilePhoto(base64);
      toast({
        title: "Photo Uploaded",
        description: "Profile photo has been uploaded. Click Save to keep changes.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePhoto = () => {
    setProfilePhoto(null);
    localStorage.removeItem(STORAGE_KEYS.profilePhoto);
    toast({
      title: "Photo Removed",
      description: "Profile photo has been removed.",
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-white p-3 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 md:w-6 md:h-6 text-brand-600" />
                Settings
              </h1>
              <p className="text-muted-foreground text-xs md:text-sm mt-1">
                Manage your company, profile, and application preferences
              </p>
            </div>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1 md:mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col md:flex-row h-full">
            {/* Sidebar Navigation */}
            <div className="md:w-64 border-b md:border-b-0 md:border-r bg-slate-50/50 p-2 md:p-4">
              <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
                {[
                  { id: "company", label: "Company", icon: Building2 },
                  { id: "profile", label: "Profile", icon: User },
                  { id: "notifications", label: "Notifications", icon: Bell },
                  { id: "security", label: "Security", icon: Lock },
                  { id: "appearance", label: "Appearance", icon: Palette },
                  { id: "loads", label: "Load Defaults", icon: Truck },
                  { id: "billing", label: "Billing", icon: CreditCard },
                  { id: "team", label: "Team", icon: Users },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm transition-colors whitespace-nowrap ${
                      activeTab === item.id
                        ? "bg-white shadow-sm text-brand-600 font-medium"
                        : "text-slate-600 hover:bg-white hover:text-slate-900"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                    {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto hidden md:block" />}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-3 md:p-6 overflow-auto">
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
                      <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden relative">
                        {companyLogo ? (
                          <>
                            <img src={companyLogo} alt="Company Logo" className="w-full h-full object-cover" />
                            <button 
                              onClick={handleRemoveLogo}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                              aria-label="Remove logo"
                              title="Remove logo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <Building2 className="w-10 h-10 text-slate-400" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleLogoUpload}
                          accept="image/*"
                          className="hidden"
                          aria-label="Upload company logo"
                        />
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
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
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          {profilePhoto ? (
                            <AvatarImage src={profilePhoto} />
                          ) : (
                            <AvatarImage src="/placeholder-avatar.jpg" />
                          )}
                          <AvatarFallback className="text-xl bg-brand-100 text-brand-700">
                            {userData.firstName[0]}
                            {userData.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {profilePhoto && (
                          <button 
                            onClick={handleRemoveProfilePhoto}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                            aria-label="Remove profile photo"
                            title="Remove profile photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="file"
                          ref={profilePhotoInputRef}
                          onChange={handleProfilePhotoUpload}
                          accept="image/*"
                          className="hidden"
                          aria-label="Upload profile photo"
                        />
                        <Button variant="outline" size="sm" onClick={() => profilePhotoInputRef.current?.click()}>
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
                <BillingSection />
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
                          { name: "John Smith", email: "john@fretumfreight.com", role: "Admin", status: "active" },
                          { name: "Sarah Johnson", email: "sarah@fretumfreight.com", role: "Dispatcher", status: "active" },
                          { name: "Mike Williams", email: "mike@fretumfreight.com", role: "Driver Manager", status: "active" },
                          { name: "Emily Brown", email: "emily@fretumfreight.com", role: "Accounting", status: "pending" },
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

// Billing Section Component with Tier Management
function BillingSection() {
  const { tier, tierInfo, setTier, availableFeatures, can } = useFeatureAccess();
  const { toast } = useToast();
  const allTiers: SubscriptionTier[] = ['trial', 'starter', 'professional', 'enterprise'];
  
  // Key features to highlight for each tier
  const tierHighlights: Record<SubscriptionTier, string[]> = {
    trial: ['Dashboard', 'Load Management', 'Basic Dispatch', 'BOL Generation'],
    starter: ['ELD Integrations (Samsara, Motive, Geotab)', 'IFTA Reporting', 'Fuel Tax Reports', 'Expense Tracking', 'Document Management'],
    professional: ['Live GPS Tracking', 'QuickBooks Integration', 'Advanced Reports', 'AI Load Extraction', 'HOS Compliance'],
    enterprise: ['Unlimited Everything', 'API Access', 'Custom Branding', 'Route Optimization', 'Priority Support'],
  };
  
  const handleUpgrade = (newTier: SubscriptionTier) => {
    setTier(newTier);
    toast({
      title: "Plan Updated",
      description: `Your plan has been changed to ${TIER_INFO[newTier].name}. This is a demo - in production this would process payment.`,
    });
  };
  
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Billing & Plans</h2>
        <p className="text-sm text-muted-foreground">Manage your subscription and view available features</p>
      </div>

      {/* Current Plan Card */}
      <Card className="border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-100 rounded-lg">
                <Star className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <CardTitle className="text-base">Current Plan: {tierInfo.name}</CardTitle>
                <CardDescription>{tierInfo.description}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-brand-600">{tierInfo.price}</p>
              <p className="text-xs text-muted-foreground">{tierInfo.priceNote}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-xl font-bold text-brand-600">
                {tierInfo.maxUsers === 'unlimited' ? '∞' : tierInfo.maxUsers}
              </p>
              <p className="text-xs text-muted-foreground">Max Users</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-xl font-bold text-brand-600">
                {tierInfo.maxLoads === 'unlimited' ? '∞' : tierInfo.maxLoads}
              </p>
              <p className="text-xs text-muted-foreground">Max Loads/Month</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-xl font-bold text-brand-600">{tierInfo.maxTrucks}</p>
              <p className="text-xs text-muted-foreground">Fleet Size</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-xl font-bold text-brand-600">{availableFeatures.length}</p>
              <p className="text-xs text-muted-foreground">Features</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Compare Plans</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allTiers.map((planTier) => {
            const info = TIER_INFO[planTier];
            const isCurrentPlan = tier === planTier;
            const features = tierHighlights[planTier];
            
            return (
              <Card 
                key={planTier} 
                className={`relative ${isCurrentPlan ? 'border-2 border-brand-500 shadow-lg' : ''} ${info.highlighted ? 'ring-2 ring-amber-400' : ''}`}
              >
                {info.highlighted && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-500 text-white">Most Popular</Badge>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-brand-600 text-white">Current Plan</Badge>
                  </div>
                )}
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-lg">{info.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{info.price}</span>
                    {info.priceNote && (
                      <span className="text-xs text-muted-foreground">/{info.priceNote.replace('per ', '')}</span>
                    )}
                  </div>
                  <CardDescription className="text-xs">{info.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-muted-foreground">
                    <p>Up to {info.maxTrucks} trucks</p>
                    <p>{info.maxUsers === 'unlimited' ? 'Unlimited' : `Up to ${info.maxUsers}`} users</p>
                  </div>
                  <Separator />
                  <div className="space-y-1.5">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className={`w-full mt-4 ${isCurrentPlan ? 'bg-slate-200 text-slate-600' : 'bg-brand-600 hover:bg-brand-700 text-white'}`}
                    disabled={isCurrentPlan}
                    onClick={() => handleUpgrade(planTier)}
                  >
                    {isCurrentPlan ? 'Current Plan' : planTier === 'enterprise' ? 'Contact Sales' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Feature Availability by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Available Features</CardTitle>
          <CardDescription>Features included in your {tierInfo.name} plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Integrations - Highlight ELD */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4" /> Integrations
              </h4>
              <div className="space-y-1">
                {(['eld_integrations', 'eld_samsara', 'eld_motive', 'eld_geotab', 'quickbooks_integration', 'factoring_integration', 'load_board_integration', 'api_access'] as Feature[]).map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs">
                    {can(feature) ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-300" />
                    )}
                    <span className={can(feature) ? '' : 'text-slate-400'}>
                      {FEATURE_CATALOG[feature].name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Compliance - Highlight IFTA */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Compliance & Reporting
              </h4>
              <div className="space-y-1">
                {(['ifta_reporting', 'fuel_tax_reports', 'bol_generation', 'document_management', 'hos_compliance', 'safety_compliance', 'reports_basic', 'reports_advanced'] as Feature[]).map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs">
                    {can(feature) ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-300" />
                    )}
                    <span className={can(feature) ? '' : 'text-slate-400'}>
                      {FEATURE_CATALOG[feature].name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Advanced */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Advanced Features
              </h4>
              <div className="space-y-1">
                {(['ai_load_extraction', 'route_optimization', 'predictive_analytics', 'live_tracking', 'multi_location', 'custom_branding', 'unlimited_users', 'unlimited_loads'] as Feature[]).map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs">
                    {can(feature) ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-300" />
                    )}
                    <span className={can(feature) ? '' : 'text-slate-400'}>
                      {FEATURE_CATALOG[feature].name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Starter Plan Highlight */}
      {tier === 'trial' && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">Upgrade to Starter for just $99/month</p>
                  <p className="text-sm text-green-600">
                    Includes <strong>ELD Integrations</strong> (Samsara, Motive, Geotab) and <strong>IFTA Reporting</strong>!
                  </p>
                </div>
              </div>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleUpgrade('starter')}
              >
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
