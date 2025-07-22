import * as Sentry from '@sentry/nextjs';
import React from 'react';

// Export the logger for easy access
export const { logger } = Sentry;

// Export Sentry functions for easy access
export const {
  captureException,
  captureMessage,
  startSpan,
  setUser,
  setContext,
  addBreadcrumb,
} = Sentry;

// Custom wrapper for API route error handling
export function withSentryApiHandler<T = unknown>(
  handler: (req: Request, res: Response) => Promise<T>
) {
  return async (req: Request, res: Response) => {
    try {
      return await handler(req, res);
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  };
}

// Custom wrapper for component error handling
export function withSentryErrorBoundary<P = Record<string, unknown>>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<unknown>
) {
  return Sentry.withErrorBoundary(Component, {
    fallback:
      fallback ||
      (() => React.createElement('div', null, 'Something went wrong')),
    beforeCapture: (scope, error, errorInfo) => {
      scope.setTag('errorBoundary', true);
      scope.setContext('errorInfo', errorInfo);
    },
  });
}

// Helper for tracking user interactions
export function trackUserAction(
  action: string,
  data?: Record<string, unknown>
) {
  return Sentry.startSpan(
    {
      op: 'ui.action',
      name: action,
    },
    span => {
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          span.setAttribute(key, value);
        });
      }
    }
  );
}

// Helper for tracking API calls
export function trackApiCall<T>(
  method: string,
  url: string,
  fn: () => Promise<T>
): Promise<T> {
  return Sentry.startSpan(
    {
      op: 'http.client',
      name: `${method.toUpperCase()} ${url}`,
    },
    async span => {
      try {
        const result = await fn();
        span.setStatus({ code: 1 }); // OK
        return result;
      } catch (error) {
        span.setStatus({ code: 2 }); // ERROR
        span.setAttribute('error', true);
        throw error;
      }
    }
  );
}
