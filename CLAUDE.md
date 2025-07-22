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
- `src/app/(auth)/` - Auth route group with sign-in/sign-up pages
- `src/app/dashboard/` - Protected dashboard pages
- `src/app/layout.tsx` - Root layout with metadata and HTML structure
- `src/app/page.tsx` - Homepage component
- `src/app/globals.css` - Global styles with Tailwind CSS imports and shadcn/ui variables
- `src/components/ui/` - shadcn/ui components (auto-generated)
- `src/components/providers/` - Application providers (theme, auth, etc.)
- `src/lib/` - Utility functions including shadcn/ui utils
- `src/lib/supabase/` - Supabase client utilities (browser, server, middleware)
- `src/middleware.ts` - Clerk authentication middleware
- `supabase/` - Supabase configuration and migrations
- `public/fonts/` - Satoshi variable font files (TTF format)
- `public/` - Static assets (SVG icons)
- `components.json` - shadcn/ui configuration
- `.env.local` - Environment variables for Clerk and Supabase keys

## Architecture Notes

- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk for user management and auth flows
- **Database**: Supabase (PostgreSQL) with local development setup - used only for data storage
- **Styling**: Tailwind CSS 4 with PostCSS configuration + shadcn/ui components
- **Typography**: Satoshi variable font (100-900 weights) with fallback to system fonts
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
- Satoshi variable font configured as default sans-serif with @font-face declarations
- Font display swap for optimal loading performance
- Clerk authentication with route protection middleware
- Supabase SSR integration with client/server utilities
- Environment-based configuration for auth and database keys

## Development Notes

- Uses React 19 with latest features and patterns
- Metadata API for SEO configuration in layout files
- `suppressHydrationWarning` enabled in root HTML element for next-themes
- Theme switching with next-themes (light/dark/system modes)
- Provider pattern with RootProvider wrapping ClerkProvider, SupabaseProvider, and ThemeProvider
- Authentication state management with Clerk's SignedIn/SignedOut components
- Database integration with Supabase client context (data only, auth handled by Clerk)
- Protected routes using middleware for /dashboard and /profile paths
- Prettier and ESLint configured with pre-commit hooks via Husky
- lint-staged runs automatic formatting and linting on commit
- Empty README.md indicates this is a new project setup

## Authentication Setup

1. Copy `.env.example` to `.env.local`
2. Add your Clerk publishable and secret keys from Clerk Dashboard
3. Configure redirect URLs in Clerk Dashboard to match environment variables
4. Protected routes are automatically secured via middleware

## Database Setup (Local Development)

1. Install Docker Desktop and start it
2. Run `npx supabase start` to start local Supabase instance
3. Access Supabase Studio at http://127.0.0.1:54323
4. Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
5. Use `npx supabase stop` to stop the local instance
6. Tables and migrations can be created in the `supabase/` directory
7. **Note**: Supabase is used only for data storage - authentication is handled by Clerk

## Sentry Configuration

### Exception Catching

- Use `Sentry.captureException(error)` to capture an exception and log the error in Sentry
- Apply this in try-catch blocks or areas where exceptions are expected

### Tracing Examples

- Create spans for meaningful actions like button clicks, API calls, and function calls
- Use `Sentry.startSpan` function to create spans
- Child spans can exist within a parent span

### Custom Span Instrumentation

#### In Component Actions

- Set `name` and `op` properties meaningfully for the specific activity
- Attach attributes based on relevant information and metrics from the request

Example:

```javascript
function TestComponent() {
  const handleTestButtonClick = () => {
    Sentry.startSpan(
      {
        op: 'ui.click',
        name: 'Test Button Click',
      },
      span => {
        const value = 'some config';
        const metric = 'some metric';

        span.setAttribute('config', value);
        span.setAttribute('metric', metric);

        doSomething();
      }
    );
  };

  return (
    <button type='button' onClick={handleTestButtonClick}>
      Test Sentry
    </button>
  );
}
```

#### In API Calls

- Set `name` and `op` properties meaningfully for the API call
- Attach attributes based on request information and metrics

Example:

```javascript
async function fetchUserData(userId) {
  return Sentry.startSpan(
    {
      op: 'http.client',
      name: `GET /api/users/${userId}`,
    },
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      return data;
    }
  );
}
```

### Logs

- Import Sentry using `import * as Sentry from "@sentry/nextjs"`
- Enable logging with `Sentry.init({ _experiments: { enableLogs: true } })`
- Reference logger using `const { logger } = Sentry`
- Use `consoleLoggingIntegration` to log specific console error types automatically

### Configuration Files

- Client-side initialization: `instrumentation-client.ts`
- Server initialization: `sentry.edge.config.ts`
- Edge initialization: `sentry.server.config.ts`
- Use `import * as Sentry from "@sentry/nextjs"` to reference Sentry functionality

### Baseline Configuration

```javascript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://205133460ba8357bb001cbed78ae1763@o4509711169552384.ingest.de.sentry.io/4509711178072144',
  _experiments: {
    enableLogs: true,
  },
});
```

### Logger Integration Configuration

```javascript
Sentry.init({
  dsn: 'https://205133460ba8357bb001cbed78ae1763@o4509711169552384.ingest.de.sentry.io/4509711178072144',
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ['log', 'error', 'warn'] }),
  ],
});
```

### Logger Examples

- Use `logger.fmt` for template literal logging with variables

```javascript
logger.trace('Starting database connection', { database: 'users' });
logger.debug(logger.fmt`Cache miss for user: ${userId}`);
logger.info('Updated profile', { profileId: 345 });
logger.warn('Rate limit reached for endpoint', {
  endpoint: '/api/results/',
  isEnterprise: false,
});
logger.error('Failed to process payment', {
  orderId: 'order_123',
  amount: 99.99,
});
logger.fatal('Database connection pool exhausted', {
  database: 'users',
  activeConnections: 100,
});
```
