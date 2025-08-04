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
import { dashboardMetrics } from "./mock-data";
import { AppointmentsChart } from "./appointments-chart";
import { AppointmentsTable } from "./appointments-table";

export default function DashboardPage() {
  const metricsCards = [
    {
      label: "Appointments",
      value: dashboardMetrics.appointments.current,
      previous: dashboardMetrics.appointments.previous,
      change: dashboardMetrics.appointments.change,
      icon: Calendar,
    },
    {
      label: "Patients",
      value: dashboardMetrics.patients.current,
      previous: dashboardMetrics.patients.previous,
      change: dashboardMetrics.patients.change,
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
        <AppointmentsChart />
      </section>

      {/* Today's Appointments Table */}
      <section>
        <AppointmentsTable />
      </section>
    </main>
  );
}
