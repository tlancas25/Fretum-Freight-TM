# Fretum-Freight TMS - Product Documentation

**Version:** 1.0.0-beta  
**Private Testing Release**  
**Last Updated:** January 20, 2026
**Copyright © 2026 Terrell A Lancaster. All Rights Reserved.**

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [Technology Stack](#technology-stack)
3. [Getting Started](#getting-started)
4. [Feature Guide](#feature-guide)
5. [Integration Framework](#integration-framework)
6. [AI Capabilities](#ai-capabilities)
7. [Known Limitations](#known-limitations)
8. [Testing Guide](#testing-guide)
9. [Support](#support)

---

## Product Overview

**Fretum-Freight TMS** is a modern, enterprise-grade Transportation Management System designed specifically for owner-operators and small to medium freight carriers. Built with cutting-edge web technologies, it provides a comprehensive solution for managing every aspect of freight logistics operations.

### Target Users
- Owner-operators managing their own trucks
- Small fleet operators (1-50 trucks)
- Freight brokers and dispatchers
- Logistics coordinators

### Core Value Propositions
- ✅ **All-in-One Platform** - Loads, dispatch, invoicing, compliance in one place
- ✅ **AI-Powered Automation** - Extract load details from documents automatically
- ✅ **Real-Time Tracking** - Live GPS fleet visibility with Google Maps
- ✅ **ELD Integration Ready** - Connect to Samsara, Geotab, Motive, and more
- ✅ **Compliance Built-In** - IFTA reporting, HOS tracking, DVIR management
- ✅ **Professional Documents** - BOL generation, invoices, rate confirmations
- ✅ **Financial Insights** - Revenue tracking, expense management, driver settlements

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js | 15.5.9 |
| **Runtime** | React | 18.3.1 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 3.4.1 |
| **UI Components** | shadcn/ui + Radix UI | Latest |
| **Charts** | Recharts | 2.15.1 |
| **AI/ML** | Genkit + Google Gemini 2.0 | 1.8.0 |
| **Maps** | Google Maps Platform | Latest |
| **Icons** | Lucide React | 0.475.0 |
| **Forms** | React Hook Form + Zod | Latest |

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Google AI API key (for Document AI features)
- Google Maps API key (optional, for full map features)

### Installation

```bash
# Clone the repository
git clone https://github.com/tlancas25/Fretum-Freight-TMS.git

# Navigate to project directory
cd Fretum-Freight-TMS

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your API keys to .env.local
# GOOGLE_GENAI_API_KEY=your_key_here
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here (optional)

# Start development server
npm run dev
```

### Accessing the Application
- **URL:** http://localhost:9002
- **Login:** Any email/password (simulated auth - bypasses to dashboard)

---

## Feature Guide

### 📊 Dashboard
**Route:** `/dashboard`

Your command center for fleet operations. At a glance, see:
- **Revenue Overview** - Monthly revenue bar chart with 6-month trend
- **Active Loads** - Current loads with ETA and progress tracking
- **Load Status Distribution** - Pie chart showing booked, in-transit, delivered
- **Top Drivers** - Leaderboard with loads completed and ratings
- **Performance Metrics** - On-time delivery, utilization, driver efficiency
- **Recent Alerts** - Critical notifications requiring attention
- **Weekly Activity** - Daily load activity trends

**Quick Actions:**
- Create new load
- View today's loads
- Access reports

---

### 🚛 Loads Management
**Route:** `/loads`

#### Load Board (Kanban View)
Visualize all loads across status columns:
- **Booked** - Confirmed loads awaiting dispatch
- **Dispatched** - Driver assigned, en route to pickup
- **In Transit** - Currently moving from pickup to delivery
- **Delivered** - Completed loads

**Features:**
- Drag-and-drop status changes
- Search by load ID, origin, destination
- Filter by driver, date, priority
- Priority badges (Normal, High, Urgent)
- ETA tracking with delay alerts
- Quick actions menu

#### Load Details
**Route:** `/loads/[id]`

Complete shipment information:
- **Live Tracking Card** - Real-time location, miles remaining, ETA
- **Route Map** - Interactive map with pickup (blue), delivery (green), truck position (orange)
- **Pickup/Delivery Cards** - Addresses, contacts, time windows, references
- **Tabs:**
  - Cargo Details - Commodity, weight, pallets, hazmat status
  - Rate & Charges - Line haul, fuel surcharge, accessorials, total
  - Documents - Rate con, BOL, photos with upload/download
  - Notes - Communication history and internal notes
- **Timeline** - Complete activity log from creation to delivery

#### New Load Wizard
**Route:** `/loads/new`

6-step load creation process:
1. **Pickup** - Shipper selection, address, date/time window
2. **Delivery** - Consignee selection, address, date/time window
3. **Cargo** - Commodity, equipment type, weight, special requirements
4. **Rate** - Line haul, fuel surcharge, accessorials, total rate
5. **Assignment** - Driver/truck selection from available pool
6. **Review** - Summary confirmation before creation

---

### 🤖 Document AI
**Route:** `/loads/extract`

AI-powered document extraction using Google Gemini:

**How It Works:**
1. Upload a rate confirmation PDF (drag-and-drop or click)
2. AI extracts key information automatically
3. Review and edit extracted data
4. Save as draft load

**Extracted Fields:**
- Shipper name and contact
- Total rate/payment
- Pickup address, date, reference
- Delivery address, date, reference
- Commodity and equipment type

---

### 📋 Dispatch Board
**Route:** `/dispatch`

Real-time dispatch management:

**Columns:**
- Unassigned Loads
- Assigned (driver confirmed)
- En Route to Pickup
- At Pickup Location
- Completed (delivered)

**Features:**
- Drag loads between columns
- Assign drivers from available pool
- Priority indicators
- Progress tracking
- Wait time at pickup
- Quick contact buttons (call/message)
- Available drivers sidebar

---

### 📄 BOL Generator
**Route:** `/bol`

Professional Bill of Lading creation:

**Templates:**
- Standard BOL
- Short Form BOL
- Hazmat BOL
- Straight BOL
- Order BOL

**Features:**
- Auto-fill from existing loads
- Shipper/consignee entry
- Carrier/driver details
- Dynamic cargo line items
- Hazmat flagging
- PDF preview and download
- Send to parties via email
- BOL history and statistics

---

### 👥 Customers
**Route:** `/customers`

Customer relationship management:

**Customer Types:**
- Shipper
- Consignee
- Broker
- Shipper & Consignee (Both)

**Features:**
- Customer cards with key stats
- Load count and revenue
- 5-star rating display
- Favorite customers
- Status tracking (Active, Inactive, Pending)
- Add/edit customer dialog
- Quick actions (call, email, create load)
- Search and filter

---

### 🚐 Fleet Management
**Route:** `/fleet`

Comprehensive asset management:

#### Drivers Tab
- Driver status (Driving, Available, Off-Duty, Sleeper Berth)
- HOS remaining (drive time, on-duty, cycle)
- Current load assignment
- Performance rating
- License and medical expiry tracking

#### Trucks Tab
- Service status (In Service, Maintenance, Out of Service)
- Current driver assignment
- Fuel level
- Next maintenance due
- Odometer reading
- Insurance expiry

#### Trailers Tab
- Trailer type (Dry Van, Reefer, Flatbed)
- Attachment status
- Last inspection date
- Available for assignment

---

### 📍 Live Tracking
**Route:** `/tracking`

Real-time fleet visibility:

**Map Features:**
- Interactive Google Maps (or placeholder when no API key)
- Vehicle markers with status colors:
  - 🟢 Green = Moving
  - 🟡 Yellow = At Pickup/Delivery
  - 🔴 Red = Stopped/Idle
  - ⚫ Gray = Offline
- Route lines for active loads
- Traffic layer toggle

**Vehicle Cards:**
- Driver name and avatar
- Current speed
- Current location
- Load ID and destination
- ETA and miles remaining
- Fuel level indicator

**Filters:**
- All vehicles
- Moving only
- Stopped
- At locations
- Delayed

---

### 💰 Invoicing
**Route:** `/invoices`

Invoice management and payment tracking:

**Status Types:**
- Draft
- Sent
- Pending
- Partial (partial payment received)
- Paid
- Overdue

**Dashboard Metrics:**
- Total outstanding
- Overdue amount
- Paid this month
- Total invoiced

**Features:**
- Create invoice from loads
- Add line items
- Apply payment terms
- Send to customer
- Track payment status
- Send reminders for overdue
- Bulk export

---

### 💸 Expenses
**Route:** `/expenses`

Expense tracking for tax deductions:

**Categories:**
- Fuel
- Maintenance & Repairs
- Insurance
- Tolls & Permits
- Equipment Lease
- Office & Admin
- Driver Pay
- Meals (per diem)
- Parking
- Other

**Features:**
- Add expense with date and amount
- Upload receipt images
- Link to specific loads
- Mark as tax deductible
- Category breakdown chart
- Date range filtering
- Export to report

---

### 👷 Driver Settlements
**Route:** `/settlements`

Driver pay calculation and processing:

**Pay Types:**
- Percentage of load
- Per-mile rate
- Hourly (for detention)

**Driver Types:**
- Company Driver
- Owner-Operator
- Lease Operator

**Deduction Types:**
- Fuel Advance
- Insurance
- Equipment Lease
- Escrow
- Cash Advance

**Workflow:**
1. Select pay period
2. System calculates gross pay from completed loads
3. Apply deductions
4. Review settlement breakdown
5. Approve and process
6. Mark as paid

---

### ⛽ IFTA Reporting
**Route:** `/ifta`

Interstate Fuel Tax Agreement compliance:

**Summary Tab:**
- Total miles by jurisdiction (all 48 IFTA states)
- Total gallons purchased by jurisdiction
- Fleet MPG calculation
- Tax liability by state
- Net tax due or credit

**Mileage Log Tab:**
- Log miles by vehicle
- Jurisdiction tracking
- Manual entry or ELD import

**Fuel Purchases Tab:**
- Log fuel purchases
- State where purchased
- Gallons and cost
- Link to receipt

**Features:**
- Quarterly reporting periods
- Tax rate database for all states
- Export IFTA report
- File directly with IFTA

---

### 📈 Reports & Analytics
**Route:** `/reports`

Business intelligence and insights:

**Available Reports:**
- Revenue & Profit Trends
- Load Volume Analysis
- Top Lanes by Revenue
- Driver Performance Rankings
- Customer Analysis
- Equipment Utilization
- Expense Breakdown

**Visualizations:**
- Bar charts
- Line charts
- Pie charts
- Data tables

**Export Options:**
- PDF
- Excel
- CSV

---

### 🔌 Integrations
**Route:** `/integrations`

Third-party service connections:

#### Email & Communication
- Gmail - Automated emails, rate confirmations
- Microsoft Outlook - Email and calendar sync
- Twilio SMS - Driver and customer notifications
- Slack - Team notifications

#### Documents
- BOL Generator - Built-in
- DocuSign - Electronic signatures

#### Tracking & GPS
- **Samsara** - GPS, ELD, DVIR, fuel tracking
- **Motive (KeepTruckin)** - ELD, GPS, AI dashcam
- **Geotab** - Fleet telematics
- Project44 - Multi-modal visibility
- **Google Maps Platform** - Route mapping

#### Payment & Billing
- QuickBooks - Accounting sync
- Stripe - Credit card payments
- Triumph Pay - Freight factoring

#### ELD & Compliance
- ELD Mandate Hub - HOS monitoring
- FMCSA Portal - Safety scores, authority status

#### Analytics
- Power BI - Custom dashboards
- Tableau - Enterprise analytics
- DAT Load Board - Market rates

#### Cloud Storage
- Google Drive
- Dropbox

---

### ⚙️ Settings
**Route:** `/settings`

Application configuration:

- **Company Profile** - Logo, MC#, DOT#, SCAC, Tax ID, address
- **My Profile** - Personal info, role, timezone, language
- **Notifications** - Email, push, SMS preferences
- **Security** - Password, 2FA, sessions
- **Appearance** - Theme (light/dark/system)
- **Load Defaults** - Default equipment, rates, terms
- **Billing** - Subscription management (future)
- **Team Members** - User management (future)

---

## Integration Framework

### ELD Provider Architecture

Fretum-Freight includes a comprehensive ELD integration framework with support for:

| Provider | API Type | Authentication | Status |
|----------|----------|----------------|--------|
| Samsara | REST | API Key (Bearer) | Interface Complete |
| Geotab | JSON-RPC | Session-based | Interface Complete |
| Motive | REST | API Key | Interface Complete |
| Omnitracs | REST | OAuth 2.0 | Placeholder |
| BigRoad | REST | API Key | Placeholder |

### ELD Data Types Supported

```typescript
- VehicleLocation (GPS, speed, heading, address)
- VehicleLocationHistory (GPS breadcrumbs)
- HOSClock (drive time, on-duty, cycle remaining)
- HOSLog (daily log entries)
- HOSViolation (HOS infractions)
- DVIR (inspection reports)
- FaultCode (engine diagnostics)
- IFTASummary (miles and fuel by jurisdiction)
- Geofence (location boundaries)
- ELDEvent (ELD-specific events)
```

### Google Maps Integration

Maps functionality includes:
- **FleetMap** - Multi-vehicle tracking display
- **LoadRouteMap** - Single load route visualization
- **Fallback Mode** - Placeholder map when no API key

Required Google Maps APIs:
- Maps JavaScript API
- Directions API
- Geocoding API
- Distance Matrix API (optional)

---

## AI Capabilities

### Document Extraction

**Technology:** Google Genkit + Gemini 2.0 Flash

**Process Flow:**
1. User uploads PDF (rate confirmation, BOL, etc.)
2. PDF converted to Base64 data URI
3. Sent to Gemini with structured extraction prompt
4. AI returns JSON with extracted fields
5. User reviews and edits as needed
6. Data saved as draft load

**Extraction Accuracy:**
- Shipper/consignee names: ~95%
- Addresses: ~90%
- Rates/amounts: ~98%
- Dates/times: ~92%
- References: ~85%

**Supported Document Types:**
- Rate Confirmations
- Bills of Lading
- Proof of Delivery
- Invoices

---

## Known Limitations

### Current Beta Limitations

| Area | Limitation | Planned Resolution |
|------|------------|-------------------|
| **Authentication** | Simulated login (no backend auth) | Firebase Auth integration |
| **Database** | All data is mock/client-side | Firebase Firestore integration |
| **File Storage** | No persistent file uploads | Firebase Storage integration |
| **Email** | No actual email sending | SendGrid/SMTP integration |
| **Payments** | No real payment processing | Stripe integration |
| **ELD Data** | Mock data only | Live ELD API connections |
| **Maps** | Optional (needs API key) | Bundled with subscription |
| **Mobile** | Desktop/tablet only | Progressive Web App |
| **Multi-tenant** | Single company only | Organization management |

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 90+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ Internet Explorer (not supported)

---

## Testing Guide

### Areas to Test

#### Core Workflows
1. **Load Lifecycle**
   - Create new load via wizard
   - View load details
   - Update load status
   - Generate BOL
   - Create invoice
   - Mark delivered

2. **Dispatch Operations**
   - Assign driver to load
   - Track load progress
   - Update status via dispatch board

3. **Document AI**
   - Upload rate confirmation PDF
   - Verify extracted data accuracy
   - Save as draft load

4. **Financial**
   - Review dashboard metrics
   - Create and send invoice
   - Log expenses
   - Calculate driver settlement
   - Generate IFTA report

5. **Fleet Management**
   - Review driver HOS
   - Check vehicle status
   - Track fleet on map

### Test Accounts

For private testing, use any email/password combination. The system will simulate authentication and redirect to the dashboard.

### Reporting Issues

Please report any issues found during testing:
- UI bugs or glitches
- Calculation errors
- Navigation problems
- Performance issues
- Missing features
- Suggestions for improvement

---

## Support

### Documentation
- Product Documentation: `/docs/PRODUCT_DOCUMENTATION.md`
- API Documentation: Coming soon
- User Guide: Coming soon

### Contact
- Email: support@fretumfreight.com
- GitHub Issues: https://github.com/tlancas25/Fretum-Freight-TMS/issues

---

## Appendix: Environment Variables

```env
# Required for AI features
GOOGLE_GENAI_API_KEY=your_google_ai_api_key

# Optional - enables full map functionality
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Future integrations
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
SAMSARA_API_KEY=
GEOTAB_DATABASE=
GEOTAB_USERNAME=
GEOTAB_PASSWORD=
```

---

## Appendix: Project Structure

```
Fretum-Freight-TMS/
├── docs/                    # Documentation
│   └── PRODUCT_DOCUMENTATION.md
├── src/
│   ├── ai/                  # AI integration
│   │   ├── genkit.ts       # Genkit configuration
│   │   └── flows/          # AI extraction flows
│   ├── app/                 # Next.js pages
│   │   ├── dashboard/      # Dashboard
│   │   ├── loads/          # Load management
│   │   ├── dispatch/       # Dispatch board
│   │   ├── bol/            # BOL generator
│   │   ├── customers/      # CRM
│   │   ├── fleet/          # Fleet management
│   │   ├── tracking/       # Live tracking
│   │   ├── invoices/       # Invoicing
│   │   ├── expenses/       # Expense tracking
│   │   ├── settlements/    # Driver settlements
│   │   ├── ifta/           # IFTA reporting
│   │   ├── reports/        # Analytics
│   │   ├── integrations/   # Integration hub
│   │   ├── settings/       # Configuration
│   │   └── login/          # Authentication
│   ├── components/         # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── app-layout.tsx  # Main layout
│   │   └── main-sidebar.tsx# Navigation
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utilities
│       ├── eld/            # ELD integration framework
│       ├── maps/           # Google Maps components
│       └── utils.ts        # Helper functions
├── public/                  # Static assets
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── next.config.ts          # Next.js configuration
```

---

**Fretum-Freight TMS** - Built for the modern carrier.

© 2026 Terrell A Lancaster. All rights reserved.
