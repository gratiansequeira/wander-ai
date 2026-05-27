# Wander AI ✈️ — Your AI Travel Co-pilot

Wander AI is a fully featured, full-stack travel scheduling and itinerary generator. It functions as a digital travel co-pilot, tailoring custom travel experiences and producing clean, day-by-day itineraries complete with flight recommendations, localized safety insights, smart packing checklists, and interactive cost estimates.

This application is built using a modern full-stack architecture featuring a **React single-page-application frontend** paired with a secure **Node.js Express backend**, powered by **Gemini AI** and anchored with a secure, server-side **Firebase Firestore database**.

---

## 🎨 Design Philosophy & Features

Wander AI blends functional utility with premium visual design, using clean space guidelines, a polished high-contrast palette, and fluid micro-animations:

- **AI-Powered Generation**: Leverages the official `@google/genai` SDK on the server-side to build structured, smart itineraries in real-time.
- **Dynamic Cost Estimator**: Features interactive budget customizers allowing live calculation of projected costs across travel classes.
- **Persistent Cloud Sharing**: Uses a custom **Firebase Firestore** implementation with high-fidelity security rules to store client itineraries, preventing link expiration and maintaining perfect uptime.
- **Security-First Architecture**: Completely isolates the Gemini API key and Firebase credentials behind Express API proxy endpoints, protecting secrets from being exposed to client browsers.
- **Motion Fluid Transitions**: Integrated with `motion` for staggered, elegant section entries.

---

## 🛠️ Technology Stack

### Frontend (SPA)
- **React 19** & **Vite**: Rapid, modern asset bundling with Hot Module Replacement.
- **Tailwind CSS v4**: Fluid layout spacing, elegant typography scales, and native color palettes.
- **Motion React**: Micro-interactions and spring-based entering transitions.
- **Lucide Icons**: Standardized, pixel-perfect clean iconography.

### Backend (Server)
- **Express JS**: Handles API proxying, serving client assets, and handling routing.
- **Google Gen AI SDK** (`@google/genai`): Leverages modern LLM interfaces to compile itineraries.
- **Firebase SDK**: Native integration with Cloud Firestore using isolated service structures.
- **Esbuild Bundler**: Builds the entire TypeScript backend server into a single, optimized production file (`dist/server.cjs`).

---

## 🔒 Firestore Security & Integrity Rules

The app uses a production-grade Security Spec (`security_spec.md`) loaded directly into Firestore to safeguard data against manipulation:
- **Strict Immutability**: Shared itineraries are read (`get`) and create (`create`) only. The database denies any attempt to update (`update`) or delete (`delete`) existing shared items.
- **Denial of Indexing**: Performing list queries or document indexing (`list`) on the collection is forbidden to prevent bulk extraction.
- **High-Fidelity Types Parsing**: Validates that destination names are strings between 1 and 200 characters, travel duration is an integer between 1 and 30 days, and that no malicious unrequested parameters are injected.

---

## ⚙️ Local Development & Setup

To run Wander AI locally:

### 1. Prerequisites
- **Node.js** (v18.x or newer is recommended)
- **NPM** (packaged with Node.js)

### 2. Environment Variables
Create a `.env` file in the root directory and define the following variables:

```env
# Google Gemini API Key for itinerary drafting
GEMINI_API_KEY="your-gemini-api-key-here"

# Hosted platform URL
APP_URL="http://localhost:3000"
```

### 3. Firebase Configuration
Make sure your custom `firebase-applet-config.json` is located in the root folder, containing your Firebase project ID, database ID, and key credentials.

### 4. Install Dependencies
Installs all of the package bundles specified in `package.json`:
```bash
npm install
```

### 5. Running the Dev Server
Launches the full-stack development environment. The Express entry server is run via `tsx`, instantly translating TypeScript files:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser.

---

## 🚀 Production Build & Deployment

Wander AI complies with the standard deployable artifact configuration. To trigger the bundled compilation pipeline:

```bash
# 1. Compile frontend and pack backend files
npm run build

# 2. Run in a production environment
npm run start
```

During build, Vite produces static files into the `dist/` directory, and `esbuild` bundles the backend `server.ts` into a unified CommonJS file `dist/server.cjs`. Running the production server loads files seamlessly with low cold-start latency!
