import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { AddDoctorDialog } from './add-doctor-dialog';

export default function DoctorsPage() {
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

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {/* Placeholder for doctors list - will be populated with actual data */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Dr. John Smith</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>
                <span className='font-medium'>Specialization:</span> Cardiology
              </p>
              <p className='text-sm text-muted-foreground'>
                <span className='font-medium'>Gender:</span> Male
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Dr. Sarah Johnson</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>
                <span className='font-medium'>Specialization:</span> Pediatrics
              </p>
              <p className='text-sm text-muted-foreground'>
                <span className='font-medium'>Gender:</span> Female
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
