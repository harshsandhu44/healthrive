'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { PatientDemographics } from './analytics-actions';

interface PatientDemographicsProps {
  demographics: PatientDemographics;
}

export function PatientDemographicsChart({
  demographics,
}: PatientDemographicsProps) {
  const contactInfoData = [
    {
      name: 'With Email',
      value: demographics.patientsWithEmail,
      color: 'hsl(142 76% 36%)',
    },
    {
      name: 'With Phone',
      value: demographics.patientsWithPhone,
      color: 'hsl(221 83% 53%)',
    },
    {
      name: 'With Medical Records',
      value: demographics.patientsWithMedicalRecords,
      color: 'hsl(47 96% 53%)',
    },
  ];

  // const completenessData = [
  //   {
  //     name: 'Complete Profiles',
  //     value: demographics.patientsWithEmail + demographics.patientsWithPhone,
  //     color: 'hsl(142 76% 36%)',
  //   },
  //   {
  //     name: 'Incomplete Profiles',
  //     value:
  //       demographics.totalPatients -
  //       (demographics.patientsWithEmail + demographics.patientsWithPhone),
  //     color: 'hsl(0 84% 60%)',
  //   },
  // ];

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {/* Patient Information Completeness */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>
                  {demographics.totalPatients}
                </div>
                <div className='text-sm text-muted-foreground'>
                  Total Patients
                </div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  {demographics.newPatientsThisMonth}
                </div>
                <div className='text-sm text-muted-foreground'>
                  New This Month
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm'>With Email</span>
                <span className='text-sm font-medium'>
                  {demographics.patientsWithEmail}
                  <span className='text-muted-foreground ml-1'>
                    (
                    {(
                      (demographics.patientsWithEmail /
                        demographics.totalPatients) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm'>With Phone</span>
                <span className='text-sm font-medium'>
                  {demographics.patientsWithPhone}
                  <span className='text-muted-foreground ml-1'>
                    (
                    {(
                      (demographics.patientsWithPhone /
                        demographics.totalPatients) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm'>With Medical Records</span>
                <span className='text-sm font-medium'>
                  {demographics.patientsWithMedicalRecords}
                  <span className='text-muted-foreground ml-1'>
                    (
                    {(
                      (demographics.patientsWithMedicalRecords /
                        demographics.totalPatients) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={250}>
            <PieChart>
              <Pie
                data={contactInfoData}
                cx='50%'
                cy='50%'
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {contactInfoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
