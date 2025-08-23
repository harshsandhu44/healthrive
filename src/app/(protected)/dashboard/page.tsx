import { buttonVariants } from "@/components/ui/button";
import { getUserWithProfile } from "@/lib/db/auth";
import { redirect } from "next/navigation";

import { SignOut } from "../components/SignOut";

export default async function DashboardPage() {
  const { user, profile } = await getUserWithProfile();

  if (!user || !profile) {
    redirect("/sign-in");
  }

  const firstName = user.user_metadata?.first_name || "";
  const lastName = user.user_metadata?.last_name || "";
  const phone = user.user_metadata?.phone || "";

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{firstName ? `, ${firstName}` : ""}!
          </p>
          <SignOut className={buttonVariants({ variant: "ghost" })} />
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
                {profile.account_type}
              </p>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold">Quick Actions</h3>
            <div className="mt-2 space-y-2">
              <button className="text-sm text-primary hover:underline">
                View Patients
              </button>
              <button className="text-sm text-primary hover:underline">
                Schedule
              </button>
              <button className="text-sm text-primary hover:underline">
                Settings
              </button>
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
    </div>
  );
}
