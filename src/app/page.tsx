import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold text-foreground">
        Welcome to Healthrive
      </h1>
      <p className="text-lg text-muted-foreground font-medium">
        Explore our platform and start your journey to better health.
      </p>
      <Button className="font-semibold">Get Started</Button>
    </div>
  );
};

export default HomePage;
