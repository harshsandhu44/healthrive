import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Users, Calendar } from "lucide-react";
import { getPatients } from "../patients/actions";
import { getAppointments } from "../appointments/actions";
import { AppointmentsChart } from "./appointments-chart";
import { AppointmentsTable } from "./appointments-table";

export default async function DashboardPage() {
  const [patients, appointments] = await Promise.all([
    getPatients(),
    getAppointments(),
  ]);

  // Calculate current month and previous month data
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Filter appointments by current and previous month
  const currentMonthAppointments = appointments.filter(appointment => {
    if (!appointment.time) return false;
    const appointmentDate = new Date(appointment.time);
    return appointmentDate.getMonth() === currentMonth && appointmentDate.getFullYear() === currentYear;
  });

  const lastMonthAppointments = appointments.filter(appointment => {
    if (!appointment.time) return false;
    const appointmentDate = new Date(appointment.time);
    return appointmentDate.getMonth() === lastMonth && appointmentDate.getFullYear() === lastMonthYear;
  });

  // Filter patients by current and previous month registration
  const currentMonthPatients = patients.filter(patient => {
    if (!patient.registrationDate) return false;
    const registrationDate = new Date(patient.registrationDate);
    return registrationDate.getMonth() === currentMonth && registrationDate.getFullYear() === currentYear;
  });

  const lastMonthPatients = patients.filter(patient => {
    if (!patient.registrationDate) return false;
    const registrationDate = new Date(patient.registrationDate);
    return registrationDate.getMonth() === lastMonth && registrationDate.getFullYear() === lastMonthYear;
  });

  // Calculate percentage changes
  const appointmentsChange = lastMonthAppointments.length === 0 
    ? (currentMonthAppointments.length > 0 ? 100 : 0)
    : ((currentMonthAppointments.length - lastMonthAppointments.length) / lastMonthAppointments.length) * 100;

  const patientsChange = lastMonthPatients.length === 0 
    ? (currentMonthPatients.length > 0 ? 100 : 0)
    : ((currentMonthPatients.length - lastMonthPatients.length) / lastMonthPatients.length) * 100;

  const metricsCards = [
    {
      label: "Appointments",
      value: currentMonthAppointments.length,
      previous: lastMonthAppointments.length,
      change: appointmentsChange,
      icon: Calendar,
    },
    {
      label: "Patients",
      value: currentMonthPatients.length,
      previous: lastMonthPatients.length,
      change: patientsChange,
      icon: Users,
    },
  ];

  return (
    <main className="space-y-6">
      {/* Metrics Cards */}
      <section className="grid grid-cols-1 @md/main:grid-cols-2 gap-4">
        {metricsCards.map((card) => {
          const isPositive = card.change > 0;
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          const IconComponent = card.icon;

          return (
            <Card key={card.label}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    {card.label}
                  </CardTitle>
                  <CardAction>
                    <Tooltip>
                      <TooltipTrigger>
                        <TrendIcon
                          className={`size-4 ${
                            isPositive ? "text-green-600" : "text-red-600"
                          }`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {Math.abs(card.change).toFixed(1)}%
                          {isPositive ? "increase" : "decrease"} from last month
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardAction>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold">{card.value}</p>
                  <p className="text-sm text-muted-foreground">
                    <span
                      className={isPositive ? "text-green-600" : "text-red-600"}
                    >
                      {isPositive ? "+" : ""}
                      {card.change.toFixed(1)}%
                    </span>{" "}
                    from last month ({card.previous})
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Appointments Chart */}
      <section>
        <AppointmentsChart appointments={appointments} patients={patients} />
      </section>

      {/* Today's Appointments Table */}
      <section>
        <AppointmentsTable />
      </section>
    </main>
  );
}
