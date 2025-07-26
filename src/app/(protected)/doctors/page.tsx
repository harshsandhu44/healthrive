import { PlusIcon, StethoscopeIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { getDoctors } from './actions';
import { AddDoctorDialog } from './add-doctor-dialog';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <div className='container mx-auto px-4'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Doctors</h1>
          <p className='text-muted-foreground'>
            Manage doctors in your organization
          </p>
        </div>
        <AddDoctorDialog>
          <Button>
            <PlusIcon />
            Add Doctor
          </Button>
        </AddDoctorDialog>
      </div>

      {doctors.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <StethoscopeIcon className='h-12 w-12 text-muted-foreground mb-4' />
          <h3 className='text-lg font-medium mb-2'>No doctors found</h3>
          <p className='text-muted-foreground mb-4'>
            Get started by adding your first doctor to the organization.
          </p>
          <AddDoctorDialog>
            <Button>
              <PlusIcon />
              Add Doctor
            </Button>
          </AddDoctorDialog>
        </div>
      ) : (
        <DataTable columns={columns} data={doctors} />
      )}
    </div>
  );
}
