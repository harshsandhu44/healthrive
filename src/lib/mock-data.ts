export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
  type: "consultation" | "follow-up" | "surgery" | "emergency";
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  doctor: string;
  notes?: string;
}

export interface DashboardMetrics {
  appointments: {
    current: number;
    previous: number;
    change: number;
  };
  patients: {
    current: number;
    previous: number;
    change: number;
  };
}

export interface ChartData {
  date: string;
  appointments: number;
  patients: number;
}

// Mock data for dashboard metrics (current vs previous month)
export const dashboardMetrics: DashboardMetrics = {
  appointments: {
    current: 156,
    previous: 124,
    change: 25.8, // percentage increase
  },
  patients: {
    current: 89,
    previous: 76,
    change: 17.1, // percentage increase
  },
};

// Mock data for appointments and patients chart (last 30 days)
export const appointmentsChartData: ChartData[] = [
  { date: "2024-07-05", appointments: 3, patients: 2 },
  { date: "2024-07-06", appointments: 5, patients: 4 },
  { date: "2024-07-07", appointments: 2, patients: 2 },
  { date: "2024-07-08", appointments: 7, patients: 5 },
  { date: "2024-07-09", appointments: 4, patients: 3 },
  { date: "2024-07-10", appointments: 6, patients: 4 },
  { date: "2024-07-11", appointments: 8, patients: 6 },
  { date: "2024-07-12", appointments: 5, patients: 4 },
  { date: "2024-07-13", appointments: 3, patients: 3 },
  { date: "2024-07-14", appointments: 4, patients: 3 },
  { date: "2024-07-15", appointments: 9, patients: 7 },
  { date: "2024-07-16", appointments: 6, patients: 5 },
  { date: "2024-07-17", appointments: 7, patients: 5 },
  { date: "2024-07-18", appointments: 5, patients: 4 },
  { date: "2024-07-19", appointments: 8, patients: 6 },
  { date: "2024-07-20", appointments: 4, patients: 3 },
  { date: "2024-07-21", appointments: 6, patients: 5 },
  { date: "2024-07-22", appointments: 9, patients: 7 },
  { date: "2024-07-23", appointments: 7, patients: 5 },
  { date: "2024-07-24", appointments: 5, patients: 4 },
  { date: "2024-07-25", appointments: 8, patients: 6 },
  { date: "2024-07-26", appointments: 6, patients: 5 },
  { date: "2024-07-27", appointments: 4, patients: 4 },
  { date: "2024-07-28", appointments: 7, patients: 5 },
  { date: "2024-07-29", appointments: 9, patients: 7 },
  { date: "2024-07-30", appointments: 8, patients: 6 },
  { date: "2024-07-31", appointments: 6, patients: 5 },
  { date: "2024-08-01", appointments: 10, patients: 8 },
  { date: "2024-08-02", appointments: 7, patients: 6 },
  { date: "2024-08-03", appointments: 5, patients: 4 },
];

// Mock data for today's appointments
export const todaysAppointments: Appointment[] = [
  {
    id: "apt-001",
    patientName: "Sarah Johnson",
    patientId: "PT-001",
    time: "09:00 AM",
    type: "consultation",
    status: "scheduled",
    doctor: "Dr. Smith",
    notes: "Annual checkup",
  },
  {
    id: "apt-002",
    patientName: "Michael Chen",
    patientId: "PT-002",
    time: "10:30 AM",
    type: "follow-up",
    status: "in-progress",
    doctor: "Dr. Johnson",
    notes: "Post-surgery follow-up",
  },
  {
    id: "apt-003",
    patientName: "Emily Davis",
    patientId: "PT-003",
    time: "11:15 AM",
    type: "consultation",
    status: "scheduled",
    doctor: "Dr. Wilson",
    notes: "Skin condition consultation",
  },
  {
    id: "apt-004",
    patientName: "Robert Brown",
    patientId: "PT-004",
    time: "02:00 PM",
    type: "emergency",
    status: "scheduled",
    doctor: "Dr. Martinez",
    notes: "Urgent care - chest pain",
  },
  {
    id: "apt-005",
    patientName: "Lisa Anderson",
    patientId: "PT-005",
    time: "03:30 PM",
    type: "follow-up",
    status: "completed",
    doctor: "Dr. Lee",
    notes: "Blood test results review",
  },
  {
    id: "apt-006",
    patientName: "David Wilson",
    patientId: "PT-006",
    time: "04:15 PM",
    type: "surgery",
    status: "scheduled",
    doctor: "Dr. Taylor",
    notes: "Minor surgical procedure",
  },
];

// Extended mock data for all appointments (past, present, and future)
export const allAppointments: Appointment[] = [
  // Today's appointments (existing)
  ...todaysAppointments.map(apt => ({
    ...apt,
    time: `2024-08-04T${apt.time.includes('AM') ? 
      apt.time.replace(' AM', '').padStart(5, '0') + ':00' : 
      (parseInt(apt.time.split(':')[0]) + 12).toString().padStart(2, '0') + 
      ':' + apt.time.split(':')[1].replace(' PM', '') + ':00'}`
  })),
  
  // Yesterday's appointments
  {
    id: "apt-007",
    patientName: "Jennifer Martinez",
    patientId: "PT-007",
    time: "2024-08-03T09:30:00",
    type: "consultation",
    status: "completed",
    doctor: "Dr. Smith",
    notes: "Diabetes follow-up consultation",
  },
  {
    id: "apt-008",
    patientName: "James Wilson",
    patientId: "PT-008",
    time: "2024-08-03T14:00:00",
    type: "surgery",
    status: "completed",
    doctor: "Dr. Taylor",
    notes: "Arthroscopic knee surgery",
  },
  {
    id: "apt-009",
    patientName: "Maria Garcia",
    patientId: "PT-009",
    time: "2024-08-03T16:45:00",
    type: "follow-up",
    status: "cancelled",
    doctor: "Dr. Lee",
    notes: "Patient requested rescheduling",
  },
  
  // Tomorrow's appointments
  {
    id: "apt-010",
    patientName: "Thomas Anderson",
    patientId: "PT-010",
    time: "2024-08-05T08:00:00",
    type: "consultation",
    status: "scheduled",
    doctor: "Dr. Wilson",
    notes: "Initial consultation for back pain",
  },
  {
    id: "apt-011",
    patientName: "Susan Clark",
    patientId: "PT-011",
    time: "2024-08-05T10:15:00",
    type: "follow-up",
    status: "scheduled",
    doctor: "Dr. Johnson",
    notes: "Post-treatment check-up",
  },
  {
    id: "apt-012",
    patientName: "Kevin Brown",
    patientId: "PT-012",
    time: "2024-08-05T13:30:00",
    type: "emergency",
    status: "scheduled",
    doctor: "Dr. Martinez",
    notes: "Urgent cardiac evaluation",
  },
  
  // Next week appointments
  {
    id: "apt-013",
    patientName: "Rachel Green",
    patientId: "PT-013",
    time: "2024-08-07T09:00:00",
    type: "surgery",
    status: "scheduled",
    doctor: "Dr. Taylor",
    notes: "Gallbladder removal surgery",
  },
  {
    id: "apt-014",
    patientName: "Daniel Miller",
    patientId: "PT-014",
    time: "2024-08-07T11:30:00",
    type: "consultation",
    status: "scheduled",
    doctor: "Dr. Smith",
    notes: "Annual physical examination",
  },
  {
    id: "apt-015",
    patientName: "Amanda Lee",
    patientId: "PT-015",
    time: "2024-08-08T14:00:00",
    type: "follow-up",
    status: "scheduled",
    doctor: "Dr. Wilson",
    notes: "Physical therapy progress review",
  },
  {
    id: "apt-016",
    patientName: "Mark Taylor",
    patientId: "PT-016",
    time: "2024-08-09T10:00:00",
    type: "consultation",
    status: "scheduled",
    doctor: "Dr. Lee",
    notes: "Dermatology consultation",
  },
  
  // Last week appointments
  {
    id: "apt-017",
    patientName: "Linda Johnson",
    patientId: "PT-017",
    time: "2024-07-29T15:30:00",
    type: "follow-up",
    status: "completed",
    doctor: "Dr. Johnson",
    notes: "Hypertension management follow-up",
  },
  {
    id: "apt-018",
    patientName: "Christopher Davis",
    patientId: "PT-018",
    time: "2024-07-30T08:45:00",
    type: "consultation",
    status: "completed",
    doctor: "Dr. Martinez",
    notes: "Chest pain evaluation",
  },
  {
    id: "apt-019",
    patientName: "Michelle White",
    patientId: "PT-019",
    time: "2024-07-31T12:00:00",
    type: "surgery",
    status: "cancelled",
    doctor: "Dr. Taylor",
    notes: "Surgery postponed due to patient illness",
  },
  {
    id: "apt-020",
    patientName: "Brian Thompson",
    patientId: "PT-020",
    time: "2024-08-01T16:15:00",
    type: "emergency",
    status: "completed",
    doctor: "Dr. Wilson",
    notes: "Emergency room visit for allergic reaction",
  },
];