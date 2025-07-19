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

## Docker Commands

- `npm run docker:dev` - Start development server with ngrok HTTPS tunnel
- `npm run docker:build` - Build production Docker image
- `npm run docker:prod` - Run production build in Docker
- `npm run docker:stop` - Stop all Docker containers
- `npm run docker:clean` - Clean up Docker containers and images

## Project Structure

The project uses Next.js App Router with the following structure:

- `src/app/` - Main application directory containing pages and layouts
- `src/app/layout.tsx` - Root layout with metadata and HTML structure
- `src/app/page.tsx` - Homepage component
- `src/app/globals.css` - Global styles with Tailwind CSS imports
- `public/` - Static assets (SVG icons)

## Architecture Notes

- **Framework**: Next.js 15 with App Router and standalone output for Docker
- **Styling**: Tailwind CSS 4 with PostCSS configuration
- **TypeScript**: Strict mode enabled with path aliases (`@/*` maps to `./src/*`)
- **Linting**: ESLint with Next.js core-web-vitals and TypeScript configurations
- **Build Tool**: Turbopack for development (faster than Webpack)
- **Docker**: Multi-stage builds for production, development with ngrok HTTPS

## Key Configurations

- TypeScript path aliases configured for `@/*` imports from `src/`
- ESLint extends Next.js recommended configs for TypeScript projects
- PostCSS configured with Tailwind CSS plugin
- Strict TypeScript settings with noEmit for type checking only
- Docker setup with development and production configurations
- ngrok integration for HTTPS tunneling during development

## Development Notes

- Uses React 19 with latest features and patterns
- Metadata API for SEO configuration in layout files
- `suppressHydrationWarning` enabled in root HTML element
- Prettier and ESLint configured with pre-commit hooks via Husky
- lint-staged runs automatic formatting and linting on commit
- Docker development setup with ngrok for HTTPS tunneling
- Production-ready Docker build optimized for Vercel deployment
- Empty README.md indicates this is a new project setup

## Docker Setup Instructions

1. Copy `.env.example` to `.env` and configure ngrok settings
2. Get ngrok authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
3. Set up custom domain in ngrok dashboard (optional)
4. Run `npm run docker:dev` to start development with HTTPS
5. Access ngrok web interface at http://localhost:4040
