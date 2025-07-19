# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Healthrive is a comprehensive health and wellness platform built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4. The project follows Next.js App Router conventions and uses modern React patterns.

## Development Commands

- `npm run dev` - Start development server with Turbopack for faster builds
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality and TypeScript types
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format all code with Prettier
- `npm run format:check` - Check if code is properly formatted

## shadcn/ui Commands

- `npx shadcn@latest add [component]` - Add a new component (e.g., button, card, dialog)
- `npx shadcn@latest add --all` - Add all available components
- `npx shadcn@latest update` - Update existing components

## Project Structure

The project uses Next.js App Router with the following structure:

- `src/app/` - Main application directory containing pages and layouts
- `src/app/layout.tsx` - Root layout with metadata and HTML structure
- `src/app/page.tsx` - Homepage component
- `src/app/globals.css` - Global styles with Tailwind CSS imports and shadcn/ui variables
- `src/components/ui/` - shadcn/ui components (auto-generated)
- `src/lib/` - Utility functions including shadcn/ui utils
- `public/` - Static assets (SVG icons)
- `components.json` - shadcn/ui configuration

## Architecture Notes

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 with PostCSS configuration + shadcn/ui components
- **UI Components**: shadcn/ui with stone base color and New York style
- **TypeScript**: Strict mode enabled with path aliases (`@/*` maps to `./src/*`)
- **Linting**: ESLint with Next.js core-web-vitals and TypeScript configurations
- **Build Tool**: Turbopack for development (faster than Webpack)

## Key Configurations

- TypeScript path aliases configured for `@/*` imports from `src/`
- ESLint extends Next.js recommended configs for TypeScript projects
- PostCSS configured with Tailwind CSS plugin
- Strict TypeScript settings with noEmit for type checking only
- shadcn/ui configured with stone color palette and CSS variables
- Component library includes Radix UI primitives with custom styling

## Development Notes

- Uses React 19 with latest features and patterns
- Metadata API for SEO configuration in layout files
- `suppressHydrationWarning` enabled in root HTML element
- Prettier and ESLint configured with pre-commit hooks via Husky
- lint-staged runs automatic formatting and linting on commit
- Empty README.md indicates this is a new project setup
