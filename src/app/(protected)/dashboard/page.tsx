import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const cards = [
    { label: "Appointments", value: 13, diff: 25 },
    { label: "Patients", value: 3, diff: 5 },
  ];

  return (
    <main className="space-y-6">
      <section className="grid grid-cols-1 @md/main:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <CardAction>
                <Tooltip>
                  <TooltipTrigger>
                    <TrendingUp className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{card.diff}% higher</p>
                  </TooltipContent>
                </Tooltip>
              </CardAction>
              <CardTitle>{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Past Week</p>
            </CardFooter>
          </Card>
        ))}
      </section>
    </main>
  );
}
