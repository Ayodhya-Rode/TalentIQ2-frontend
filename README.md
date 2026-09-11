# TalentIQ — Frontend

React frontend for TalentIQ, a mock interview booking platform. Provides five role-specific dashboards, live video interview rooms, and a full public-facing marketing site, with light and dark theming throughout.

**Live App:** https://talentiq2-frontend2.onrender.com
**Backend Repo:** https://github.com/Ayodhya-Rode/TalentIQ-2

## Tech Stack

- **Framework:** React with Vite
- **Styling:** Tailwind CSS, CSS custom properties for theming
- **Routing:** React Router
- **Forms:** React Hook Form
- **HTTP:** Axios, with an interceptor that auto-refreshes expired access tokens and retries failed requests transparently
- **Video:** LiveKit React components
- **Notifications:** React Toastify
- **Icons:** Lucide React

## Public Pages

- **Home** — hero section, feature highlights, platform stats
- **About** — platform background and design philosophy
- **How It Works** — scroll-linked step tracker showing the full candidate journey, with an integrated FAQ accordion

## Authentication

- Register with role selection (Candidate, Employee, Recruiter)
- Login with pending-approval and rejection handling
- Forgot password flow: email entry → 6-digit OTP (auto-advancing input boxes with paste support) → password reset
- Access tokens are held in memory only, never in localStorage; refresh tokens live in an httpOnly cookie

## Dashboards

### Super Admin
- Tabs for Overview (platform stats), 
- Pending Approvals, 
- All Users, 
- Rejected Users, 
- Categories, and Cancellation Warnings
- each user list filterable by role.

### Employee
- Profile creation and editing (including multi-category selection)
- slot management with a one-click "mark day unavailable" option,
- bookings list with cancel/postpone/confirm/feedback actions, 
- live interview join button gated to the correct time window.

### Candidate
- Profile creation and editing with resume upload, 
- category-based employee browsing with Razorpay checkout embedded directly in the flow, 
- bookings list with confirm/rebook/refund actions, and per-booking feedback viewing.

### Recruiter
- Candidate search by skill or designation with a clear button,
- outreach modal showing prior contact history as a soft warning, and a full sent-email history tab.

### Support
- Query overview with total/solved/pending counts, and an in-dashboard change-password form.

## Design

- Full light/dark theme support using CSS variables, applied consistently across every page and component
- Fully responsive layouts across mobile, tablet, and desktop, including collapsible dashboard headers and mobile-friendly navigation


## Setup

Clone and install dependencies:

\`\`\` bash

git clone - https://github.com/Ayodhya-Rode/TalentIQ2-frontend.git

cd TalentIQ2-frontend

npm install
\`\`\`

Create a `.env` file with the following variables:

\`\`\`env

VITE_API=http://localhost:5000/api 

VITE_RAZORPAY_KEY_ID=


\`\`\`

Run the app:

\`\`\`bash
npm run dev
\`\`\`

App runs on `http://localhost:5173`.