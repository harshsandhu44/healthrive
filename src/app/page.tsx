import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getUserWithProfile } from "@/lib/db/auth";

export default async function DashboardPage() {
  const { user, profile } = await getUserWithProfile();

  if (!user || !profile) {
    redirect("/sign-in");
  }

  const firstName = user.user_metadata?.first_name || "";
  const lastName = user.user_metadata?.last_name || "";
  const phone = user.user_metadata?.phone || "";

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{firstName ? `, ${firstName}` : ""}!
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold">Profile Information</h3>
          <div className="mt-2 space-y-1 text-sm">
            {(firstName || lastName) && (
              <p>
                <span className="font-medium">Name:</span> {firstName}{" "}
                {lastName}
              </p>
            )}
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            {phone && (
              <p>
                <span className="font-medium">Phone:</span> {phone}
              </p>
            )}
            <p>
              <span className="font-medium">Account Type:</span>{" "}
              <span className="capitalize">
                {profile.account_type.split("_").join(" ")}
              </span>
            </p>
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold">Quick Actions</h3>
          <div className="mt-2 flex flex-col space-y-2">
            <Button variant="secondary">View Patients</Button>
            <Button variant="secondary">Schedule</Button>
            <Button variant="secondary">Settings</Button>
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold">Recent Activity</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No recent activity
          </p>
        </div>
      </div>
    </div>
  );
}