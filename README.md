# Zarah Nails & Beauty — Production Website & Salon Automation

A modern, high-performance website and salon management system built for **Zarah Nails & Beauty**, located at Shop 12, 3 Red Hills Road, Massey, Auckland, New Zealand.

---

## Architecture Overview

- **Framework:** Astro 7+ (Static Site Generation with client-side reactive islands)
- **Styling:** Bespoke *Refined Contemporary Studio* Design System (Warm porcelain stone, soft rose-taupe, deep espresso typography, subtle champagne accents)
- **Data Layer:** Decoupled JSON data structures (`salon-info.json`, `services.json`, `team.json`, `gallery.json`, `faq.json`, `reviews.json`)
- **Hosting Tier:** Netlify / Cloudflare Pages ($0/mo edge hosting with automatic SSL)
- **Customer Features:**
  - Multi-step customer booking system with instant reservation reference and slot picker
  - Categorized service menu with transparent NZD pricing and duration
  - Curated nail art inspiration lookbook with "Book This Look" 1-click links
  - Mobile quick-action bar (one-tap calling to 0210 839 8791 and booking)
  - Full local SEO Schema.org structured data (`NailSalon` and `BeautySalon`)
- **Staff & Admin Portal (`/staff`):**
  - PIN authentication gate (Default PIN: `1234`)
  - Master & individual technician calendars (Zarah, Priya, Chloe)
  - Fast in-store walk-in & phone call logger
  - Shift absence management & slot reassignment with automated customer SMS alerts
  - Facebook & Social Message Inbox with 1-click "Convert to Booking"
  - Schedule export to CSV for accounting
## Live demo:
https://zarahnailsmassey.vercel.app/
---

## Directory Structure

```
zara/
├── dist/                     # Production build output
├── public/
│   ├── images/gallery/       # Vector SVG artwork and salon photos
│   ├── favicon.svg           # High-resolution vector favicon
│   ├── logo.svg              # Scalable SVG brand logo
│   └── robots.txt            # Search engine crawler policies
├── src/
│   ├── components/
│   │   ├── Header.astro      # Desktop & mobile responsive header
│   │   ├── Footer.astro      # Comprehensive footer with local context
│   │   └── Logo.astro        # Responsive brand logo component
│   ├── data/
│   │   ├── salon-info.json   # Phone, address, hours, parking
│   │   ├── services.json     # Categorized pricing & durations
│   │   ├── team.json         # Technician bios & specialties
│   │   ├── gallery.json      # Lookbook entries with matching services
│   │   ├── reviews.json      # Real customer testimonials
│   │   └── faq.json          # Policies & FAQs
│   ├── layouts/
│   │   ├── BaseLayout.astro  # Customer-facing layout with SEO
│   │   └── StaffLayout.astro # Dedicated in-store staff workspace layout
│   ├── pages/
│   │   ├── index.astro       # Homepage
│   │   ├── services.astro    # Services & pricing menu
│   │   ├── gallery.astro     # Nail art lookbook
│   │   ├── about.astro       # Salon story & standards
│   │   ├── booking.astro     # Customer booking engine
│   │   ├── contact.astro     # Location, hours & directions
│   │   ├── policies.astro    # Policies & guarantees
│   │   ├── staff/
│   │   │   └── index.astro   # Staff & shift management portal
│   │   └── 404.astro         # Not found fallback
│   └── styles/
│       └── global.css        # Design tokens & typography
├── astro.config.mjs          # Astro build configuration
├── package.json              # Project dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── OWNER_GUIDE.md            # Plain English maintenance guide for the owner
└── README.md
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```
