# Changelog

All notable changes to Fretum-Freight TMS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0-beta] - 2026-01-19

### 🎉 Initial Beta Release

This is the first private beta release of Fretum-Freight TMS, featuring a complete UI implementation with mock data.

### Added

#### Core Platform
- Next.js 15 application with App Router and Turbopack
- TypeScript for full type safety
- Tailwind CSS with custom enterprise design system
- shadcn/ui component library (30+ components)
- Responsive sidebar navigation with collapse functionality
- Global search bar in header
- Toast notification system
- Loading states and skeletons

#### Dashboard (`/dashboard`)
- Real-time KPI cards (Revenue, Active Loads, Available Trucks, Delivered)
- Monthly revenue bar chart
- Load status distribution pie chart
- Active loads table with ETA tracking
- Top drivers leaderboard
- Performance metrics section
- Weekly activity chart
- Recent alerts feed

#### Load Management (`/loads`)
- Kanban board view with 4 status columns
- Load cards with driver, route, and priority info
- Drag-and-drop status updates
- Search and filter functionality
- Priority badges (Normal, High, Urgent)
- Quick actions menu

#### Load Details (`/loads/[id]`)
- Comprehensive load information display
- Live tracking card with miles remaining and ETA
- Interactive route map (LoadRouteMap component)
- Pickup and delivery cards with contacts
- Tabbed interface: Cargo, Rate, Documents, Notes
- Activity timeline
- Print, share, duplicate, edit actions

#### New Load Wizard (`/loads/new`)
- 6-step creation wizard
- Customer/shipper selection
- Address entry with validation
- Equipment type selection (10 types)
- Accessorial charges toggles
- Driver assignment from available pool
- Rate calculation with RPM display
- Save as draft option

#### Document AI (`/loads/extract`)
- PDF upload via drag-and-drop
- Google Genkit + Gemini 2.0 Flash integration
- Automatic extraction of shipper, rate, addresses
- Review/edit extracted data
- Save as draft load

#### Dispatch Board (`/dispatch`)
- 5-column dispatch workflow
- Drag-and-drop load assignment
- Driver assignment dialog
- Priority indicators
- Progress tracking
- Available drivers sidebar

#### BOL Generator (`/bol`)
- 5 BOL templates
- Auto-fill from existing loads
- Dynamic cargo line items
- Hazmat flagging
- PDF preview dialog
- Download and email options
- BOL history/statistics

#### Customer Management (`/customers`)
- Customer cards with stats
- Status badges (Active, Inactive, Pending)
- Type badges (Shipper, Consignee, Broker)
- 5-star rating display
- Favorite toggle
- Add/edit customer dialog
- Search and filter

#### Fleet Management (`/fleet`)
- Drivers tab with HOS tracking
- Trucks tab with service status
- Trailers tab with availability
- Driver status badges
- License/medical expiry tracking
- Maintenance scheduling

#### Live Tracking (`/tracking`)
- FleetMap component with Google Maps
- Vehicle markers with status colors
- Vehicle list with details
- Status filtering
- Speed, fuel, temperature indicators
- Placeholder map when no API key

#### Invoicing (`/invoices`)
- Invoice list with status filtering
- KPI cards (Outstanding, Overdue, Paid, Total)
- Create invoice dialog
- Line item management
- Payment tracking
- Send reminders
- Bulk actions

#### Expenses (`/expenses`)
- Expense entry dialog
- 10 expense categories
- Link to specific loads
- Tax deductible toggle
- Category breakdown chart
- Receipt upload (UI)
- Date range filtering
- Export functionality

#### Driver Settlements (`/settlements`)
- Settlement calculation by driver
- Pay type support (percentage, per-mile)
- Driver type support (company, owner-op, lease)
- Automatic deduction calculation
- Settlement approval workflow
- Pay period selection
- Settlement history

#### IFTA Reporting (`/ifta`)
- Quarterly reporting dashboard
- All 48 IFTA states with tax rates
- Mileage log entry
- Fuel purchase tracking
- Tax liability calculation
- MPG calculation
- Net tax due/credit
- Export IFTA report

#### Reports & Analytics (`/reports`)
- Revenue & Profit trends
- Load volume analysis
- Top Lanes report
- Driver Performance rankings
- Customer Analysis
- Equipment Utilization
- Expense Breakdown
- Multiple chart types
- Export options (PDF, Excel, CSV)

#### Integration Hub (`/integrations`)
- 20+ available integrations
- 7 categories (Email, Documents, Tracking, Payment, ELD, Analytics, Storage)
- Connection status management
- API key entry dialogs
- Custom dialogs for ELD providers
- Google Maps Platform integration
- Popular integration badges

#### Settings (`/settings`)
- Company profile management
- Personal profile settings
- Notification preferences
- Security settings (UI)
- Appearance/theme toggle
- Load defaults
- Billing (placeholder)
- Team members (placeholder)

#### Authentication (`/login`)
- Login form with validation
- Show/hide password
- Remember me checkbox
- Social login buttons (UI)
- Branded left panel
- Simulated authentication

### Technical Additions

#### ELD Integration Framework (`/lib/eld/`)
- `IELDProvider` interface with 40+ methods
- Samsara provider implementation
- Geotab provider implementation
- Motive (KeepTruckin) provider implementation
- Comprehensive TypeScript types for all ELD data
- ELDService singleton for provider management

#### Google Maps Integration (`/lib/maps/`)
- `FleetMap` component for multi-vehicle tracking
- `LoadRouteMap` component for single load routes
- Traffic layer support
- Custom truck markers
- Graceful fallback without API key

#### AI Integration (`/ai/`)
- Genkit configuration
- `extractLoadDetails` flow
- PDF to structured data extraction
- Error handling

### Changed
- Updated from initial prototype to full beta
- Enhanced visual design with gradients and shadows
- Improved card hover effects
- Refined sidebar scrollbar styling
- Removed "System Online" status indicator

### Security
- Environment variable support for API keys
- No sensitive data in client-side code

---

## [0.1.0] - 2026-01-01

### Added
- Initial project setup
- Basic routing structure
- Core UI components

---

## Roadmap

### v1.1.0 (Planned - February 2026)
- [ ] Firebase authentication integration
- [ ] Firestore database for persistence
- [ ] Real ELD API connections
- [ ] Email notifications via SendGrid
- [ ] File upload to Firebase Storage

### v1.2.0 (Planned - March 2026)
- [ ] QuickBooks integration
- [ ] Stripe payment processing
- [ ] Mobile responsive improvements
- [ ] Dark mode completion

### v2.0.0 (Planned - Q2 2026)
- [ ] Multi-tenant support
- [ ] Team/organization management
- [ ] Advanced reporting with custom queries
- [ ] Mobile app (React Native)
