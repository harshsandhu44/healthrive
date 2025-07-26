import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { getAppointments } from './actions';
import { AddAppointmentDialog } from './add-appointment-dialog';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Appointments</h1>
          <p className='text-muted-foreground'>
            Manage patient appointments and scheduling
          </p>
        </div>
        <AddAppointmentDialog>
          <Button>
            <PlusIcon className='mr-2 h-4 w-4' />
            Add Appointment
          </Button>
        </AddAppointmentDialog>
      </div>

      <DataTable columns={columns} data={appointments} />
    </div>
  );
}
