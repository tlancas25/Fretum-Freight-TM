"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Plug,
  Mail,
  FileText,
  Truck,
  CreditCard,
  MapPin,
  BarChart3,
  Cloud,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Settings,
  RefreshCw,
  ExternalLink,
  Key,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Link2,
  Unlink,
  TestTube,
  Activity,
  Globe,
  Database,
  FileSpreadsheet,
  Phone,
  MessageSquare,
  Bell,
  Wallet,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Integration categories
const categories = [
  { id: "all", label: "All Integrations", icon: Plug },
  { id: "email", label: "Email & Communication", icon: Mail },
  { id: "documents", label: "Documents & BOL", icon: FileText },
  { id: "tracking", label: "Tracking & GPS", icon: MapPin },
  { id: "payment", label: "Payment & Billing", icon: CreditCard },
  { id: "eld", label: "ELD & Compliance", icon: Truck },
  { id: "analytics", label: "Analytics & BI", icon: BarChart3 },
  { id: "storage", label: "Cloud Storage", icon: Cloud },
];

// Available integrations
const integrations = [
  // Email & Communication
  {
    id: "gmail",
    name: "Gmail",
    description: "Send automated emails, rate confirmations, and BOL documents directly to carriers and customers.",
    category: "email",
    icon: Mail,
    status: "available",
    popular: true,
    features: ["Auto-send rate confirmations", "Customer notifications", "Document attachments", "Email templates"],
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Integrate with Outlook for email communications and calendar scheduling.",
    category: "email",
    icon: Mail,
    status: "available",
    features: ["Email sync", "Calendar integration", "Contact sync", "Meeting scheduling"],
  },
  {
    id: "twilio",
    name: "Twilio SMS",
    description: "Send SMS notifications to drivers and customers for real-time updates.",
    category: "email",
    icon: MessageSquare,
    status: "connected",
    connectedAt: "2025-12-15",
    lastSync: "2026-01-09T08:30:00",
    features: ["Driver alerts", "Customer updates", "Delivery notifications", "Two-way messaging"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get instant notifications in your Slack workspace for critical load updates.",
    category: "email",
    icon: Bell,
    status: "available",
    features: ["Channel notifications", "Direct messages", "Custom alerts", "Workflow automation"],
  },
  // Documents & BOL
  {
    id: "bol-generator",
    name: "BOL Generator",
    description: "Generate professional Bills of Lading with customizable templates and auto-fill capabilities.",
    category: "documents",
    icon: FileText,
    status: "connected",
    connectedAt: "2025-11-20",
    lastSync: "2026-01-09T09:00:00",
    popular: true,
    features: ["Custom templates", "Auto-fill from loads", "PDF generation", "E-signature support"],
  },
  {
    id: "docusign",
    name: "DocuSign",
    description: "Enable electronic signatures for rate confirmations, contracts, and BOL documents.",
    category: "documents",
    icon: FileText,
    status: "available",
    popular: true,
    features: ["E-signatures", "Document tracking", "Audit trail", "Template library"],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Store and organize all your documents in Google Drive for easy access.",
    category: "storage",
    icon: Cloud,
    status: "available",
    features: ["Document storage", "Folder organization", "Sharing controls", "Auto-backup"],
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Sync and store documents securely with Dropbox Business integration.",
    category: "storage",
    icon: Cloud,
    status: "available",
    features: ["File sync", "Shared folders", "Version history", "Offline access"],
  },
  // Tracking & GPS
  {
    id: "samsara",
    name: "Samsara",
    description: "Real-time GPS tracking, ELD compliance, and fleet telematics integration.",
    category: "tracking",
    icon: MapPin,
    status: "connected",
    connectedAt: "2025-10-05",
    lastSync: "2026-01-09T09:15:00",
    popular: true,
    features: ["Live GPS tracking", "ELD logs", "DVIR reports", "Fuel tracking"],
  },
  {
    id: "keeptruckin",
    name: "KeepTruckin (Motive)",
    description: "ELD compliance, GPS tracking, and driver safety monitoring.",
    category: "tracking",
    icon: MapPin,
    status: "available",
    features: ["ELD compliance", "GPS tracking", "AI dashcam", "Driver coaching"],
  },
  {
    id: "geotab",
    name: "Geotab",
    description: "Advanced fleet tracking and telematics for comprehensive vehicle insights.",
    category: "tracking",
    icon: MapPin,
    status: "available",
    features: ["GPS tracking", "Driver behavior", "Fuel management", "Maintenance alerts"],
  },
  {
    id: "project44",
    name: "Project44",
    description: "Advanced visibility platform for real-time shipment tracking.",
    category: "tracking",
    icon: Globe,
    status: "available",
    features: ["Multi-modal tracking", "Predictive ETAs", "Exception alerts", "Analytics"],
  },
  {
    id: "google-maps",
    name: "Google Maps Platform",
    description: "Interactive maps, route visualization, and distance calculations for fleet tracking.",
    category: "tracking",
    icon: MapPin,
    status: "available",
    popular: true,
    features: ["Interactive fleet maps", "Route visualization", "Distance & ETA calculations", "Traffic data"],
    apiKeyRequired: true,
  },
  // Payment & Billing
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Sync invoices, payments, and financial data with QuickBooks Online.",
    category: "payment",
    icon: CreditCard,
    status: "connected",
    connectedAt: "2025-09-10",
    lastSync: "2026-01-09T06:00:00",
    popular: true,
    features: ["Invoice sync", "Payment tracking", "Financial reports", "Tax preparation"],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept credit card payments and automate billing for freight services.",
    category: "payment",
    icon: CreditCard,
    status: "available",
    features: ["Card payments", "ACH transfers", "Recurring billing", "Payment links"],
  },
  {
    id: "factoring",
    name: "Triumph Pay",
    description: "Freight factoring integration for faster payment processing.",
    category: "payment",
    icon: Wallet,
    status: "available",
    features: ["Invoice factoring", "Quick pay", "Credit checks", "Payment tracking"],
  },
  // ELD & Compliance
  {
    id: "eld-mandate",
    name: "ELD Mandate Hub",
    description: "Centralized ELD compliance monitoring and HOS management.",
    category: "eld",
    icon: Truck,
    status: "connected",
    connectedAt: "2025-08-20",
    lastSync: "2026-01-09T09:00:00",
    features: ["HOS tracking", "Violation alerts", "FMCSA compliance", "Driver logs"],
  },
  {
    id: "fmcsa",
    name: "FMCSA Portal",
    description: "Direct integration with FMCSA for compliance checks and carrier monitoring.",
    category: "eld",
    icon: Shield,
    status: "available",
    features: ["Safety scores", "Authority status", "Insurance verification", "Crash data"],
  },
  // Analytics & BI
  {
    id: "powerbi",
    name: "Power BI",
    description: "Advanced business intelligence and custom dashboards for data visualization.",
    category: "analytics",
    icon: BarChart3,
    status: "available",
    features: ["Custom dashboards", "Data modeling", "Real-time analytics", "Report sharing"],
  },
  {
    id: "tableau",
    name: "Tableau",
    description: "Enterprise-grade data visualization and analytics platform.",
    category: "analytics",
    icon: BarChart3,
    status: "available",
    features: ["Visual analytics", "Data blending", "Collaborative BI", "Mobile dashboards"],
  },
  {
    id: "dat",
    name: "DAT Load Board",
    description: "Access the largest load board network for finding freight and carriers.",
    category: "analytics",
    icon: Database,
    status: "available",
    popular: true,
    features: ["Load posting", "Rate insights", "Carrier search", "Market analytics"],
  },
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "connected":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Connected
        </Badge>
      );
    case "error":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Error
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          <Plug className="w-3 h-3 mr-1" />
          Available
        </Badge>
      );
  }
}

// Integration card component
function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
  onConfigure,
}: {
  integration: typeof integrations[0];
  onConnect: () => void;
  onDisconnect: () => void;
  onConfigure: () => void;
}) {
  const Icon = integration.icon;
  const isConnected = integration.status === "connected";

  return (
    <Card className={`relative card-interactive ${isConnected ? "border-green-200 bg-gradient-to-br from-green-50/50 to-white shadow-green-100/50" : "bg-gradient-to-br from-white to-slate-50/50"}`}>
      {integration.popular && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 shadow-md">Popular</Badge>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl shadow-sm ${isConnected ? "bg-green-100" : "bg-slate-100"}`}>
              <Icon className={`w-5 h-5 ${isConnected ? "text-green-600" : "text-slate-600"}`} />
            </div>
            <div>
              <CardTitle className="text-base">{integration.name}</CardTitle>
              <StatusBadge status={integration.status} />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isConnected ? (
                <>
                  <DropdownMenuItem onClick={onConfigure}>
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Connection
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Now
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={onDisconnect}>
                    <Unlink className="w-4 h-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={onConnect}>
                    <Link2 className="w-4 h-4 mr-2" />
                    Connect
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Learn More
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{integration.description}</p>
        
        <div className="flex flex-wrap gap-1.5">
          {integration.features.slice(0, 3).map((feature, idx) => (
            <Badge key={idx} variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
              {feature}
            </Badge>
          ))}
          {integration.features.length > 3 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal text-muted-foreground">
              +{integration.features.length - 3} more
            </Badge>
          )}
        </div>

        {isConnected && integration.lastSync && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <Activity className="w-3 h-3" />
            Last synced: {new Date(integration.lastSync).toLocaleString()}
          </div>
        )}

        <div className="pt-2">
          {isConnected ? (
            <Button variant="outline" className="w-full" onClick={onConfigure}>
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          ) : (
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={onConnect}>
              <Zap className="w-4 h-4 mr-2" />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function IntegrationsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<typeof integrations[0] | null>(null);

  // Filter integrations
  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const connectedCount = integrations.filter((i) => i.status === "connected").length;
  const availableCount = integrations.filter((i) => i.status === "available").length;

  const handleConnect = (integration: typeof integrations[0]) => {
    setSelectedIntegration(integration);
    setConnectDialogOpen(true);
  };

  const handleDisconnect = (integration: typeof integrations[0]) => {
    toast({
      title: "Integration Disconnected",
      description: `${integration.name} has been disconnected successfully.`,
    });
  };

  const handleConfigure = (integration: typeof integrations[0]) => {
    setSelectedIntegration(integration);
    toast({
      title: "Opening Configuration",
      description: `Configuring ${integration.name} settings...`,
    });
  };

  const handleConnectSubmit = () => {
    setConnectDialogOpen(false);
    toast({
      title: "Integration Connected!",
      description: `${selectedIntegration?.name} has been connected successfully.`,
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-gradient-to-r from-white via-white to-blue-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <div className="p-2 bg-brand-blue-100 rounded-xl">
                  <Plug className="w-5 h-5 text-brand-600" />
                </div>
                Integration Hub
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Connect your favorite tools and services to streamline your operations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="shadow-sm">
                <Key className="w-4 h-4 mr-2" />
                API Keys
              </Button>
              <Button variant="outline" size="sm" className="shadow-sm">
                <Activity className="w-4 h-4 mr-2" />
                Activity Log
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <Card className="p-3 stat-card border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-100 rounded-xl shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{connectedCount}</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 stat-card border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl shadow-sm">
                  <Plug className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{availableCount}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 stat-card border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 rounded-xl shadow-sm">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">1,247</p>
                  <p className="text-xs text-muted-foreground">Syncs Today</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 stat-card border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 rounded-xl shadow-sm">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">99.9%</p>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <cat.icon className="w-4 h-4" />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Integrations</TabsTrigger>
              <TabsTrigger value="connected">Connected ({connectedCount})</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onConnect={() => handleConnect(integration)}
                    onDisconnect={() => handleDisconnect(integration)}
                    onConfigure={() => handleConfigure(integration)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="connected" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredIntegrations
                  .filter((i) => i.status === "connected")
                  .map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      onConnect={() => handleConnect(integration)}
                      onDisconnect={() => handleDisconnect(integration)}
                      onConfigure={() => handleConfigure(integration)}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="recommended" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredIntegrations
                  .filter((i) => i.popular)
                  .map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      onConnect={() => handleConnect(integration)}
                      onDisconnect={() => handleDisconnect(integration)}
                      onConfigure={() => handleConfigure(integration)}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Connect Dialog */}
      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedIntegration && <selectedIntegration.icon className="w-5 h-5 text-brand-600" />}
              Connect {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedIntegration?.id === 'google-maps' 
                ? "Enter your Google Maps Platform API key to enable interactive maps and route visualization."
                : "Enter your credentials to connect this integration to FocusFreight TMS."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Google Maps specific fields */}
            {selectedIntegration?.id === 'google-maps' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="api-key">Google Maps API Key</Label>
                  <Input id="api-key" type="password" placeholder="AIza..." />
                  <p className="text-xs text-muted-foreground">
                    Get your API key from the <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Google Cloud Console</a>
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-sm text-blue-800 mb-2">Required APIs</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Maps JavaScript API</li>
                    <li>• Directions API</li>
                    <li>• Geocoding API</li>
                    <li>• Distance Matrix API (optional)</li>
                  </ul>
                </div>
              </>
            ) : selectedIntegration?.id === 'samsara' || selectedIntegration?.id === 'keeptruckin' || selectedIntegration?.id === 'geotab' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Token</Label>
                  <Input id="api-key" type="password" placeholder="Enter your API token" />
                </div>
                {selectedIntegration?.id === 'geotab' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="database">Database Name</Label>
                      <Input id="database" placeholder="Your Geotab database name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" placeholder="Your Geotab username" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Your Geotab password" />
                    </div>
                  </>
                )}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-medium text-sm text-amber-800 mb-1">ELD Integration</h4>
                  <p className="text-xs text-amber-700">
                    This integration will sync HOS logs, vehicle locations, and driver data.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input id="api-key" type="password" placeholder="Enter your API key" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-secret">API Secret (if required)</Label>
                  <Input id="api-secret" type="password" placeholder="Enter your API secret" />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL (optional)</Label>
              <Input id="webhook-url" placeholder="https://your-webhook-url.com" />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Enable automatic sync</span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Send sync notifications</span>
              </div>
              <Switch />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleConnectSubmit}>
              <Link2 className="w-4 h-4 mr-2" />
              Connect Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
