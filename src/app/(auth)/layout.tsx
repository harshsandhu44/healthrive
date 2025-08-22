import { ArrowLeftCircleIcon } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="font-mono h-screen flex items-center justify-center">
      <div className="space-y-6">
        <div>
          <Link
            href="/"
            className="mb-2 text-sm flex items-center gap-2 hover:underline underline-offset-4"
          >
            <ArrowLeftCircleIcon className="size-4" />
            Go Back
          </Link>
          <h1 className="text-4xl font-bold">Continue to Vylune</h1>
          <p className="text-lg">Enter your email to login</p>
        </div>
        {children}
      </div>
    </div>
  );
}
