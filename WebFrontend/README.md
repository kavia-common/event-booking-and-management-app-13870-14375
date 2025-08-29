# Evently Web Frontend (React)

Role-based SPA for attendees, organizers, and admins with authentication, event discovery, booking with seat selection, dashboards, admin tools, and notifications.

## Features

- Authentication: register, login, logout, role switch (attendee/organizer/admin)
- Event discovery: search and filter with responsive cards
- Booking: real-time seat selection UI and booking flow (reservation -> booking)
- Organizer: dashboard and venue management
- Admin: dashboard, users, venues, events, notifications
- Notifications Center: list and trigger notifications
- Responsive, accessible UI with keyboard focus and ARIA where applicable
- Environment-configurable API base URL

## Quickstart

1) Copy env and set API Gateway base URL:
```
cp .env.example .env
# edit .env to set REACT_APP_API_BASE_URL (e.g., http://localhost:3001)
```

2) Install dependencies:
```
npm install
```

3) Start development server:
```
npm start
```
Open http://localhost:3000

## Environment variables

- REACT_APP_API_BASE_URL: Base URL of the API Gateway (required)
- REACT_APP_SITE_URL: Optional site URL for redirects

## Project structure (key files)

- src/services/api.js: API client wrapper for User/Booking/Admin/Venue/Notification services
- src/context/AuthContext.js: Auth state, token handling, role switching
- src/components/Navbar.js: Navigation with role selector
- src/components/ProtectedRoute.js: Route guard by role
- src/pages/*: Feature pages for events, booking, organizer, admin, notifications
- src/App.js: Routes and theme switch

## Notes on APIs

This frontend expects an API Gateway with routes compatible with the provided OpenAPI stubs in the repository. For demo, event lists use placeholder data while booking, venues, admin, and notifications integrate with respective service endpoints. Adjust src/services/api.js if your gateway prefixes differ.

## Accessibility

- Labels on form controls
- ARIA attributes for seat selection and alerts
- Keyboard navigable buttons and controls

## Scripts

- npm start
- npm test
- npm run build

Note: The project auto-updates Browserslist data during installation to keep caniuse-lite current for consistent builds. If offline environments block this, you can remove the postinstall and run `npx update-browserslist-db@latest` manually when online.

