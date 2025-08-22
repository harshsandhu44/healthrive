import { ArrowLeftCircleIcon } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="font-mono container h-screen flex items-center justify-center">
      <div className="space-y-6 w-full">
        <div>
          <Link
            href="/"
            className="mb-6 text-sm flex items-center gap-2 hover:underline underline-offset-4"
          >
            <ArrowLeftCircleIcon className="size-4" />
            Go Back
          </Link>
          <h1 className="text-4xl">Login to your account</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
