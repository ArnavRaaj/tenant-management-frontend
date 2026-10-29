# 🖥️ Nivaasa (निवास) — Frontend Web Application & Control Tower

> **Modern, High-Performance Multi-Tenant Property Operating System & Resident Portal**
> Built with **Next.js 16 (App Router), React 19, TypeScript 5, Material-UI (MUI v6), and Redux Toolkit**.

[![Next.js](https://img.shields.io/badge/Next.js-16.1%20App%20Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Material-UI](https://img.shields.io/badge/Material--UI-v6-007FFF?style=flat-square&logo=mui)](https://mui.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux)](https://redux-toolkit.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 🏛️ Application Architecture

The frontend follows Next.js 16 App Router principles with a clean modular separation of public resident flows, authenticated administrative dashboards, state slices, and semantic design tokens:

```text
src/
├── app/                           # Next.js App Router (Pages & Layouts)
│   ├── page.tsx                   # Nivaasa Interactive Landing Page with Live Demo Tabs
│   ├── layout.tsx                 # Root HTML & Metadata Layout ("Nivaasa")
│   ├── kyc/                       # Public Tenant Onboarding Flow (Zero App Download)
│   │   ├── page.tsx               # KYC Verification Guidance & Lookup
│   │   └── [token]/page.tsx       # 1-Click Aadhaar e-KYC Verification Portal
│   ├── login/                     # Secure Authentication Portal
│   ├── signup/                    # Superadmin Registration (Password Criteria & Email OTP)
│   ├── verify-email/              # 6-Digit Email OTP Verification Screen
│   ├── forgot-password/           # 3-Step Email OTP Password Reset Flow
│   ├── accept-invitation/         # Delegated Admin Staff Credential Setup
│   └── admin/                     # Protected Property Management Control Tower
│       ├── page.tsx               # Admin Navigation Router
│       ├── dashboard/             # Financial Analytics, Revenue Breakdown & Floor Yields
│       ├── flats/                 # Dynamic Building Floor & Flat Inventory Grid
│       │   └── [id]/              # Flat Deep-Dive: Occupancy, KYC Status & Vacancy Gaps
│       ├── tenants/               # Tenant Directory, Rent Modals, Digital Receipts
│       ├── maintenance/           # Maintenance Ticket Kanban & Action Desk
│       └── users/                 # Delegated Property Manager Directory & Invites
├── components/                    # Reusable UI Components
│   ├── AppLayout.tsx              # Responsive Sidebar, Topbar, Role Badges & Navigation Guard
│   ├── SnackbarProvider.tsx       # Centralized Gradient Toast Alert System
│   └── AddressForm.tsx            # Indian Address Sub-form with Pincode Validation
├── store/                         # Redux Toolkit Global State
│   ├── store.ts                   # Store Configuration
│   ├── authSlice.ts               # User Session & Role Permissions
│   ├── flatSlice.ts               # Dynamic Building Floors & Flat Inventory
│   ├── tenantSlice.ts             # Tenant Records, Arrears & Instant Payment Updates
│   ├── dashboardSlice.ts          # Monthly Revenue Metrics & Collection Breakdown
│   └── themeSlice.ts              # Persistent Light / Dark Mode State
└── theme/                         # Design System & MUI Configuration
    ├── ThemeRegistry.tsx          # Palette Augmentation, Overrides & Semantic Tokens
    └── EmotionCache.tsx           # SSR Emotion Style Cache
```

---

## 🎨 Semantic Token Design System (Light & Dark Mode)

### 1. Strict Zero-Hardcoded Colors Policy
To ensure visual consistency, the application strictly uses **MUI Theme Palette Tokens**:
- **Text:** `text.primary`, `text.secondary`, `text.disabled`
- **Surfaces:** `background.default`, `background.paper`, `action.hover`, `action.selected`
- **Borders & Dividers:** `divider`
- **Functional Semantics:** `primary.main`, `success.main`, `warning.main`, `error.main`, `info.main`
- **Contrast Text:** `primary.contrastText`

### 2. Custom Palette Augmentation
Extended Material-UI's core `Palette` interface to provide harmonious accent tokens across both light surfaces and deep dark backgrounds:

```typescript
declare module "@mui/material/styles" {
  interface Palette {
    accent: {
      cyan: string;
      emerald: string;
      amber: string;
      purple: string;
      pink: string;
      indigo: string;
      red: string;
    };
  }
}
```

### 3. Persistent Theme Preference
- Instant toggle between light mode and luminous dark mode from the top bar.
- Synced to Redux (`themeSlice`) and `localStorage` with zero layout shift during server-side hydration.

---

## 🌟 Key Functional Modules

### 1. 🪪 Public 1-Click Aadhaar e-KYC Portal (`/kyc/:token`)
- **Zero App Download / Zero Passwords:** Tenants open a direct link sent to their WhatsApp.
- **Card-Style Guided Flow:**
  - Displays assigned flat number, floor, building name, and tenant name.
  - Step 1: Input 12-digit Aadhaar number with real-time formatting.
  - Step 2: Input 6-digit OTP received via mobile.
  - Step 3: Displays verified identity card (Government Name, Masked Aadhaar, DOB, Gender, and Verified Address) with a green `VERIFIED` security seal.
- Seamlessly switches between the free offline mock provider and live DigiLocker/UIDAI via Surepass.

### 2. 💵 Multi-Mode Rent Collection & Dynamic State (`/admin/tenants`)
- **Indian Payment Mode Selector:** Supports `CASH`, `DIRECT_UPI` (GPay/PhonePe), `BANK_TRANSFER` (NEFT/IMPS), and `CHEQUE`.
- **Dynamic State Management:**
  - When rent is marked as collected, the button transforms dynamically from `Receive Rent` (contained green) to `Rent Received ✓` (outlined tinted green with checkmark icon) with zero-latency Redux dispatch.
  - Button remains clickable so managers can still view history or record advance rent.
- **Auto-Generated Digital Receipt Dialog:**
  - Formats unique receipt number (e.g. `REC-202610-8A2F`), period, payment mode, and remaining balance.
  - **1-Click Share on WhatsApp:** Formats a pre-filled WhatsApp message URL:
    ```text
    🧾 *RENT RECEIPT #REC-202610-8A2F*
    Flat: 302 | Rahul Sharma
    Amount Received: ₹15,000 via DIRECT UPI
    Period: October 2026
    ...
    ```
  - **Print Slip Button:** Opens native browser print preview.

### 3. 🛠️ Chat-to-Ticket Maintenance Desk (`/admin/maintenance`)
- Triage board displaying issues submitted by residents via WhatsApp or the portal.
- **Visual Urgency Badges:** `EMERGENCY` (red pulse), `HIGH` (orange), `MEDIUM` (blue), `LOW` (gray).
- **Category Chips:** `PLUMBING`, `ELECTRICAL`, `CARPENTRY`, `APPLIANCE`, `CIVIL`, `OTHER`.
- **Status Workflow:** One-click status updates (`OPEN` → `IN_PROGRESS` → `RESOLVED`).
- Filter tickets by category, search by tenant or issue text.

### 4. 🏢 Dynamic Building Floor & Flat Grid (`/admin/flats`)
- Floors are loaded dynamically from `/api/flats/meta/floors` into `flatSlice`, allowing property owners to manage custom building heights (Basement, Ground, 1st to 20th floors) without frontend code redeployments.
- Visual occupancy status badges (Vacant vs Occupied), KYC status indicators, and monthly rent tags.

### 5. 📊 Real-Time Financial Analytics (`/admin/dashboard`)
- Built with **Recharts**:
  - **Monthly Revenue Curve:** Cash flow trends across tenancy months.
  - **Floor-wise Collection Yields:** Visual breakdown of collection performance by floor.
  - **Occupancy Gauges:** Live percentage metric of occupied vs vacant units.

---

## 🚀 Getting Started

### 1. Installation
```bash
cd tenant-management-frontend
npm install
```

### 2. Environment Variables
Create `.env` in `tenant-management-frontend`:
```ini
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

### 4. Build for Production
```bash
npm run build
npm start
```

### Production Build Verification (Next.js 16 Turbopack)
```text
✓ Compiled successfully in 54s
✓ Running TypeScript ...
✓ Generating static pages using 7 workers (16/16) in 1.5s
✓ Finalizing page optimization ...

Route (app)
┌ ○ /                              (Landing Page)
├ ○ /kyc                           (KYC Verification Portal)
├ ƒ /kyc/[token]                   (Dynamic 1-Click Tenant KYC)
├ ○ /admin/dashboard               (Revenue Analytics)
├ ○ /admin/flats                   (Building & Flat Grid)
├ ƒ /admin/flats/[id]              (Flat Occupancy & History)
├ ○ /admin/tenants                 (Rent & Tenant Operations)
├ ○ /admin/maintenance             (Maintenance Ticket Desk)
├ ○ /admin/users                   (Admin Staff Directory)
├ ○ /login                         (Sign In)
└ ○ /signup                        (Superadmin Registration)
```

---

## 🛠️ Scripts Reference

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Start development server with hot-module reload |
| `npm run build` | `next build` | Next.js production build & TypeScript validation |
| `npm start` | `next start` | Start production Next.js server |
| `npm run lint` | `eslint .` | Lint and validate React code quality |
