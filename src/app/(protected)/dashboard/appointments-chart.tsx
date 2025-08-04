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
// Generate dummy chart data for now - in real app would come from database

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

export function AppointmentsChart() {
  // Generate dummy data for the last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split('T')[0],
      appointments: Math.floor(Math.random() * 15) + 5, // 5-20 appointments
      patients: Math.floor(Math.random() * 8) + 2, // 2-10 new patients
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
