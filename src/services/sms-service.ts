import twilio from 'twilio';
import { format } from 'date-fns';

interface AppointmentSMSData {
  patientName: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentType?: string;
  location?: string;
  reason?: string;
}

interface SMSResult {
  success: boolean;
  messageSid?: string;
  error?: string;
}

class SMSService {
  private client: twilio.Twilio | null = null;
  private messagingServiceSid: string | null = null;

  private initializeClient() {
    if (this.client) {
      return; // Already initialized
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

    if (!accountSid || !authToken || !messagingServiceSid) {
      throw new Error('Missing required Twilio environment variables');
    }

    // Check if we have valid credentials (not placeholder values)
    if (accountSid === 'your_account_sid' || authToken === 'your_auth_token' || messagingServiceSid === 'your_messaging_service_sid') {
      throw new Error('Twilio credentials not configured. Please update environment variables.');
    }

    this.client = twilio(accountSid, authToken);
    this.messagingServiceSid = messagingServiceSid;
  }

  /**
   * Format phone number to E.164 format
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If it doesn't start with country code, assume US (+1)
    if (digits.length === 10) {
      return `+1${digits}`;
    }
    
    // If it starts with 1 and has 11 digits, add +
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
    
    // If it already has country code format
    if (digits.length > 10) {
      return `+${digits}`;
    }
    
    return phone; // Return as-is if we can't format it
  }

  /**
   * Validate phone number format
   */
  private isValidPhoneNumber(phone: string): boolean {
    const formatted = this.formatPhoneNumber(phone);
    // Basic validation for E.164 format
    return /^\+[1-9]\d{1,14}$/.test(formatted);
  }

  /**
   * Generate appointment confirmation message
   */
  private generateAppointmentMessage(data: AppointmentSMSData): string {
    const appointmentDate = new Date(data.appointmentDate);
    const dateStr = format(appointmentDate, 'MMMM do, yyyy');
    const timeStr = format(appointmentDate, 'h:mm a');
    
    let message = `Hi ${data.patientName}! Your appointment is confirmed for ${dateStr} at ${timeStr}`;
    
    if (data.appointmentType) {
      message += ` (${data.appointmentType})`;
    }
    
    if (data.location) {
      message += `. Location: ${data.location}`;
    }
    
    message += '. Please arrive 15 minutes early. Call us if you need to reschedule.';
    
    return message;
  }

  /**
   * Send appointment confirmation SMS
   */
  async sendAppointmentConfirmation(data: AppointmentSMSData): Promise<SMSResult> {
    try {
      // Initialize client if needed
      this.initializeClient();
      
      if (!this.client || !this.messagingServiceSid) {
        return {
          success: false,
          error: 'SMS service not properly initialized'
        };
      }

      // Validate phone number
      if (!this.isValidPhoneNumber(data.patientPhone)) {
        return {
          success: false,
          error: 'Invalid phone number format'
        };
      }

      const formattedPhone = this.formatPhoneNumber(data.patientPhone);
      const message = this.generateAppointmentMessage(data);

      // Send SMS using Messaging Service
      const messageInstance = await this.client.messages.create({
        messagingServiceSid: this.messagingServiceSid,
        to: formattedPhone,
        body: message,
      });

      console.log(`SMS sent successfully. SID: ${messageInstance.sid}`);
      
      return {
        success: true,
        messageSid: messageInstance.sid
      };
      
    } catch (error) {
      console.error('Failed to send SMS:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send SMS'
      };
    }
  }

  /**
   * Send a custom SMS message
   */
  async sendCustomMessage(to: string, message: string): Promise<SMSResult> {
    try {
      // Initialize client if needed
      this.initializeClient();
      
      if (!this.client || !this.messagingServiceSid) {
        return {
          success: false,
          error: 'SMS service not properly initialized'
        };
      }

      // Validate phone number
      if (!this.isValidPhoneNumber(to)) {
        return {
          success: false,
          error: 'Invalid phone number format'
        };
      }

      const formattedPhone = this.formatPhoneNumber(to);

      // Send SMS using Messaging Service
      const messageInstance = await this.client.messages.create({
        messagingServiceSid: this.messagingServiceSid,
        to: formattedPhone,
        body: message,
      });

      console.log(`Custom SMS sent successfully. SID: ${messageInstance.sid}`);
      
      return {
        success: true,
        messageSid: messageInstance.sid
      };
      
    } catch (error) {
      console.error('Failed to send custom SMS:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send SMS'
      };
    }
  }
}

// Export singleton instance
export const smsService = new SMSService();
export type { AppointmentSMSData, SMSResult };