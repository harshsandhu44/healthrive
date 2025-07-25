import { DashboardGate } from '@/components/auth';
import { ProtectedSidebar } from '@/components/sidebars/protected-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardGate>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <ProtectedSidebar variant='inset' />
        <SidebarInset className='max-h-[calc(100vh-1rem)] overflow-y-auto'>
          {/* <ProtectedHeader /> */}
          <div className='flex flex-1 flex-col'>
            <div className='@container/main flex flex-1 flex-col gap-2'>
              <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardGate>
  );
};

export default ProtectedLayout;
