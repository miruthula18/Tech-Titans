# DISASTER REUNITE
### *“Find. Verify. Reunite.”*

> **Disaster-Time Family Reunification & Inter-Agency Rescue Tracking Platform**  
> Designed for immediate deployment during floods, cyclones, earthquakes, and humanitarian emergencies.

---

## 1. PROJECT OVERVIEW

During and immediately following natural disasters (such as flash floods, cyclones, or earthquakes), family members are routinely separated during chaotic evacuations. Separated individuals are carried by disparate rescue units to different relief camps, medical triage units, emergency hospitals, and temporary shelters spread across multiple disaster sectors.

**DISASTER REUNITE** is a full-stack emergency response system designed to solve the critical problem of fragmented disaster-time information. It bridges authorized rescue personnel field registries with affected family inquiries through multi-factor candidate matching, closed-loop human verification, and a unified family reunification tracker.

### The Core Operational Lifecycle
```
DISASTER OCCURS
  ↓
RESCUE & RELIEF TEAMS EVACUATE SURVIVORS
  ↓
INTAKE REGISTRATION (Name, Photo, Shelter/Hospital, Status, Case ID)
  ↓
CENTRAL DISASTER REGISTRY
  ↓
AFFECTED FAMILY SEARCH (Basic Details or Photo Upload)
  ↓
AI-ASSISTED MULTI-FACTOR MATCHING (Name, Age, Location, Photo)
  ↓
HUMAN VERIFICATION (Authorized Rescue Personnel Confirmation)
  ↓
VERIFIED IDENTIFICATION & SAFE REUNIFICATION
```

---

## 2. KEY FEATURES & MODULES

### 🌊 Active Disaster Emergency Context
- Real-time emergency banner displaying disaster event: **"Coastal Flood — 2026"** (Category 4 Surge).
- Sector geographical context: *Bay Coast & Delta Districts (Zones 1–5)*.
- Live operational counters: Registered Rescued (142), Reunited (38), Active Shelters (6).
- Central Emergency Desk Hotlines and multi-disaster event switching.

### 🔍 Family Search Portal (Three Strict Result States)
- **Basic Search**: Full Name, Approximate Age, Gender, Last Known Location.
- **Photo Search**: Drag-and-drop photograph upload with automated visual feature matching.
  - Transparent public disclaimer: *"Upload a recent photo to help identify possible matches. Automated photo comparison is purely assistive. The system does NOT claim AI identification is 100% accurate."*
- **Strict 3-State Classification Engine**:
  1. **STATE 1 — VERIFIED FOUND**: Green verified badge, exact camp/shelter location, rescue timestamp, authorized officer verification seal, and dossier link.
  2. **STATE 2 — POSSIBLE MATCH**: Amber badge, `NEEDS HUMAN VERIFICATION` indicator, multi-factor confidence percentage (e.g., 88%), granular score breakdown (Name 92%, Age 100%, Location 85%, Photo 78%), and a **"Request Officer Verification"** action.
  3. **STATE 3 — NOT FOUND**: Reassuring guidance explaining records may still be in transit, search execution timestamp, and 1-click **"File Missing Person Inquiry"** report generator.

### 📋 Rescued Person Registration (Rescue Personnel)
- Field intake form capturing: Full Name, Age, Gender, Intake Photo, Distinguishing Identifiers / Clothing, Last Known Location, Rescued Location, Current Facility / Shelter, Rescue Date & Time, Clinical Condition (Stable, Minor Injuries, Critical, Under Observation), Status, and Rescue Unit.
- Automatically generates unique alphanumeric case IDs (e.g., `CASE-2026-FL001`).
- Instantly syncs to the central database and broadcasts a real-time notification.

### 🛡️ Authorized Verification Queue (Human-in-the-Loop)
- Review queue for AI-assisted match candidates.
- Side-by-side evidence inspection: **Family Inquiry Report vs. Field Intake Dossier**.
- Reviewer actions: **Confirm Match (VERIFY)** or **Reject Match**.
- Mandatory audit trail logging: Verifier name, badge ID, timestamp, and verification findings.

### 👨‍👩‍👧‍👦 Family Reunification Dashboard
- Unique multi-member family unit tracking (e.g., **Kumar Family Group**).
- Real-time progress bar: **"3 of 4 family members located"** (75% Located).
- Simultaneous status tracking across family members:
  - *Father (Rajesh Kumar)* — ✓ Found & Verified — Civic Center Evacuation Zone
  - *Mother (Sunita Kumar)* — ✓ Found & Verified — St. Jude General Hospital
  - *Daughter (Priya Kumar)* — ✓ Found & Verified — Government Relief Camp — Zone 2
  - *Son (Arjun Kumar)* — ⚠ Possible Match (88%) — Red Cross Field Clinic 3

### 🗺️ Relief Shelters & Evacuation Map
- Interactive OpenStreetMap visualization using Leaflet (zero paid API keys required).
- Custom markers for **Relief Camps**, **Hospitals**, and **Evacuation Centers**.
- Live capacity meters (Occupancy vs. Capacity), sector addresses, and emergency desk officer hotlines.

### 🔔 Live Activity Feed & Notifications
- Central event feed broadcasting arrivals, transfers (e.g., hospital transfer), match generations, verifications, and completed reunifications.

### 🔒 Privacy & Public Safety Standards
- Protection of displaced individuals: sensitive medical details, exact bed numbers, and private contact phone numbers are restricted to authenticated rescue personnel.
- Public family search displays safety status and general shelter facility location.

---

## 3. ARCHITECTURE & TECHNOLOGY STACK

```
┌────────────────────────────────────────────────────────┐
│             REACT + VITE FRONTEND (SPA)                │
│  Tailwind CSS • Lucide Icons • React Router • Leaflet  │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (JSON / Multipart)
┌───────────────────────────▼────────────────────────────┐
│             NODE.JS + EXPRESS BACKEND                  │
│  Multer Uploads • JWT Auth • Matching Service Engine   │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
┌──────────────▼────────────┐ ┌───────────▼──────────────┐
│  PRIMARY: MONGODB CLUSTER │ │ ZERO-CONFIG JSON ENGINE  │
│  (Mongoose Schema Model)  │ │ (backend/data/db.json)   │
└───────────────────────────┘ └──────────────────────────┘
```

- **Frontend**: React 18 / 19, Vite, Tailwind CSS v4 (`@tailwindcss/postcss`), React Router DOM v7, Leaflet & React-Leaflet, Lucide React icons, Axios.
- **Backend**: Node.js, Express.js, Multer (local image storage in `backend/uploads`), JWT (`jsonwebtoken`), `bcryptjs`, `uuid`, CORS.
- **Database Architecture**:
  - Seamless dual-mode architecture:
    1. If `MONGODB_URI` is provided and reachable, connects to MongoDB.
    2. If MongoDB is not running locally, **automatically falls back to a high-speed file-backed JSON persistence engine (`backend/data/db.json`) pre-seeded with realistic disaster records**.
    3. Runs 100% out of the box without requiring manual MongoDB setup.
- **AI Matching Engine**:
  - Deterministic + algorithmic multi-factor scorer evaluating Levenshtein string distance, token initial overlap, age delta curve, geographic proximity, and perceptual visual contour simulation.
  - Pluggable AI service layer ready for Gemini API or external Vision APIs via `AI_API_KEY`.

---

## 4. FOLDER STRUCTURE

```
disaster-reunite/
├── backend/
│   ├── data/
│   │   ├── seed.json              # Realistic disaster initial dataset (10+ people, 6 shelters)
│   │   └── db.json                # Runtime persistent JSON database (auto-created)
│   ├── middleware/
│   │   ├── auth.js                # JWT verification & RBAC middleware
│   │   └── upload.js              # Multer disk upload handler
│   ├── routes/
│   │   ├── auth.js                # Login & identity endpoints
│   │   ├── disasters.js           # Active disaster context & switcher
│   │   ├── persons.js             # Rescued person CRUD & status updates
│   │   ├── search.js              # Family 3-state search engine
│   │   ├── matches.js             # AI match generation & verification
│   │   ├── familyReports.js       # Family inquiries & group dashboard
│   │   ├── locations.js           # Shelters, camps & hospitals
│   │   ├── notifications.js       # Live activity event stream
│   │   └── stats.js               # Dashboard metrics & demo reset
│   ├── services/
│   │   ├── matchingService.js     # Multi-factor similarity scoring engine
│   │   └── storage.js             # Unified storage layer (MongoDB + JSON fallback)
│   ├── uploads/                   # Uploaded photos served statically at /uploads
│   ├── .env                       # Local environment configuration
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Main Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Navigation bar with role toggle
│   │   │   ├── DisasterBanner.jsx       # Active emergency ticker
│   │   │   ├── StatusBadge.jsx          # Visual status pill
│   │   │   ├── VerificationBadge.jsx    # Verification badge
│   │   │   ├── MapView.jsx              # Leaflet OpenStreetMap component
│   │   │   ├── NotificationModal.jsx    # Emergency notification feed
│   │   │   ├── DemoGuideModal.jsx       # Interactive 14-step walkthrough modal
│   │   │   └── PrivacyDisclaimer.jsx    # Disaster privacy notice
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Authentication & role switcher state
│   │   │   └── DisasterContext.jsx      # Active disaster context provider
│   │   ├── pages/
│   │   │   ├── HomePage.jsx             # Hero, workflow lifecycle & stats
│   │   │   ├── FamilySearchPage.jsx     # 3-State search (Basic & Photo)
│   │   │   ├── PersonDetailsPage.jsx    # Case profile & existing-stage timeline
│   │   │   ├── FamilyDashboardPage.jsx  # Multi-member family unit tracker
│   │   │   ├── RescueDashboardPage.jsx  # Operations center & table
│   │   │   ├── PersonRegistrationPage.jsx # Intake registration form
│   │   │   ├── VerificationQueuePage.jsx  # Side-by-side verification desk
│   │   │   ├── SheltersMapPage.jsx      # Leaflet facilities directory
│   │   │   └── LoginPage.jsx            # Role-based sign in
│   │   ├── services/
│   │   │   └── api.js                  # Axios client with interceptors
│   │   ├── App.jsx                     # Layout routes & footer
│   │   ├── index.css                   # Tailwind v4 & Leaflet CSS
│   │   └── main.jsx
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js                  # Vite config with backend proxy
│
├── .env.example
├── package.json                        # Root package with unified start script
├── README.md
└── start.js                            # Concurrently launches backend & frontend
```

---

## 5. ENVIRONMENT VARIABLES

Create a `.env` file in `backend/` (or use the pre-configured file):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/disaster_reunite
JWT_SECRET=disaster-reunite-emergency-jwt-secret-key-2026
AI_API_KEY=optional_gemini_api_key_here
```

*Note: If MongoDB is not running, the application smoothly boots into its integrated local storage engine.*

---

## 6. INSTALLATION & SETUP

### Step 1: Clone or Navigate to the Workspace
```powershell
cd C:\Users\mirut\.gemini\antigravity\scratch\disaster-reunite
```

### Step 2: Install Backend Dependencies
```powershell
cd backend
npm install
cd ..
```

### Step 3: Install Frontend Dependencies
```powershell
cd frontend
npm install
cd ..
```

---

## 7. HOW TO RUN

### Option A: Single Unified Command (Recommended)
From the project root directory, run:
```powershell
npm start
```
This runs `node start.js`, which concurrently boots:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

---

### Option B: Running Backend & Frontend in Separate Terminals

#### Terminal 1 — Backend:
```powershell
cd backend
npm start
```
*Backend runs at `http://localhost:5000`.*

#### Terminal 2 — Frontend:
```powershell
cd frontend
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 8. DEMO LOGIN CREDENTIALS

The platform includes two pre-configured user roles with instant 1-click login chips:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Rescue Personnel** | `rescue@disasterreunite.org` | `rescue123` | Rescued person registration, Verification queue, Mark reunited, Status modifications, Medical records access |
| **Affected Family** | `family@disasterreunite.org` | `family123` | Missing person search, Photo search, Missing report filing, Family group reunification tracking |

*Quick Role Switcher:* You can also click the **"Family / Rescue"** toggle directly in the top navigation bar at any time to switch perspective with zero friction!

---

## 9. STEP-BY-STEP HACKATHON DEMO FLOW (SECTION 31)

To demonstrate the full end-to-end reunification lifecycle during an evaluation, follow these exact 14 steps (or click the floating **"⚡ Demo Guide"** button in the app):

1. **STEP 1 — Open Home Page**:  
   Visit `http://localhost:5173`. Observe the emergency response banner, live casualty/reunification counters, and the 4-step workflow lifecycle diagram.
2. **STEP 2 — Select Active Disaster**:  
   Notice the active disaster pill: *"Coastal Flood — 2026 (Bay Region)"*. Click **"Switch Event"** to see multi-event context management.
3. **STEP 3 — Go to Rescue Operations**:  
   Click the **Rescue** toggle in the navbar or go to `/rescue`. Log in as Capt. Sarah Jenkins (NDRF).
4. **STEP 4 — Register a Rescued Person**:  
   Click **"+ Register Rescued Person"** (at `/register`). Fill in:  
   - Name: `Maya Sen`  
   - Age: `19`  
   - Gender: `Female`  
   - Rescue Location: `Canal Embankment Pier 4`  
   - Shelter: `Government Relief Camp — Zone 2`  
   - Status: `Rescued`
5. **STEP 5 — Save the Record**:  
   Click **"Save & Register Person"**. View the green confirmation: *"Person successfully registered. Assigned Case ID: CASE-2026-FL011"*.
6. **STEP 6 — Open Family Search**:  
   Switch role to **Family** and click **"Find My Family"** (at `/search`).
7. **STEP 7 — Search for Priya Kumar**:  
   Type `Priya Kumar` and submit.
8. **STEP 8 — Inspect State 1 (VERIFIED FOUND)**:  
   Observe the green **STATE 1** card showing:  
   - Status: `SAFE`  
   - Current Location: `Government Relief Camp — Zone 2`  
   - Verification: `✓ Verified by Rescue Personnel`  
   - Click **"View Full Details"** to see her documented 5-stage timeline.
9. **STEP 9 — Demonstrate State 2 (POSSIBLE MATCH)**:  
   Return to `/search` and search for `Arjun Kumar`.  
   Observe the amber **STATE 2** card:  
   - Candidate: `Arjun K. (16y)`  
   - Match Confidence: `88%`  
   - Breakdown: Name 92%, Age 100%, Location 85%, Photo 78%  
   - Notice: *"AI-assisted possible match. Final identification must be verified by authorized rescue personnel."*  
   - Click **"Request Officer Verification"**.
10. **STEP 10 — Open Rescue Verification Queue**:  
    Switch back to **Rescue** and go to `/verification-queue`.
11. **STEP 11 — Verify the Match**:  
    Click **"Review & Verify Candidate"** for the Arjun Kumar case.  
    Inspect the side-by-side comparison (Inquiry vs Field Intake).  
    Click **"Confirm Match (VERIFY)"**.
12. **STEP 12 — Family Side Updates to Verified**:  
    Switch back to Family search (`/search?name=Arjun`).  
    Notice the case has transitioned from *Possible Match* to **✓ Verified by Rescue Personnel**!
13. **STEP 13 — Mark Person as Reunited**:  
    As Rescue Personnel, open Arjun K.'s profile (`/person/person-4`) and click **"Mark as Reunited"**.
14. **STEP 14 — Family Dashboard**:  
    Navigate to **"Family Dashboard"** (`/family-dashboard`).  
    Observe the **Kumar Family Group** tracking:  
    - Father: *Rajesh Kumar* — ✓ Found  
    - Mother: *Sunita Kumar* — ✓ Found (Hospital)  
    - Daughter: *Priya Kumar* — ✓ Found (Camp Zone 2)  
    - Son: *Arjun Kumar* — ✓ Found & Reunited  
    - Summary Badge: **"4 of 4 family members located"**!

---

## 10. API REFERENCE

### Authentication
- `POST /api/auth/login` — Sign in with email/password or role mode.
- `GET /api/auth/me` — Retrieve authenticated user profile.

### Disaster Context
- `GET /api/disasters` — List all registered disaster contexts.
- `GET /api/disasters/active` — Fetch currently active disaster.
- `PUT /api/disasters/:id/activate` — Switch active disaster.

### Rescued Persons
- `GET /api/persons` — Search and filter records with pagination (`search`, `status`, `verificationStatus`, `shelter`, `page`, `limit`).
- `GET /api/persons/:id` — Fetch case profile dossier and existing-stages timeline.
- `POST /api/persons` — Register rescued person (supports multipart photo upload).
- `PUT /api/persons/:id` — Update person status, location, or mark reunited.
- `DELETE /api/persons/:id` — Remove or archive record.

### Family Search & Matching
- `POST /api/search` — Unified search supporting basic fields and photograph upload. Classifies output into `STATE_1_VERIFIED_FOUND`, `STATE_2_POSSIBLE_MATCH`, or `STATE_3_NOT_FOUND`.
- `GET /api/matches` — Retrieve AI candidate matches.
- `POST /api/matches` — Queue a candidate match for verification.
- `PUT /api/matches/:id/verify` — Submit officer verification decision (`CONFIRM` or `REJECT`).

### Family Inquiries & Dashboard
- `GET /api/family-reports` — List missing person family reports.
- `POST /api/family-reports` — File missing person report.
- `GET /api/family-reports/group-summary` — Retrieve aggregated multi-member family unit reunification tracker.

### Facilities & Notifications
- `GET /api/locations` — Fetch relief camps, evacuation centers, and emergency hospitals.
- `GET /api/notifications` — Fetch real-time activity stream.
- `PUT /api/notifications/:id/read` — Mark notification as acknowledged.
- `GET /api/stats` — Operations center summary statistics.
- `POST /api/stats/reset` — Reset database to seed state for repeatable demo runs.

---

## 11. AI MATCHING ALGORITHM EXPLANATION

The AI matching subsystem uses a hybrid weighted scoring approach:

$$\text{Confidence Score} = \frac{\sum (W_i \times S_i)}{\sum W_i}$$

1. **Name Similarity ($S_{\text{name}}$)**:
   - Evaluates normalized Levenshtein edit distance and token phonetic overlaps.
   - Detects abbreviated initials (e.g., `"Arjun K."` vs `"Arjun Kumar"` yields 92%).
2. **Age Similarity ($S_{\text{age}}$)**:
   - Non-linear penalty curve where exact match = 100%, $\pm 1$ year = 92%, $\pm 2$ years = 82%, $\pm 5$ years = 65%.
3. **Geographic Proximity ($S_{\text{loc}}$)**:
   - Normalizes sector keywords (e.g., *"Fisherman Colony"*, *"Ward 4"*, *"Zone 2"*) and computes intersection between last known location and rescue sector coordinates.
4. **Visual Feature Correlation ($S_{\text{photo}}$)**:
   - When a photo is provided, perceptual feature comparison is computed. If an external Vision API (`AI_API_KEY`) is configured, facial embeddings are queried.
5. **Human-in-the-Loop Safeguard**:
   - System policy strictly prevents autonomous verification. All candidate matches exceeding threshold (55%) are designated `Needs Human Verification` until an authorized rescue officer signs off.

---

## 12. LIMITATIONS & FUTURE IMPROVEMENTS

- **Offline-First Mesh Networking**: Future iterations will implement PWA caching and Bluetooth Low Energy (BLE) peer-to-peer sync between field rescue tablets in areas without cellular connectivity.
- **Biometric Fingerprint & Iris Triage**: Adding hardware-based biometric sensor integration for unconscious or non-verbal survivors.
- **Automated SMS Broadcast Gateway**: Integration with Twilio / GSM modems for automated SMS alerts to low-connectivity families.
- **Multi-Lingual Voice Intake**: Voice-to-text intake in regional dialects for stressed survivors.

---

## 13. LICENSE

Developed for disaster relief operations and humanitarian family reunification. Distributed under the MIT License.
