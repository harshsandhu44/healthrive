import { PlusIcon, StethoscopeIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getDoctors } from './actions';
import { AddDoctorDialog } from './add-doctor-dialog';

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
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {doctors.map(doctor => (
            <Card key={doctor.id}>
              <CardHeader>
                <CardTitle className='text-lg'>{doctor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>
                    <span className='font-medium'>Specialization:</span>{' '}
                    {doctor.specialization}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    <span className='font-medium'>Gender:</span>{' '}
                    {doctor.gender.charAt(0).toUpperCase() +
                      doctor.gender.slice(1)}
                  </p>
                  {doctor.department_id && (
                    <p className='text-sm text-muted-foreground'>
                      <span className='font-medium'>Department:</span>{' '}
                      {doctor.department_id}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
