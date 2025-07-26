import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://205133460ba8357bb001cbed78ae1763@o4509711169552384.ingest.de.sentry.io/4509711178072144',

  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Session Replay with HIPAA-compliant privacy settings
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Enable logging
  _experiments: {
    enableLogs: true,
  },

  // HIPAA-compliant data scrubbing
  beforeSend(event) {
    // Remove sensitive healthcare data from error reports
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

    // Scrub sensitive data from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
        if (breadcrumb.data) {
          const scrubbedData = { ...breadcrumb.data };
          Object.keys(scrubbedData).forEach(key => {
            const keyLower = key.toLowerCase();
            if (
              keyLower.includes('patient') ||
              keyLower.includes('medical') ||
              keyLower.includes('health') ||
              keyLower.includes('phone') ||
              keyLower.includes('email') ||
              keyLower.includes('insurance') ||
              keyLower.includes('ssn') ||
              keyLower.includes('dob')
            ) {
              scrubbedData[key] = '[Redacted - Healthcare Data]';
            }
          });
          breadcrumb.data = scrubbedData;
        }
        return breadcrumb;
      });
    }

    // Scrub sensitive data from request data
    if (event.request && event.request.data) {
      try {
        const requestData =
          typeof event.request.data === 'string'
            ? JSON.parse(event.request.data)
            : event.request.data;

        const sensitiveFields = [
          'medical_records',
          'email',
          'phone_number',
          'patient_id',
          'full_name',
          'emergency_contact',
          'insurance',
        ];

        sensitiveFields.forEach(field => {
          if (requestData && field in requestData) {
            requestData[field] = '[Redacted - Healthcare Data]';
          }
        });

        event.request.data = JSON.stringify(requestData);
      } catch {
        // If parsing fails, redact entire request data for safety
        event.request.data = '[Redacted - Healthcare Data]';
      }
    }

    // Scrub URLs that might contain sensitive parameters
    if (event.request && event.request.url) {
      // Remove patient IDs and other sensitive data from URLs
      event.request.url = event.request.url.replace(
        /[?&](patient_id|email|phone|medical_record_id)=[^&]*/g,
        '$1=[Redacted]'
      );
    }

    return event;
  },

  integrations: [
    Sentry.replayIntegration({
      // Enhanced privacy settings for healthcare data
      maskAllText: true, // Mask all text for healthcare privacy
      blockAllMedia: true, // Block all media to prevent PHI exposure
      maskAllInputs: true, // Mask all form inputs

      // Mask specific selectors that might contain PHI
      mask: [
        '[data-patient-info]',
        '[data-medical-record]',
        '.patient-data',
        '.medical-info',
        'input[type="email"]',
        'input[type="tel"]',
        'textarea[name="medical_records"]',
      ],

      // Block specific selectors
      block: ['.sensitive-data', '[data-sensitive]'],
    }),

    // Console logging with healthcare data filtering
    Sentry.consoleLoggingIntegration({
      levels: ['error', 'warn'], // Exclude 'log' to reduce noise and potential PHI exposure
    }),
  ],
});
