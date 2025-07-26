'use client';

import * as Sentry from '@sentry/nextjs';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorId: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to Sentry with healthcare-safe context
    const errorId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        section: 'healthcare-app',
        boundary: 'error-boundary',
      },
      level: 'error',
    });

    this.setState({ errorId });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className='min-h-screen flex items-center justify-center p-4 bg-background'>
          <div className='max-w-md w-full bg-card rounded-lg shadow-lg border p-6 text-center'>
            <div className='flex justify-center mb-4'>
              <AlertTriangle className='h-12 w-12 text-destructive' />
            </div>

            <h2 className='text-xl font-semibold text-foreground mb-2'>
              Something went wrong
            </h2>

            <p className='text-muted-foreground mb-6'>
              We apologize for the inconvenience. An unexpected error occurred
              while processing your request. Our team has been notified.
            </p>

            {this.state.errorId && (
              <p className='text-xs text-muted-foreground mb-4 font-mono bg-muted p-2 rounded'>
                Error ID: {this.state.errorId}
              </p>
            )}

            <div className='flex flex-col sm:flex-row gap-3'>
              <Button
                onClick={this.handleRetry}
                variant='default'
                className='flex-1'
              >
                <RotateCcw className='h-4 w-4 mr-2' />
                Try Again
              </Button>

              <Button
                onClick={this.handleGoHome}
                variant='outline'
                className='flex-1'
              >
                <Home className='h-4 w-4 mr-2' />
                Go to Dashboard
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mt-6 text-left'>
                <summary className='cursor-pointer text-sm font-medium text-muted-foreground'>
                  Error Details (Development Only)
                </summary>
                <pre className='mt-2 text-xs bg-muted p-3 rounded overflow-auto max-h-40'>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Lightweight error fallback for non-critical sections
export function ErrorFallback({
  error: _error,
  resetErrorBoundary,
  title = 'Something went wrong',
  description = 'An error occurred in this section. Please try again.',
}: {
  error?: Error;
  resetErrorBoundary?: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <div className='flex flex-col items-center justify-center p-6 border border-destructive/20 rounded-lg bg-destructive/5'>
      <AlertTriangle className='h-8 w-8 text-destructive mb-3' />
      <h3 className='font-medium text-destructive mb-2'>{title}</h3>
      <p className='text-sm text-muted-foreground text-center mb-4'>
        {description}
      </p>
      {resetErrorBoundary && (
        <Button onClick={resetErrorBoundary} variant='outline' size='sm'>
          <RotateCcw className='h-3 w-3 mr-2' />
          Try Again
        </Button>
      )}
    </div>
  );
}

// Page-level error boundary for route segments
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, _errorInfo) => {
        // Log page-level errors with additional context
        Sentry.withScope(scope => {
          scope.setTag('errorBoundary', 'page-level');
          scope.setContext('page', {
            url: window.location.href,
            userAgent: navigator.userAgent,
          });
          Sentry.captureException(error);
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
