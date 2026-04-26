# Active Context: Ar-Ra'id Connect (Peer-Learning Platform)

## Current State

**Project Status**: Core MVP Implementation Complete - All Pages & Navigation  
**Security Fix**: Supabase SSR token refresh race condition resolved

Ar-Ra'id Connect is a fully functional peer-learning platform for Moroccan teachers in Pioneer Schools. Built with Next.js 16, Supabase, RTL Arabic interface.

**Build Status**: Production build successful (0 errors, 6 warnings - all pre-existing)

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
- [x] Next.js navigation routing in navbar
- [x] User profile page
- [x] **FIXED: Invalid Refresh Token race condition (SSR middleware)**

---

### Auth Error Handling Fixes & SSR Token Refresh Fix

**Login Page** (`src/app/auth/login/page.jsx`):
- Replaced generic "بيانات الدخول غير صحيحة" with specific error messages
- Detects: wrong credentials, network errors
- Shows actual Supabase error for unknown issues
- Removed misleading "invalid email" classification

**Signup Page** (`src/app/auth/signup/page.jsx`):
- Added client-side email format validation
- Specific messages for: already registered, weak password, invalid email, network errors
- Shows actual error message instead of generic fallback

**useAuth.js** (`src/hooks/useAuth.js`):
- Added try-catch wrappers to all auth functions
- Returns consistent {error, data} structure
- Restored AuthProvider export
- Added detection and recovery for "Invalid Refresh Token" errors on auth init
- Auto-signOut local tokens when invalid refresh token detected
- Handles TOKEN_REFRESHED and SIGNED_OUT auth state events

**Supabase Client** (`src/lib/supabase.js`):
- Added @supabase/ssr v0.10.2 with `skipAutoInitialize` to prevent race conditions
- `createSupabaseServerClient()` - Server-side client for middleware/SSR
- `createSupabaseBrowserClient()` - Browser client with persisted sessions
- `getSupabase()` - Legacy backward-compatible client wrapper
- Fixed: Single-use refresh token race condition causing "Invalid Refresh Token: Refresh Token Not Found"

**Middleware** (`src/middleware.js`):
- NEW: JWT expiry check before calling refresh (only refreshes within 5 min of expiry)
- Avoids unnecessary server-side token refresh on every request
- Non-fatal error handling - auth errors don't block page rendering
- Client-side recovery for invalid token scenarios
- Skips auth check for static files, API routes, and auth/callback

**Auth Callback** (`src/app/auth/callback/page.jsx`):
- Handles "Invalid Refresh Token" error with graceful recovery
- Auto-signOut and redirect to login when token is invalid
- Catches unexpected errors without blocking UX

---

## Architecture

**Frontend**: Next.js 16 + React 19 + Tailwind CSS v4 + GSAP  
**Backend**: Supabase (PostgreSQL, Auth, Storage)  
**Language**: JavaScript (no TypeScript)  
**Direction**: RTL Arabic

### Core Pages
- `/` - Landing page (hero, features, CTA)
- `/capsules` - Video feed with filters
- `/resources` - Document repository
- `/auth/login` - Sign in
- `/auth/signup` - Register
- `/auth/callback` - OAuth callback
- `/profile` - User profile

### Data Flow
Hooks (useVideos, useComments, useResources, useAuth) → Supabase client → PostgreSQL with RLS

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

---

## Root Cause Analysis: Invalid Refresh Token Error

**Problem**: Supabase's single-use refresh tokens combined with SSR middleware calling `getUser()` on every request created a race condition. When the browser didn't receive the updated cookie (interrupted navigation, slow connection), it would later present the now-invalidated refresh token, causing `AuthApiError: Invalid Refresh Token: Refresh Token Not Found`.

**Solution**: 
1. Use `@supabase/ssr` with `skipAutoInitialize: true` to prevent background token refresh races
2. Check JWT expiry in middleware before triggering refresh (only refresh within 5 min of expiry)
3. Non-fatal error handling - middleware never throws, client handles recovery
4. Client-side detection of invalid token errors with auto-signOut and recovery

**References**:
- https://github.com/supabase/ssr/issues/190
- https://github.com/supabase/ssr/issues/68