# Hubs Network - Interactive Prototype

A frontend-only interactive prototype for the **Hubs Network** residency platform, built with Next.js, TypeScript, and Tailwind CSS.

## Overview

Hubs Network is a decentralized platform connecting:
- **Hubs**: Physical spaces offering residencies and resources
- **Pilgrims**: Independent workers, artists, and creators
- **Patrons**: Organizations funding and supporting residency programs

The platform features a **credit-based economy** with quarterly seasonal disbursement and a complete residency lifecycle from application to completion.

## Features

### Complete Residency Lifecycle
1. **Create**: Hubs create residency opportunities (open or specific)
2. **Apply**: Pilgrims submit applications
3. **Vouch**: Patrons support promising applications with fiat or tokens
4. **Choose**: Hubs select a pilgrim
5. **Chat**: Private discussion of terms
6. **Handshake**: Cryptographic checksum agreement
7. **Run**: Shared logging and updates
8. **Close**: Evaluation and credit distribution
9. **Feedback**: Pilgrim agreement/dispute mechanism

### Credit System
- **Hubs**: Receive 100 credits per season to allocate to residencies
- **Pilgrims**: Earn credits based on residency scores, spend on hub services
- **Degradation**: Pilgrim credits degrade 10% after 12 seasons of inactivity
- **Seasons**: Quarterly cycles with minting and economic tracking

### Three Dashboards
- **Hub Dashboard**: Manage residencies, menu items, chat, handshakes, evaluations
- **Pilgrim Dashboard**: Apply to residencies, spend credits, provide feedback
- **Patron Dashboard**: Browse residencies and vouch for applications

### Additional Features
- Interactive map visualization with color-coded hub status
- Session switching to experience different roles
- LocalStorage persistence (optional)
- Complete mock database with seed data
- Simulated transactions and checksums

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data**: In-memory mock database with localStorage persistence

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to view the app.

## Project Structure

```
/app                    # Next.js App Router pages
  /hubs                 # Hub pages (list, register, login, profile, dashboard)
  /pilgrims             # Pilgrim pages (list, register, login, profile, dashboard)
  /patrons              # Patron pages (list, register, login, profile, dashboard)
  /seasons              # Seasons page
  /map                  # Map visualization
  /settings             # Settings & debug tools
  layout.tsx            # Root layout with navigation
  page.tsx              # Landing page

/components             # React components
  /ui                   # Reusable UI components
  /hub                  # Hub-specific components
  Navbar.tsx            # Main navigation
  SessionSwitcher.tsx   # Role switching component

/lib                    # Core logic
  types.ts              # TypeScript type definitions
  mockDb.ts             # Mock database layer with CRUD operations
  seed.ts               # Seed data
  utils.ts              # Utility functions

/store                  # Zustand state management
  useStore.ts           # Global store (session, toasts, modal)

/public                 # Static assets
```

## How to Use

### Switching Sessions

You can switch roles in two ways:

1. **Session Switcher** (top-right corner): Quick switch between all available entities
2. **Login Pages**: Dedicated login pages for each role:
   - `/hubs/login` - Login as a Hub
   - `/pilgrims/login` - Login as a Pilgrim
   - `/patrons/login` - Login as a Patron

Available roles:
- **Guest**: Browse public profiles
- **Hub**: Manage residencies and evaluate pilgrims
- **Pilgrim**: Apply for residencies and earn credits
- **Patron**: Vouch for promising applications

### Demo Workflow

1. **As a Hub** (switch to any hub):
   - Go to Hub Dashboard
   - Create a new residency
   - View submissions when pilgrims apply
   - Choose a pilgrim
   - Chat with them
   - Generate a handshake
   - Monitor progress with logs
   - Close and evaluate

2. **As a Pilgrim** (switch to any pilgrim):
   - Go to Pilgrim Dashboard
   - Apply to an open residency
   - Spend credits on menu items
   - Provide feedback on closed residencies

3. **As a Patron** (switch to any patron):
   - Go to Patron Dashboard
   - Browse tagged residencies
   - Vouch for applications with fiat or tokens

4. **Explore**:
   - Visit the **Map** to see hub locations
   - Check **Seasons** to advance the quarter
   - Use **Settings** to reset demo data

### Mock Referral Codes

When registering a pilgrim, use any code in the format:
- `HN000` through `HN999`

### Settings

- **LocalStorage Persistence**: Enable/disable data persistence across sessions
- **Reset Demo Data**: Restore original seed data
- **Debug Viewer**: Inspect the mock database state

## What's Mocked

This is a **frontend-only prototype**. The following are simulated:

- ✅ Authentication (session switching)
- ✅ Database (in-memory with localStorage)
- ✅ Transactions (generated hashes)
- ✅ Checksums (crypto.subtle.digest)
- ✅ Smart contracts (no actual blockchain)
- ✅ Token vouching (UI only)

## Design System

- **Colors**:
  - Black (`#000`) / White (`#fff`)
  - Accent 1: Electric Mint (`#A1FFEF`)
  - Accent 2: Amber (`#FFAA25`)
- **Typography**: System fonts
- **Components**: Custom-built with Tailwind

## Browser Compatibility

Tested on modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires JavaScript and localStorage support.

## Development

### Adding New Features

1. Define types in `/lib/types.ts`
2. Update mock DB layer in `/lib/mockDb.ts`
3. Create UI components in `/components`
4. Add routes in `/app`
5. Update store if needed in `/store/useStore.ts`

### Building for Production

```bash
npm run build
npm run start
```

## Notes

- This is a **product demo**, not production-ready code
- No real backend, authentication, or blockchain integration
- All data resets when localStorage is cleared (unless persistence is enabled)
- Use for investor presentations, user testing, and product validation

## License

This is a prototype for demonstration purposes.

---

**Built with ❤️ for Hubs Network**
