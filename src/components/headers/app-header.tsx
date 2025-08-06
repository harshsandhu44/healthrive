import { SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { SettingsModal } from "@/components/settings";
import { ThemeToggle } from "@/components/theme";

export const SiteHeader = () => {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle variant="inline" showDescription={false} />
          <SettingsModal />
          <OrganizationSwitcher hidePersonal />
        </div>
      </div>
    </header>
  );
};
