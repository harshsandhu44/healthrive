import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftCircleIcon } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="container font-mono h-screen flex items-center justify-center">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <Link
            href="/"
            className="mb-6 text-sm flex items-center gap-2 hover:underline underline-offset-4"
          >
            <ArrowLeftCircleIcon className="size-4" />
            Go Back
          </Link>
          <CardTitle className="text-4xl">Login to your account</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
