export default function PatientsLayout({
  children,
  quickActions,
}: LayoutProps<"/patients">) {
  return (
    <main className="space-y-6">
      <div className="font-mono">
        <h1 className="text-5xl">Patients</h1>
        <p>View all your patients and their details.</p>
      </div>
      {quickActions}
      {children}
    </main>
  );
}
