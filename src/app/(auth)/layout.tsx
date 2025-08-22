import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="space-y-4">
        <Button variant="link">
          <ArrowLeftCircle />
          Go Back
        </Button>
        <div className="font-mono">
          <h1 className="text-4xl font-bold">Continue to Vylune</h1>
          <p className="text-lg">Enter your email to login</p>
        </div>
        {children}
      </div>
    </div>
  );
}
