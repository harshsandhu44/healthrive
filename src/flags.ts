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

export const patientsFlag = [
  enableCreatePatientFlag,
  enableEditPatientFlag,
  enableDeletePatientFlag,
  enableSearchPatientFlag,
];

export const enableCreateAppointmentFlag = flag<boolean>({
  key: "create-appointment",
  options: [true, false],
  decide: () => true,
});

export const enableEditAppointmentFlag = flag<boolean>({
  key: "edit-appointment",
  options: [true, false],
  decide: () => true,
});

export const enableDeleteAppointmentFlag = flag<boolean>({
  key: "delete-appointment",
  options: [true, false],
  decide: () => true,
});

export const enableSearchAppointmentFlag = flag<boolean>({
  key: "search-appointments",
  options: [true, false],
  decide: () => false,
});

export const enableAppointmentNotificationFlag = flag<boolean>({
  key: "appointment-notification",
  options: [true, false],
  decide: () => false,
});

export const appointmentFlag = [
  enableCreateAppointmentFlag,
  enableEditAppointmentFlag,
  enableDeleteAppointmentFlag,
  enableSearchAppointmentFlag,
  enableAppointmentNotificationFlag,
];
