import { Suspense } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import {
  getAppointmentTrends,
  getDepartmentStats,
  getDoctorPerformance,
  getPatientDemographics,
} from '../dashboard/analytics-actions';

import { AnalyticsFilters } from './analytics-filters';
import { DoctorPerformanceTable } from './doctor-performance-table';

function AnalyticsSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className='h-6 w-32' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-[200px] w-full' />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-48' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-[400px] w-full' />
        </CardContent>
      </Card>
    </div>
  );
}

async function AnalyticsContent() {
  try {
    const [
      appointmentTrends,
      departmentStats,
      doctorPerformance,
      patientDemographics,
    ] = await Promise.all([
      getAppointmentTrends(30), // 30 days for analytics
      getDepartmentStats(),
      getDoctorPerformance(),
      getPatientDemographics(),
    ]);

    return (
      <div className='space-y-6'>
        {/* Analytics Filters */}
        <AnalyticsFilters />

        {/* Key Performance Indicators */}
        <div className='grid gap-4 md:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Appointments (30d)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {appointmentTrends.reduce(
                  (sum, day) => sum + day.appointments,
                  0
                )}
              </div>
              <p className='text-xs text-muted-foreground'>
                {appointmentTrends.length > 1 &&
                  `Avg ${Math.round(appointmentTrends.reduce((sum, day) => sum + day.appointments, 0) / appointmentTrends.length)} per day`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {(() => {
                  const total = appointmentTrends.reduce(
                    (sum, day) => sum + day.appointments,
                    0
                  );
                  const completed = appointmentTrends.reduce(
                    (sum, day) => sum + day.completed,
                    0
                  );
                  return total > 0
                    ? `${Math.round((completed / total) * 100)}%`
                    : '0%';
                })()}
              </div>
              <p className='text-xs text-muted-foreground'>
                {appointmentTrends.reduce((sum, day) => sum + day.completed, 0)}{' '}
                completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Cancellation Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-600'>
                {(() => {
                  const total = appointmentTrends.reduce(
                    (sum, day) => sum + day.appointments,
                    0
                  );
                  const cancelled = appointmentTrends.reduce(
                    (sum, day) => sum + day.cancelled,
                    0
                  );
                  return total > 0
                    ? `${Math.round((cancelled / total) * 100)}%`
                    : '0%';
                })()}
              </div>
              <p className='text-xs text-muted-foreground'>
                {appointmentTrends.reduce((sum, day) => sum + day.cancelled, 0)}{' '}
                cancelled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Departments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-blue-600'>
                {departmentStats.length}
              </div>
              <p className='text-xs text-muted-foreground'>
                {departmentStats.reduce(
                  (sum, dept) => sum + dept.totalDoctors,
                  0
                )}{' '}
                doctors total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Doctor Performance Table */}
        <DoctorPerformanceTable doctors={doctorPerformance} />

        {/* Department Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Department Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {departmentStats.map(dept => (
                <div
                  key={dept.name}
                  className='flex items-center justify-between p-4 border rounded-lg'
                >
                  <div>
                    <h3 className='font-medium'>{dept.name}</h3>
                    <p className='text-sm text-muted-foreground'>
                      {dept.totalDoctors} doctors • {dept.totalAppointments}{' '}
                      appointments
                    </p>
                  </div>
                  <div className='text-right'>
                    <div className='text-2xl font-bold text-primary'>
                      {dept.avgAppointmentsPerDoctor}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      avg per doctor
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Analytics Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Analytics Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <div className='text-center p-4 border rounded-lg'>
                <div className='text-2xl font-bold text-green-600'>
                  {patientDemographics.totalPatients}
                </div>
                <p className='text-sm text-muted-foreground'>Total Patients</p>
              </div>
              <div className='text-center p-4 border rounded-lg'>
                <div className='text-2xl font-bold text-blue-600'>
                  {patientDemographics.newPatientsThisMonth}
                </div>
                <p className='text-sm text-muted-foreground'>New This Month</p>
              </div>
              <div className='text-center p-4 border rounded-lg'>
                <div className='text-2xl font-bold text-purple-600'>
                  {Math.round(
                    (patientDemographics.patientsWithEmail /
                      patientDemographics.totalPatients) *
                      100
                  )}
                  %
                </div>
                <p className='text-sm text-muted-foreground'>Have Email</p>
              </div>
              <div className='text-center p-4 border rounded-lg'>
                <div className='text-2xl font-bold text-orange-600'>
                  {Math.round(
                    (patientDemographics.patientsWithMedicalRecords /
                      patientDemographics.totalPatients) *
                      100
                  )}
                  %
                </div>
                <p className='text-sm text-muted-foreground'>
                  Have Med Records
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Analytics error:', error);
    return (
      <div className='flex flex-col items-center justify-center h-96'>
        <p className='text-muted-foreground mb-4'>
          Unable to load analytics data
        </p>
        <p className='text-sm text-muted-foreground'>
          Please check your connection and try again
        </p>
      </div>
    );
  }
}

export default function AnalyticsPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Analytics</h1>
        <p className='text-muted-foreground'>
          Detailed insights and performance metrics for your organization
        </p>
      </div>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}
