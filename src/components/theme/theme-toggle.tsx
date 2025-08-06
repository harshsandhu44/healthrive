"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Monitor, Moon, Sun, Palette } from "lucide-react";

const themes = [
  {
    value: "light",
    label: "Light",
    description: "Clean and bright interface",
    icon: Sun,
  },
  {
    value: "dark", 
    label: "Dark",
    description: "Easy on the eyes in low light",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Adapts to your device settings",
    icon: Monitor,
  },
];

interface ThemeToggleProps {
  showDescription?: boolean;
  variant?: "inline" | "card";
}

export function ThemeToggle({ showDescription = true, variant = "card" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2">
        {themes.map((themeOption) => {
          const IconComponent = themeOption.icon;
          return (
            <Button
              key={themeOption.value}
              variant={theme === themeOption.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme(themeOption.value)}
              className="gap-2"
            >
              <IconComponent className="h-4 w-4" />
              {themeOption.label}
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance
        </CardTitle>
        {showDescription && (
          <CardDescription>
            Customize how Healthrive looks on your device
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={theme} onValueChange={setTheme}>
          {themes.map((themeOption) => {
            const IconComponent = themeOption.icon;
            return (
              <div key={themeOption.value} className="flex items-center space-x-2">
                <RadioGroupItem value={themeOption.value} id={themeOption.value} />
                <Label
                  htmlFor={themeOption.value}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{themeOption.label}</div>
                    {showDescription && (
                      <div className="text-sm text-muted-foreground">
                        {themeOption.description}
                      </div>
                    )}
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}