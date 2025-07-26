import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { getPatients } from './actions';
import { AddPatientDialog } from './add-patient-dialog';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Patients</h1>
          <p className='text-muted-foreground'>
            Manage patient records across all organizations
          </p>
        </div>
        <AddPatientDialog>
          <Button>
            <PlusIcon className='mr-2 h-4 w-4' />
            Add Patient
          </Button>
        </AddPatientDialog>
      </div>

      <DataTable columns={columns} data={patients} />
    </div>
  );
}
