# Links Lab ✨

> A modern Link‑in‑bio platform with a custom public page and a powerful Firebase‑backed dashboard.

<p align="center">
  <a href="https://www.linkedin.com/in/bilalabdulhadii/"><img src="https://img.shields.io/badge/Chat-Let's%20chat-darkseagreen?labelColor=gray&style=flat" alt="Chat" /></a>
  <a href="https://www.buymeacoffee.com/bilalabdulhadii"><img src="https://img.shields.io/badge/Donate%20$-Buy%20me%20a%20coffee-darkkhaki?labelColor=gray&style=flat" alt="Donate" /></a>
  <a href="https://github.com/bilalabdulhadii"><img src="https://img.shields.io/badge/Coding-Work%20Together-cornflowerblue?labelColor=gray&style=flat" alt="Coding" /></a>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#home-styling--dashboard-controls">Home Styling & Dashboard Controls</a> •
  <a href="#usage-guide">Usage Guide</a> •
  <a href="#installation--setup">Installation & Setup</a> •
  <a href="#env-keys">.env Keys</a> •
  <a href="#firebase-setup">Firebase Setup</a> •
  <a href="#seed-admin--default-config">Seed Admin + Default Config</a> •
  <a href="#folder-structure">Folder Structure</a> •
  <a href="#media--data">Media & Data</a> •
  <a href="#notes">Notes</a> •
  <a href="#email-me">Email me</a> •
  <a href="#about-me">About me</a> •
  <a href="#support">Support</a>
</p>

---

## Overview

**Links** is a custom Linktree‑style app built for creators. It combines a **beautiful public profile page** with a **full dashboard** for managing content, theme, and layout.

The public page is **100% custom styled** (Tailwind + custom CSS only), while the dashboard uses **shadcn/ui** for fast, clean management.

---

## Key Features

- **Public Home Page**: Fully custom styling (no shadcn on public).
- **Dashboard**: Auth‑only management for profile, icons, buttons, theme, templates, and settings.
- **Firebase Auth**: Email/password login only. No public registration.
- **Firestore Config**: All settings stored in a single document.
- **Storage Media**: Profile, cover, button cards, backgrounds in Firebase Storage.
- **Share Modal**: QR code, copy link, WhatsApp/Facebook share.
- **Templates**: One‑click theme presets + theme recovery.
- **Live Preview**: Preview unsaved changes in the dashboard.
- **Status + Error UX**: Friendly loading, offline, no‑config, and 404 states.
- **Media Cleanup**: Old files removed when replaced.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI (Dashboard)**: shadcn/ui + Radix
- **Auth/DB/Storage**: Firebase
- **Icons**: lucide-react + react-icons

<a><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original-wordmark.svg" width="40" height="40"/></a>
<a><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="40" height="40"/></a>
<a><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain-wordmark.svg" width="40" height="40"/></a>

---

## Home Styling & Dashboard Controls

Everything on the public page is controlled from the dashboard and stored in Firestore.
Below is a full breakdown of what you can style and where it lives.

### Background (Theme page)

- **Types**: solid, gradient (2–3 colors + direction), image, video.
- **Limits**: image ≤ 5 MB, video ≤ 30 MB.
- **Behavior**: media is stored in Firebase Storage and old files are deleted when replaced.

### Content Card (Theme page)

- **Background color** (can be transparent by leaving empty).
- **Opacity** (0–100).
- **Blur** (glass effect).
- **Corner radius**.

### Text Color (Theme page)

- Single color used for **profile title**, **description**, **share modal text**, and **footer**.

### Profile (Profile page)

- **Types**: image, solid, gradient, or transparent (no profile).
- **Recommended size**: square image (ex: 500×500).

### Cover (Profile page)

- **Types**: image, solid, gradient, or transparent (no cover).
- **Recommended size**: wide image (ex: 1200×600).
- **Position**: top, center, bottom, left, right, etc.

### Icons Row (Icons page)

- Uses a large built‑in icon list (React Icons).
- Reorderable inside the icons section.
- Global icon style: border, text, background, hover colors, radius, alignment.
- Hover animation + transition apply here.

### Buttons (Buttons page)

- **Layouts**: Card, Text, Icon + Text, Icon Only.
- **Global button style**: border, text, background, hover colors, radius, alignment.
- **Custom per button**: override colors while keeping global radius.
- Card image uploads are stored in Firebase Storage and cleaned up when replaced.

### Share Modal (Home page)

- Styled to match the active background + text color.
- QR code, copy link, WhatsApp and Facebook share.

### Templates (Templates page)

- Templates change **visual theme only** (they do not touch your content).
- Applies to: background (non‑media), cover (non‑image), icon/button styles, content card, text color, hover animation, and custom button style.
- You can preview the template before saving.

### Theme Backup & Recovery

- When you **Set** a template, the previous theme is stored as a backup.
- After you **Save**, the backup is written to Firestore.
- Restore it from **Settings → Recover Theme**.
- Cancel/reset before saving clears the backup so it doesn’t overwrite later.

### Appearance (Dashboard Only)

Dashboard appearance is **local only** and does not affect the public page.

- **ThemeSelector** sets dashboard theme classes (`theme-*`).
- **ModeToggle** sets light/dark/system (`next-themes`).
- Stored in local storage + cookie.

### Public States

- **Loading**: Styled loader using theme.
- **Offline**: Friendly retry UI if Firebase fails.
- **No Config**: Setup‑needed state when `appConfig/main` is missing.
- **Unpublished**: Coming Soon or custom message.
- **404**: Styled using the same theme background.

---

## Usage Guide

1. **Login** at `/login` (email/password only).
2. **Dashboard** at `/dashboard`.
3. **Edit** Profile, Cover, Icons, Buttons, Theme, Templates.
4. **Preview** changes before saving.
5. **Publish** or **Unpublish** from Settings.

---

## Installation & Setup

1. **Install dependencies**

```bash
npm install
```

2. **Create `.env.local`**

Copy `.env.example` to `.env.local` and fill the keys.

3. **Run the dev server**

```bash
npm run dev
```

---

## .env Keys

**Client (Firebase Web App)**

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Admin (Seed Script)**

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

---

## Firebase Setup

1. Create Firebase project.
2. Create a **Web App** and copy the client keys.
3. **Enable Auth** → Email/Password.
4. **Enable Firestore** in production mode.
5. **Enable Storage** in production mode.

**Firestore rules**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appConfig/main {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Storage rules**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /media/{allPaths=**} {
      allow read: if true;
      allow write, delete: if request.auth != null;
    }
  }
}
```

---

## Seed Admin + Default Config

This creates the first admin and seeds Firestore with `appConfig/main`.

```bash
npm run seed:admin
```

---

## Folder Structure

```text
app/
  page.tsx                # Public home
  not-found.tsx           # Public 404
  login/                  # Login page
  dashboard/              # Dashboard routes
components/
  dashboard/              # Editors and dashboard UI
  home/                   # Home components
  ui/                     # shadcn/ui components
hooks/
lib/
  app-config.ts           # Types + merge helpers
  templates.ts            # Theme templates
  storage.ts              # Firebase Storage helpers
scripts/
  seed-admin.mjs          # Admin + default config seed
public/
```

---

## Media & Data

- Single Data document: `appConfig/main`

- Stored in Firebase Storage under `media/*`.
- Old files deleted when replaced.
- Limits:
    - Images: **5 MB**
    - Video: **30 MB**

---

## Notes

- Public page uses custom styling only (no shadcn/ui).
- Dashboard uses shadcn/ui and sidebar layout.
- No public registration page. Use `seed:admin` for Admin user.

---

## Email me

If you liked using this project, or it has helped you in any way, I'd like you email me at <b><a href="bilalabdulhadi88@gmail.com">bilalabdulhadi88@gmail.com</a></b> about anything you'd want to say about this software. I'd really appreciate it!

---

## About me

#Crafting Unique Digital Experiences.

#Let's keep it simple and effective.

---

## Support

<p><a href="https://www.buymeacoffee.com/bilalabdulhadii"> <img align="left" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="https://www.buymeacoffee.com/bilalabdulhadii" /></a></p><br><br>

---

> WebSite [@bilalabdulhadi.com](https://bilalabdulhadi.com/) &nbsp;&middot;&nbsp;
> GitHub [@bilalabdulhadii](https://github.com/bilalabdulhadii) &nbsp;&middot;&nbsp;
> Linkedin [@bilalabdulhadii](https://www.linkedin.com/in/bilalabdulhadii/)
