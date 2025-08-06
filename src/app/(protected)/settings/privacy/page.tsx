import { ConsentPreferences } from "@/components/consent/consent-preferences";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Settings | Healthrive",
  description: "Manage your privacy and cookie preferences",
};

export default function PrivacySettingsPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <ConsentPreferences />
    </main>
  );
}