import { Loader2Icon } from "lucide-react";

export const Preloader = () => {
  return (
    <div className="flex-1 bg-background text-foreground flex items-center justify-center">
      <Loader2Icon className="animate-spin" />
    </div>
  );
};
