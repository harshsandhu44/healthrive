"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type Appointment, type Patient } from "@/lib/types/entities";

const chartConfig = {
  appointments: {
    label: "Appointments",
    color: "hsl(var(--chart-1))",
  },
  patients: {
    label: "New Patients",
    color: "hsl(var(--chart-2))",
  },
};

interface AppointmentsChartProps {
  appointments: Appointment[];
  patients: Patient[];
}

export function AppointmentsChart({ appointments, patients }: AppointmentsChartProps) {
  // Process the data to create chart data for the last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateString = date.toISOString().split('T')[0];
    
    // Count appointments for this date
    const dayAppointments = appointments.filter(appointment => {
      if (!appointment.time) return false;
      const appointmentDate = new Date(appointment.time).toISOString().split('T')[0];
      return appointmentDate === dateString;
    }).length;
    
    // Count new patients registered on this date
    const dayPatients = patients.filter(patient => {
      if (!patient.registrationDate) return false;
      const patientDate = new Date(patient.registrationDate).toISOString().split('T')[0];
      return patientDate === dateString;
    }).length;
    
    return {
      date: dateString,
      appointments: dayAppointments,
      patients: dayPatients,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments & Patients Overview</CardTitle>
        <CardDescription>
          Daily appointments and new patients over the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="appointments"
              type="natural"
              fill="var(--color-appointments)"
              fillOpacity={0.4}
              stroke="var(--color-appointments)"
              stackId="a"
            />
            <Area
              dataKey="patients"
              type="natural"
              fill="var(--color-patients)"
              fillOpacity={0.4}
              stroke="var(--color-patients)"
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
