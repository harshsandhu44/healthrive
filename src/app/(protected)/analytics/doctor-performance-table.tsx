'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { DoctorPerformance } from '../dashboard/analytics-actions';

interface DoctorPerformanceTableProps {
  doctors: DoctorPerformance[];
}

export function DoctorPerformanceTable({
  doctors,
}: DoctorPerformanceTableProps) {
  const getPerformanceBadge = (rate: number) => {
    if (rate >= 90)
      return <Badge className='bg-green-100 text-green-800'>Excellent</Badge>;
    if (rate >= 80)
      return <Badge className='bg-blue-100 text-blue-800'>Good</Badge>;
    if (rate >= 70)
      return <Badge className='bg-yellow-100 text-yellow-800'>Average</Badge>;
    return <Badge className='bg-red-100 text-red-800'>Needs Improvement</Badge>;
  };

  const sortedDoctors = [...doctors].sort(
    (a, b) => b.completionRate - a.completionRate
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead className='text-right'>Total Appointments</TableHead>
              <TableHead className='text-right'>Completed</TableHead>
              <TableHead className='text-right'>Cancelled</TableHead>
              <TableHead className='text-right'>Completion Rate</TableHead>
              <TableHead>Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDoctors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className='text-center py-8 text-muted-foreground'
                >
                  No doctor performance data available
                </TableCell>
              </TableRow>
            ) : (
              sortedDoctors.map(doctor => (
                <TableRow key={doctor.id}>
                  <TableCell className='font-medium'>{doctor.name}</TableCell>
                  <TableCell>{doctor.department}</TableCell>
                  <TableCell className='text-muted-foreground'>
                    {doctor.specialization}
                  </TableCell>
                  <TableCell className='text-right font-medium'>
                    {doctor.totalAppointments}
                  </TableCell>
                  <TableCell className='text-right text-green-600'>
                    {doctor.completedAppointments}
                  </TableCell>
                  <TableCell className='text-right text-red-600'>
                    {doctor.cancelledAppointments}
                  </TableCell>
                  <TableCell className='text-right'>
                    <span
                      className={`font-medium ${
                        doctor.completionRate >= 90
                          ? 'text-green-600'
                          : doctor.completionRate >= 80
                            ? 'text-blue-600'
                            : doctor.completionRate >= 70
                              ? 'text-yellow-600'
                              : 'text-red-600'
                      }`}
                    >
                      {doctor.completionRate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {getPerformanceBadge(doctor.completionRate)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
