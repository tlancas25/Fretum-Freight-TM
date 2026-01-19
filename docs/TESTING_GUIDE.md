# FocusFreight TMS - Private Testing Guide

**Version:** 1.0.0-beta  
**Testing Period:** January 2026

---

## Welcome, Tester! 👋

Thank you for participating in the private testing of FocusFreight TMS. Your feedback is invaluable in helping us create the best transportation management system for owner-operators and small carriers.

---

## Quick Start (5 Minutes)

### Step 1: Access the Application
Open your browser and navigate to:
```
http://localhost:9002
```

### Step 2: Login
- Enter any email (e.g., `test@example.com`)
- Enter any password
- Click "Sign In"
- You'll be redirected to the Dashboard

> **Note:** Authentication is simulated for testing. No real account is required.

### Step 3: Explore the Dashboard
The dashboard shows you:
- Revenue and load statistics
- Active loads in transit
- Top performing drivers
- Recent alerts

---

## Feature Testing Checklist

### 🚛 Loads Management
- [ ] View load board at `/loads` - try the kanban view
- [ ] Click on a load to see detailed view
- [ ] Click "New Load" to test the creation wizard
- [ ] Try the Document AI extraction at `/loads/extract`

### 📋 Dispatch Board
- [ ] Go to `/dispatch`
- [ ] Try dragging loads between columns
- [ ] Click on a load to see driver assignment options

### 📄 BOL Generator
- [ ] Navigate to `/bol`
- [ ] Select a template and try creating a BOL
- [ ] Preview the generated document

### 👥 Customers
- [ ] View customer list at `/customers`
- [ ] Try adding a new customer
- [ ] Search and filter customers

### 🚐 Fleet Management
- [ ] Check `/fleet` for driver/truck/trailer lists
- [ ] Review driver HOS information
- [ ] Check vehicle maintenance status

### 📍 Live Tracking
- [ ] Visit `/tracking`
- [ ] View the fleet map (placeholder if no Google Maps API key)
- [ ] Click on vehicle cards to see details

### 💰 Financial
- [ ] Review invoices at `/invoices`
- [ ] Log expenses at `/expenses`
- [ ] Calculate settlements at `/settlements`
- [ ] Generate IFTA report at `/ifta`

### 📈 Reports
- [ ] View analytics at `/reports`
- [ ] Try different report tabs

### 🔌 Integrations
- [ ] Browse available integrations at `/integrations`
- [ ] Try clicking "Connect" on an integration
- [ ] Review the connection dialog

### ⚙️ Settings
- [ ] Explore settings at `/settings`
- [ ] Try different setting categories

---

## Testing AI Document Extraction

This is our flagship AI feature! Here's how to test it:

1. Go to `/loads/extract`
2. Prepare a rate confirmation PDF (or any freight document)
3. Drag and drop the file onto the upload area
4. Wait for AI extraction (takes a few seconds)
5. Review the extracted information
6. Click "Save as Draft" to create a load

**What to look for:**
- Is the shipper name extracted correctly?
- Are addresses parsed properly?
- Is the rate/payment accurate?
- Are dates formatted correctly?

---

## What to Report

### Bug Reports
Please note:
- **Where:** What page/feature were you testing?
- **What:** What did you expect vs. what happened?
- **Steps:** How can we reproduce the issue?
- **Browser:** What browser are you using?
- **Screenshots:** If possible, attach screenshots

### Feature Feedback
- Is the feature intuitive to use?
- What's missing that you would expect?
- Any suggestions for improvement?
- How does it compare to other systems you've used?

### UI/UX Feedback
- Is the interface easy to navigate?
- Are any elements confusing?
- Is the color scheme and styling appealing?
- Is text readable and buttons clickable?

---

## Known Issues (Don't Report These)

1. **Login always works** - Authentication is simulated
2. **Data resets on refresh** - No persistent database yet
3. **Maps show placeholder** - Google Maps API key not configured
4. **File uploads don't persist** - Storage not connected
5. **Emails don't send** - Email service not connected

---

## Testing Tips

1. **Use Chrome DevTools** - Press F12 to check for console errors
2. **Try edge cases** - Empty forms, long text, special characters
3. **Test navigation** - Use back button, breadcrumbs, sidebar
4. **Check responsiveness** - Resize browser window
5. **Compare to docs** - Reference the Product Documentation

---

## Reporting Issues

### Option 1: GitHub Issues
Create an issue at:
https://github.com/tlancas25/FocusFreight-TMS/issues

### Option 2: Email
Send detailed feedback to:
support@focusfreight.com

### Report Template
```
## Bug Report

**Feature:** [e.g., Load Creation Wizard]
**Page:** [e.g., /loads/new]
**Browser:** [e.g., Chrome 120]

**Description:**
[What happened?]

**Expected:**
[What should have happened?]

**Steps to Reproduce:**
1. [First step]
2. [Second step]
3. [Third step]

**Screenshots:**
[Attach if available]
```

---

## Feature Priority for Feedback

We're especially interested in feedback on these areas:

### High Priority
1. **Document AI Extraction** - Accuracy and usability
2. **Load Management** - Workflow and navigation
3. **Dashboard** - Information layout and usefulness
4. **Dispatch Board** - Drag-and-drop functionality

### Medium Priority
1. **Invoicing** - Invoice creation flow
2. **Fleet Management** - Driver/truck information display
3. **IFTA Reporting** - Tax calculation accuracy
4. **Driver Settlements** - Pay calculation logic

### Lower Priority (But Still Welcome)
1. **UI Polish** - Colors, spacing, animations
2. **Settings** - Configuration options
3. **Reports** - Chart types and data display

---

## Timeline

| Phase | Dates | Focus |
|-------|-------|-------|
| Alpha Testing | Jan 2026 | Core workflows |
| Beta Testing | Feb 2026 | Full feature set |
| UAT | Mar 2026 | Final validation |
| Launch | Apr 2026 | Production release |

---

## Thank You!

Your testing helps us build a better product. Every bug report, suggestion, and piece of feedback makes FocusFreight TMS stronger.

Happy testing! 🚚

---

**FocusFreight TMS** - Built for the modern carrier.
