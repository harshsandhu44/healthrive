import { Metadata } from "next";
import { DataExportRequestComponent } from "@/components/data-export/data-export-request";
import { getDataExportRequests } from "./actions";

export const metadata: Metadata = {
  title: "Data Export | Healthrive",
  description: "Export your personal data in compliance with GDPR Article 20",
};

export default async function DataExportPage() {
  const existingRequests = await getDataExportRequests();
  
  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <DataExportRequestComponent existingRequests={existingRequests} />
    </main>
  );
}