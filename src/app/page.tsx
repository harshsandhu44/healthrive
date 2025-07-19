import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-bold text-foreground">
        Welcome to Healthrive
      </h1>
      <p className="text-lg text-muted-foreground">
        Explore our platform and start your journey to better health.
      </p>
      <Button>Get Started</Button>
    </div>
  );
};

export default HomePage;
