// Server component wrapper for notification permission prompt with feature flag

import { enableNotificationPromptFlag } from '@/flags';
import { NotificationPermissionPrompt } from './NotificationPermissionPrompt';

interface NotificationPermissionWrapperProps {
  delay?: number;
}

export async function NotificationPermissionWrapper({
  delay
}: NotificationPermissionWrapperProps) {
  // Check feature flag server-side
  const isEnabled = await enableNotificationPromptFlag();

  // If feature is disabled, don't render anything
  if (!isEnabled) {
    return null;
  }

  // Render the client component with feature flag state
  return (
    <NotificationPermissionPrompt 
      enabled={isEnabled} 
      delay={delay}
    />
  );
}