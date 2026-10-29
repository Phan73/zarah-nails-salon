# Zarah Nails & Beauty — Salon Owner & Family Operating Guide

Welcome to your new custom website, customer booking system, and in-store staff management portal for **Zarah Nails & Beauty** (Shop 12, 3 Red Hills Road, Massey, Auckland).

This guide is written in plain English so you or any family member can operate the salon system, update prices with a visual form, upload photos from your phone, and manage staff with zero coding knowledge.

---

## 1. Quick Start — Running Your Website Locally

To start the website on any computer:

1. Open your terminal or PowerShell.
2. Navigate to your project folder:
   ```bash
   cd "c:\Users\carlun\Desktop\zara"
   ```
3. Run:
   ```bash
   npm run dev
   ```
4. Open your browser and go to:
   - **Public Website:** `http://localhost:4321/`
   - **Staff & Admin Portal:** `http://localhost:4321/staff`

---

## 2. Single Universal "Login" (0-Second Double Login)

Everyone signs in through the universal **"Login"** button in the top navigation bar.

- **To customers**, the login modal looks 100% like a sleek digital loyalty pass (no staff hints or leaked passwords visible).
- **When Admin or Staff signs in**, the system instantly unlocks their workspace in 1 step with **zero double-login prompts** or PIN gates.

| Account Type | How to Sign In | What Happens After Signing In |
| :--- | :--- | :--- |
| **Owner / Admin** | Username: `admin`<br>Password: `258046` | **Immediately opens the management workspace** in Full Admin Mode: Calendar, Walk-ins, SMS Alerts, Visual Price Editor, Staff Account Manager, Lookbook AI Generator. |
| **Normal Staff** | Assigned Staff Username & Password (created by Admin) | **Immediately opens the staff workspace** for front desk operations: View daily calendar, log walk-in & phone bookings (with automatic 10-dot loyalty points), 1-click convert Facebook messages, reassign staff with SMS alerts, and redeem client rewards. Protected from altering prices or deleting staff. |
| **Customers** | Google, Apple ID, NZ Mobile (SMS), or Email | Opens their digital 10-Dot Stamp Card, displays completed vs pending stamps, and auto-fills details during online bookings. |

---

## 3. How the Owner Can Update Everything (No Code, No JSON!)

You do **not** need to open code or edit JSON files. All updates are done visually right inside the `/staff` portal:

### A. Updating Prices or Changing Services
1. Click **"Login"** on the website and enter `admin` / `258046` (or go to `http://localhost:4321/staff`).
2. Click the **"Services & Pricing Editor"** tab.
3. You will see every service neatly categorized.
4. Click **"Edit Price & Info"** on any treatment:
   - Change the price (e.g. from `$60` to `$65`).
   - Change the duration or description.
   - Toggle the *"Popular Choice"* badge.
5. Click **"Save Service Changes"** — the price immediately updates across the entire website and customer booking dropdowns!
6. To add a new treatment, simply click the purple **"+ Add New Service"** button at the top.

### B. Adding Looks to the Nail Art Gallery (Photo Upload OR AI Art Generator)

You have two powerful options when adding new looks to your public `/gallery`:

#### Option 1: Upload a Real Photo
1. In Admin Mode, click the **"Gallery Photo Manager"** tab.
2. Click **"+ Add New Look"**.
3. Keep **"Upload Photo"** selected, then tap **"Choose Photo"** to select any picture from your phone or computer.
4. Enter the Look Title (e.g. *"Glazed Pearl BIAB"*), price (e.g. `"$65 NZD"`), and tags (e.g. *"BIAB, Chrome"*).
5. Click **"Publish to Public Gallery"** — your photo is instantly live on the public website with a working "Book This Look" button!

#### Option 2: Auto-Generate Nail Art from a Prompt (No Photo Needed!)
If you haven't taken a photo yet, the system can automatically draw and generate nail art based on your description:
1. In the Look Creator popup, click **"✨ Auto-Generate from Prompt"**.
2. Type what you want in plain English, or tap one of the instant inspiration buttons (e.g. *"Emerald velvet cat-eye almond nails"*).
3. Click **"Generate Art & Color"**.
4. The system automatically blends the textures and renders high-definition vector nail art with an instant preview!
5. Adjust the title or price if you wish, and click **"Publish Generated Look"**.

### C. Creating Staff Logins & Managing Team
1. In Admin Mode, click the **"Staff Roster Manager"** tab.
2. Under **"Staff Portal Logins & Access Control"**, click **"+ Create Staff Login"**:
   - Select the technician (e.g. Chloe, Priya, or a new team member).
   - Assign their **Username** (e.g. `chloe`) and **Password** (e.g. `staff123`).
   - Set permission level to **Normal Staff** (or Admin).
   - Click **"Save Staff Login"**.
3. The staff member can now click **"Login"** anywhere on the website and enter their username and password to open the staff portal!
4. To remove or edit an old technician's login, click **"Edit"** or the red **"&times;"** button next to their name.

---

## 4. Daily Front Desk Operations (For All Staff)

### 1. View Appointments
- Filter by "All Technicians" or see specific schedules for **Zarah**, **Priya**, or **Chloe**.
- Click **"Mark Done"** when a client finishes their treatment.

### 2. Fast Walk-in & Phone Logger
- When a client walks into Shop 12 on Red Hills Road or calls **0210 839 8791**:
  - Click the **"Log Walk-in / Phone Booking"** button in the top right.
  - Fill in their name, phone number, treatment, date, and assigned technician.
  - Click **"Save to Salon Schedule"** — it instantly adds to the calendar!

### 3. Shift Cover & Automated Customer SMS
- If a staff member calls in sick:
  - Click **"Reassign & SMS"** on their appointment.
  - Select the colleague covering the slot (e.g. reassigning from Zarah to Chloe).
  - The system updates the schedule and generates the customer text message alert:
    > *"Kia ora [ClientName], this is Zarah Nails & Beauty Massey. Your appointment on [Date] at [Time] for [Service] has been reassigned to our specialist [NewStaff]. All other details remain confirmed. Questions? Call 0210 839 8791. See you at Shop 12, 3 Red Hills Road!"*
  - Click **"Confirm Reassignment & Send SMS"**!

### 4. Facebook & Social Inquiries (1-Click Convert & Loyalty Sync)
- Go to the **"Facebook & Social Inbox"** tab in the staff workspace.
- **⚡ 1-Click Convert to Booking:**
  - Instantly schedules the appointment on the salon calendar.
  - Automatically identifies or creates the customer account in the **10-Dot Loyalty Reward System** and awards **1 Orange Pending Stamp (🟠)**.
  - Automatically clears the inquiry from the inbox and updates badge counts.
- **✏️ Customise & Book:**
  - Opens the booking logger pre-filled with the customer's name, phone, and inquiry notes so staff can pick a specific technician, custom time, or service.
  - When submitted, it also awards the **1 Orange Pending Stamp (🟠)** and clears the inquiry from the inbox!
- **Refresh & Demo Inquiries:**
  - Click **"Refresh Inquiries"** to sync online messages.
  - If the inbox is empty, click **"+ Load Demo Facebook Messages"** anytime to practice 1-Click conversions with realistic customer inquiries.

### 5. Customer Directory & 10-Dot Loyalty Rewards Program

Both normal staff and admin can access the **"🌟 Customers & 10-Dot Loyalty"** tab.

#### How the 10-Dot Stamp Card Works:
- **Earning Rule:** A customer earns 1 stamp for every completed salon service OR when spending a minimum of $50 NZD.
- **Visual Dot Colors:**
  - ⚪ **White Dot:** Unearned slot (empty).
  - 🟠 **Orange Dot (Temporary):** Automatically added when the customer books online, when logged as a walk-in/phone booking, or when converted in 1 click from Facebook inquiries! This holds their place while waiting for their visit.
  - 🟢 **Green Dot (Permanent):** When the customer shows up at Shop 12 and the staff member clicks **"Mark Done"** on their appointment, the orange dot automatically turns into a permanent green dot!

#### What Happens When 10 Green Dots Are Reached:
- As soon as a customer hits **10 Green Dots**, an animated **Celebration Overlay Window** immediately pops up over the screen!
- It notifies the staff member:
  > *"Customer [Name] is entitled to a FREE salon service today (Manicure, Spa Pedicure, or BIAB infill)!"*
- The staff member can click **"🎁 Claim & Redeem Free Service Now"**:
  - The free service is recorded.
  - The stamp card is reset back to 0 for their next 10-visit rewards cycle!
- If the customer wants to save the reward for their next visit, staff can click **"Save for Next Visit"** to keep the 10 stamps ready.

#### How Customers Log In on the Website:
- Customers can click the universal **"Login"** button at the top right of the website.
- They can sign in using:
  - **Google** (1-Click sign in)
  - **Apple** (1-Click Apple ID)
  - **NZ Mobile Phone** (Instant 4-digit SMS verification code, default `1234`)
  - **Email Address**
- When logged in, their contact info is auto-filled during booking, and they can view their digital 10-dot stamp card and upcoming reservations anytime from their phone.

---

## 5. Free Hosting & Custom Domains

- **Free Hosting ($0/month forever):** Host on Netlify or Cloudflare Pages with free SSL. You get a permanent web address like `https://zarahnailsmassey.netlify.app`.
- **Custom `.co.nz` Domain:**
  - Official `.co.nz` domains are controlled by the New Zealand Domain Name Commission (*InternetNZ*) and cost **~$20 to $25 NZD/year** (less than $2.50/month).
  - You can register `zarahnailsmassey.co.nz` or `zarahnails.co.nz` from trusted local NZ registrars:
    - [1stDomains.nz](https://www.1stdomains.nz/) (~$24 NZD/yr)
    - [MyHost.nz](https://www.myhost.nz/) (~$22 NZD/yr)
  - Connecting the domain to Netlify takes just 2 minutes.

---

## 6. Quick Reference

- **Salon Address:** Shop 12, 3 Red Hills Road, Massey, Auckland 0614
- **Phone:** 0210 839 8791 / 021 368 1481
- **Admin Workspace Sign In:** Username `admin` • Password `258046`
- **Staff Sign In:** Technician Username & Password (created in Staff Roster tab)
