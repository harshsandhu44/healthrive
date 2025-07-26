import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://205133460ba8357bb001cbed78ae1763@o4509711169552384.ingest.de.sentry.io/4509711178072144',

  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Enable logging
  _experiments: {
    enableLogs: true,
  },

  // HIPAA-compliant data scrubbing for edge runtime
  beforeSend(event) {
    // Remove sensitive healthcare data from edge error reports
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

    // Scrub middleware and edge function request data
    if (event.request) {
      // Scrub headers in edge runtime
      if (event.request.headers) {
        const sensitiveHeaders = [
          'authorization',
          'cookie',
          'x-patient-id',
          'x-user-id',
        ];
        sensitiveHeaders.forEach(header => {
          if (event.request.headers && event.request.headers[header]) {
            event.request.headers[header] = '[Redacted]';
          }
        });
      }

      // Scrub URL parameters in edge runtime
      if (event.request.url) {
        event.request.url = event.request.url.replace(
          /[?&](patient_id|email|phone|medical_record_id|user_id)=[^&]*/g,
          '$1=[Redacted]'
        );
      }
    }

    return event;
  },

  integrations: [
    // Minimal logging for edge runtime to prevent PHI exposure
    Sentry.consoleLoggingIntegration({ levels: ['error'] }),
  ],
});
