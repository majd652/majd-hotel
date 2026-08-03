🏨 Majd Hotel — Hotel Management System

A responsive Hotel Management System built with Angular as a frontend developer technical assessment. It demonstrates reusable components, reactive state management with Signals, mock API integration, form validation, and a fully responsive UI.

📖 Overview

Majd Hotel is an admin dashboard that lets hotel staff manage properties, rooms, and guest bookings from one place. It is built entirely with standalone Angular components (no NgModules) and Signals for state management — no external UI library (e.g. Bootstrap, Angular Material) was used, since building the reusable components by hand was part of the assessment.

The app talks to a mock REST API powered by json-server, so it behaves like a real client–server application (loading states, success/error handling, HTTP requests) without needing a real backend.

Two roles are supported:

Admin — full access, including Hotel & Room management
Manager — can view the dashboard and manage bookings, but not hotels/rooms
✨ Key Features
🔐 Authentication — mock login with validation and protected/guarded routes
📊 Dashboard — summary cards (Total Hotels, Total Rooms, Available Rooms, Revenue)
🏨 Hotel Management — searchable/sortable list, Add/Edit/Delete with validation and a confirmation dialog before deleting
🛏️ Room Management — Add/Edit/Delete rooms (room number, type, capacity, price, availability), linked to a hotel
📝 Booking Module — booking form with live summary (nights, 10% tax, optional discount, total) and validation
📖 Booking History — search, filter by status, and pagination
🧩 15 reusable components built from scratch (see below)
📱 Fully responsive — desktop, tablet, and mobile
⚡ Lazy-loaded routes for every page
🛡️ Role-based route guards (bonus)
🛠️ Tech Stack

Layer	Technology
Framework	Angular (standalone components, Signals, new @if/@for control flow)
Forms	Angular Reactive Forms
HTTP	Angular HttpClient + functional interceptors
Styling	SCSS with a centralized design-token system (CSS custom properties)
Mock API	json-server
State	Angular Signals (signal, computed, model) — no NgRx/external store needed

📁 Project Structure
src/
├── app/
│   ├── core/
│   │   ├── guards/          # authGuard, guestGuard, roleGuard
│   │   ├── interceptors/    # auth token + global error handling
│   │   └── services/        # Auth, Hotel, Room, Booking, Toast
│   ├── models/               # TypeScript interfaces (Hotel, Room, Booking, User...)
│   ├── shared/
│   │   ├── components/       # 15 reusable UI components
│   │   ├── styles/           # shared SCSS partials
│   │   └── utils/            # booking calculator, CVA base, constants
│   ├── layout/
│   │   └── main-layout/      # Sidebar + Header wrapper for protected pages
│   ├── pages/                # Login, Dashboard, Hotels, Rooms, Bookings, Booking History
│   ├── app.routes.ts
│   └── app.config.ts
├── environments/
└── styles.scss                # global design tokens

mock-api/
└── db.json                    # mock data: users, hotels, rooms, bookings

Reusable components :

Button · Input · Dropdown · Date Picker · Modal · Data Table · Dashboard Card · Loader · Toast · Empty State · Breadcrumb · Sidebar · Header · Pagination · Search
                        
🚀 Getting Started

Prerequisites
Node.js (v18.19+ recommended)
npm
1. Install dependencies
bash
npm install
2. Run the mock API

The app expects the mock API on http://localhost:3000. In one terminal:

bash
npm run mock-api
3. Run the Angular app

In a second terminal:

bash
npm start

Then open http://localhost:4200 in your browser.

Both servers must be running at the same time — the app will not load data without the mock API.

🔑 Demo Accounts
Role	Email	Password
Admin	admin@majdhotel.com	Admin@123
Manager	manager@majdhotel.com	Manager@123


🧭 Usage
Sign in with one of the demo accounts above.
Dashboard shows a live summary pulled from the mock API (hotels, rooms, availability, revenue).
Hotels / Rooms (admin only) — add, edit, or delete records through a modal form with validation; deleting asks for confirmation first.
New Booking — pick a hotel, then an available room in that hotel, choose dates and an optional discount; the price summary (nights, tax, discount, total) updates live as you type.

Booking History — search by customer/hotel, filter by status, and page through results.

📝 Notes & Assumptions
Mock authentication: json-server has no real auth endpoint, so login looks up the user by email and compares the password on the client side, then generates a fake token stored in localStorage. In a real application this check — and the token issuance — would happen on the server.
Role split: Admin manages hotel/room inventory; Manager handles bookings. Both roles can view the dashboard.
Pagination on Booking History is client-side (all bookings are fetched once, then sliced per page), which is appropriate for the size of the mock dataset.
Tax rate is fixed at 10% as specified in the assessment, defined in one place (shared/utils/booking-calculator.ts) and reused by both the live booking preview and the booking service.

No external UI/component library was used intentionally, since building the reusable components was a core requirement of the assessment.
👤 Author

Built by Majd as a frontend developer technical assessment.