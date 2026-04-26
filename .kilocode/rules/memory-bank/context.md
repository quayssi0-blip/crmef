# Active Context: Ar-Ra'id Connect (Peer-Learning Platform)

## Current State

**Project Status**: Core MVP Implementation Complete - Error handling improvements applied

Ar-Ra'id Connect is a fully functional peer-learning platform for Moroccan teachers in Pioneer Schools. Built with Next.js 16, Supabase, RTL Arabic interface.

**Build Status**: Production build successful (0 errors, 6 warnings)

---

## Recently Completed

- [x] TypeScript -> JavaScript conversion
- [x] Supabase + GSAP installed
- [x] Tailwind with Zen palette (blues/greys, NO green)
- [x] Full Supabase setup (client, schema, storage)
- [x] Authentication (email + @taalim.ma simulation)
- [x] Video feed with filtering (pedagogy, subject, grade, tags)
- [x] Threaded comments system
- [x] Resource repository (LaTeX, Beamer, exams)
- [x] Search functionality
- [x] Moroccan educational terminology in UI
- [x] GSAP animations
- [x] Documentation (README, SETUP_GUIDE)
- [x] Build fixed and verified
- [x] Improved Supabase auth error handling with specific user messages

---

### Auth Error Handling Fixes

- **Issue**: Registration showed generic "حدث خطأ أثناء انشاء الحساب" for all errors
- **Fix**: Added try-catch wrappers and specific error detection for:
  - Already registered accounts
  - Weak passwords
  - Invalid email format
  - Network errors
  - Shows actual error messages instead of generic fallback
- **Files**: src/lib/supabase.js, src/hooks/useAuth.js, src/app/auth/signup/page.jsx
- **Added**: .env, .env.local, next.config.js with Supabase credentials

---

## Architecture

**Frontend**: Next.js 16 + React 19 + Tailwind CSS v4 + GSAP
**Backend**: Supabase (PostgreSQL, Auth, Storage)
**Language**: JavaScript (no TypeScript)
**Direction**: RTL Arabic

### Core Pages
- / - Landing page (hero, features, CTA)
- /capsules - Video feed with filters
- /resources - Document repository
- /auth/login - Sign in
- /auth/signup - Register
- /auth/callback - OAuth callback

### Data Flow
Hooks (useVideos, useComments, useResources, useAuth) -> Supabase client -> PostgreSQL with RLS

---

## Design System

- **Colors**: blue-600 primary, slate for neutrals, amber accent
- **Typography**: Amiri (headings) + Noto Sans Arabic (body)
- **Spacing**: Comfortable (Zen philosophy)
- **Animations**: GSAP (fade-in, card hover, modal scale)

---

## Database Overview

Tables: profiles, videos, comments, resources, video_likes, comment_likes, video_views, resource_downloads

Features:
- Full-text search (Arabic-capable)
- Automatic counters (views, likes, comments)
- Triggers for timestamp updates
- RLS policies for security

---

## Status

The project is **ready for development**. Next steps:
1. Set up Supabase project with schema.sql
2. Create storage buckets
3. Add .env.local with credentials
4. Run `bun dev` to start

See SETUP_GUIDE.md for detailed instructions.
