import { OrganizationList } from "@clerk/nextjs";

export default async function OrganizationPage() {
  return (
    <main className="flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl leading-tight font-bold">
        You are not part of an organization
      </h1>
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl="/dashboard"
        afterSelectOrganizationUrl="/dashboard"
      />
    </main>
  );
}
