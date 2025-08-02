# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Healthrive**, a healthcare platform built with Next.js 15 and React 19. The application provides a comprehensive solution for healthcare services with a modern, responsive design system built on shadcn/ui components and Tailwind CSS.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React built-in hooks and context

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public route group for landing pages
│   ├── layout.tsx         # Root layout with metadata
│   └── globals.css        # Global Tailwind styles
├── components/
│   └── ui/                # shadcn/ui components (40+ components)
├── hooks/
│   └── use-mobile.ts      # Mobile breakpoint detection
└── lib/
    ├── constants.ts       # App constants (APP_NAME, APP_DESCRIPTION)
    └── utils.ts           # Utility functions (cn for className merging)
```

### Key Patterns

1. **Route Groups**: Uses `(public)` route group for landing pages with separate layout
2. **Component Architecture**: Follows shadcn/ui patterns with compound components and forwardRef
3. **Styling**: Uses `cn()` utility for conditional className merging with clsx and tailwind-merge
4. **TypeScript**: Strict TypeScript configuration with path aliases (`@/*` -> `./src/*`)
5. **Form Handling**: React Hook Form with Zod schemas for validation
6. **Responsive Design**: Mobile-first approach with custom `useIsMobile` hook (768px breakpoint)

### Configuration Files

- `components.json` - shadcn/ui configuration (New York style, RSC enabled)
- `tsconfig.json` - TypeScript config with strict mode and path aliases
- `next.config.ts` - Minimal Next.js configuration
- No custom Tailwind config file (using Tailwind v4 defaults)

### Current Features

- Landing page with hero section showcasing healthcare services
- Complete shadcn/ui component library setup
- Mobile-responsive design system
- Form components with validation ready
- Dark mode support via next-themes
- Chart components for data visualization

### Development Notes

- Uses React 19 and Next.js 15 (latest versions)
- Turbopack enabled for faster development builds
- No custom API routes currently implemented
- Ready for expansion with authentication, dashboard, and healthcare-specific features