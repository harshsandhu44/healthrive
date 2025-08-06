import { PricingTable } from "@clerk/nextjs";

export default function BillingPage() {
  return (
    <main className="w-full flex flex-col gap-6">
      <h1 className="text-4xl leading-tight font-bold">Please choose a plan</h1>
      <PricingTable forOrganizations />
    </main>
  );
}
