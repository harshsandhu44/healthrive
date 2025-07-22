import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://205133460ba8357bb001cbed78ae1763@o4509711169552384.ingest.de.sentry.io/4509711178072144',

  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Enable logging
  _experiments: {
    enableLogs: true,
  },

  integrations: [
    // Send console.log, console.error, and console.warn calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ['log', 'error', 'warn'] }),
  ],
});
