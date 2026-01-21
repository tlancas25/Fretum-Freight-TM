# Fretum-Freight TMS

**Enterprise Transportation Management System**

A modern, full-featured TMS built for freight and logistics companies. Streamline your operations with real-time tracking, dispatch management, invoicing, and comprehensive analytics.

Copyright © 2026 Terrell A Lancaster. All rights reserved.
See [LICENSE](LICENSE) for details.

## 🚀 Features

### Core Modules
- **Dashboard** - Real-time KPIs, revenue charts, active loads tracking, performance metrics
- **Load Management** - Kanban board view, status tracking, load details, document extraction
- **Dispatch Board** - Visual dispatch management, driver assignment, real-time status updates
- **Fleet Management** - Driver and truck management, HOS tracking, equipment status
- **Invoicing** - Create, send, and track invoices with payment status
- **Customer Management** - Customer database, contact management, load history
- **Reports & Analytics** - Revenue trends, driver performance, lane analysis, expense tracking

### Additional Features
- **Document AI** - Extract load details from PDF rate confirmations automatically
- **BOL Generator** - Create and manage Bills of Lading
- **Integration Hub** - Connect with ELD providers, accounting software, and more
- **Settings** - Company profile, user preferences, notification settings

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: Shadcn/UI + Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts
- **AI Features**: Google Genkit for document processing
- **TypeScript**: Full type safety throughout

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/tlancas25/Fretum-Freight-TMS.git

# Navigate to project directory
cd Fretum-Freight-TMS

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:9002`

## 🎨 Design System

The app uses a professional enterprise color scheme:
- **Primary (Brand)**: Blue (#0066CC) - Used for primary actions, links, and branding
- **Success**: Green (#10B981) - Delivery confirmations, positive metrics
- **Warning**: Amber (#F59E0B) - Delays, pending items
- **Danger**: Red (#EF4444) - Errors, overdue items

## 📱 Pages Overview

| Route | Description |
|-------|-------------|
| `/` | Redirects to dashboard |
| `/login` | Authentication page |
| `/dashboard` | Main dashboard with KPIs and charts |
| `/loads` | Load management with Kanban view |
| `/loads/extract` | AI-powered document extraction |
| `/dispatch` | Dispatch board for load assignment |
| `/fleet` | Fleet management (drivers, trucks, trailers) |
| `/customers` | Customer database and management |
| `/invoices` | Invoice creation and tracking |
| `/reports` | Analytics and reporting |
| `/bol` | Bill of Lading generator |
| `/integrations` | Third-party integration hub |
| `/settings` | Application settings |

## 🧪 Alpha Testing

This is an alpha release. Please report any bugs or issues to the development team.

### Known Limitations
- Authentication is simulated (no backend integration yet)
- Data is static/sample data
- Some actions trigger toast notifications only

### Feedback
We welcome feedback on:
- UI/UX improvements
- Missing features
- Performance issues
- Accessibility concerns

## 📄 License

Copyright © 2026 Terrell A Lancaster. All rights reserved.
This software is proprietary. See [LICENSE](LICENSE) for details.
