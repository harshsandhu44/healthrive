import { BuildingIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { getDepartments } from './actions';
import { AddDepartmentDialog } from './add-department-dialog';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <div className='container mx-auto px-4'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Departments</h1>
          <p className='text-muted-foreground'>
            Manage departments in your organization
          </p>
        </div>
        <AddDepartmentDialog>
          <Button>
            <PlusIcon />
            Add Department
          </Button>
        </AddDepartmentDialog>
      </div>

      {departments.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <BuildingIcon className='h-12 w-12 text-muted-foreground mb-4' />
          <h3 className='text-lg font-medium mb-2'>No departments found</h3>
          <p className='text-muted-foreground mb-4'>
            Get started by adding your first department to the organization.
          </p>
          <AddDepartmentDialog>
            <Button>
              <PlusIcon />
              Add Department
            </Button>
          </AddDepartmentDialog>
        </div>
      ) : (
        <DataTable columns={columns} data={departments} />
      )}
    </div>
  );
}
