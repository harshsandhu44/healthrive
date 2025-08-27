import { flag } from "flags/next";

export const enableCreatePatientFlag = flag<boolean>({
  key: "create-patient",
  options: [true, false],
  decide: () => true,
});

export const enableEditPatientFlag = flag<boolean>({
  key: "edit-patient",
  options: [true, false],
  decide: () => true,
});

export const enableDeletePatientFlag = flag<boolean>({
  key: "delete-patient",
  options: [true, false],
  decide: () => true,
});

export const enableSearchPatientFlag = flag<boolean>({
  key: "search-patient",
  options: [true, false],
  decide: () => false,
});

export const enableCronJobsFlag = flag<boolean>({
  key: "cron-jobs",
  options: [true, false],
  decide: () => false,
});

export const enableNotificationPromptFlag = flag<boolean>({
  key: "notification-prompt",
  options: [true, false],
  decide: () => true,
});

export const patientsFlag = [
  enableCreatePatientFlag,
  enableEditPatientFlag,
  enableDeletePatientFlag,
  enableSearchPatientFlag,
];

export const cronFlags = [
  enableCronJobsFlag,
];

export const notificationFlags = [
  enableNotificationPromptFlag,
];
