import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://205133460ba8357bb001cbed78ae1763@o4509711169552384.ingest.de.sentry.io/4509711178072144',

  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Enable logging
  _experiments: {
    enableLogs: true,
  },

  // HIPAA-compliant data scrubbing for server-side events
  beforeSend(event) {
    // Remove sensitive healthcare data from server error reports
    if (event.extra) {
      const sensitiveKeys = [
        'medical_records',
        'phone_number',
        'email',
        'ssn',
        'dob',
        'patient_id',
        'patient_data',
        'healthcare_data',
        'insurance',
        'emergency_contact',
      ];

      sensitiveKeys.forEach(key => {
        if (event.extra && key in event.extra) {
          event.extra[key] = '[Redacted - Healthcare Data]';
        }
      });
    }

    // Scrub database query parameters that might contain PHI
    if (event.contexts && event.contexts.database) {
      const dbContext = event.contexts.database as any;
      if (dbContext.statement) {
        // Redact potential PHI in SQL statements
        dbContext.statement = dbContext.statement.replace(
          /('[^']*@[^']*'|'\+?[\d\s()-]{10,15}'|'pt-\d{4}')/g,
          "'[Redacted]'"
        );
      }
    }

    // Scrub request data on server side
    if (event.request) {
      // Scrub headers that might contain sensitive info
      if (event.request.headers) {
        const sensitiveHeaders = ['authorization', 'cookie', 'x-patient-id'];
        sensitiveHeaders.forEach(header => {
          if (event.request.headers && event.request.headers[header]) {
            event.request.headers[header] = '[Redacted]';
          }
        });
      }

      // Scrub query parameters
      if (event.request.query_string) {
        event.request.query_string = event.request.query_string.replace(
          /[?&](patient_id|email|phone|medical_record_id)=[^&]*/g,
          '$1=[Redacted]'
        );
      }
    }

    return event;
  },

  integrations: [
    // Console logging with reduced levels for server-side to prevent PHI leakage
    Sentry.consoleLoggingIntegration({ levels: ['error', 'warn'] }),
  ],
});
