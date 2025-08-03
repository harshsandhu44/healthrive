import { Logo } from "@/components/icons";
import { OrganizationList } from "@clerk/nextjs";
import Link from "next/link";

export default async function OrganizationPage() {
  return (
    <main className="container min-h-screen max-w-sm flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6">
        <Link href="/">
          <Logo className="size-10 mr-auto" />
        </Link>
        <h1 className="text-4xl leading-tight font-bold">
          You are not part of an organization
        </h1>
        <OrganizationList
          hidePersonal
          afterCreateOrganizationUrl="/dashboard"
          afterSelectOrganizationUrl="/dashboard"
        />
      </div>
    </main>
  );
}
