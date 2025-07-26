import { Suspense } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import {
  getAppointmentTrends,
  getDashboardMetrics,
  getDepartmentStats,
  getPatientDemographics,
  getRecentActivity,
} from './analytics-actions';
import { AppointmentTrendsChart } from './appointment-trends-chart';
import { DepartmentStatsChart } from './department-stats-chart';
import { MetricsCards } from './metrics-cards';
import { PatientDemographicsChart } from './patient-demographics';
import { RecentActivity } from './recent-activity';

function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-8 w-8 rounded-lg' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-16 mb-2' />
              <Skeleton className='h-3 w-32' />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className='h-6 w-32' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-[300px] w-full' />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

async function DashboardContent() {
  try {
    const [
      metrics,
      appointmentTrends,
      departmentStats,
      patientDemographics,
      recentActivity,
    ] = await Promise.all([
      getDashboardMetrics(),
      getAppointmentTrends(7),
      getDepartmentStats(),
      getPatientDemographics(),
      getRecentActivity(),
    ]);

    return (
      <div className='space-y-6'>
        {/* Key Metrics */}
        <MetricsCards metrics={metrics} />

        {/* Charts Row 1 - Appointment Trends */}
        <AppointmentTrendsChart trends={appointmentTrends} />

        {/* Charts Row 2 - Department Stats */}
        <DepartmentStatsChart departments={departmentStats} />

        {/* Charts Row 3 - Patient Demographics and Recent Activity */}
        <div className='grid gap-4 md:grid-cols-3'>
          <div className='md:col-span-2'>
            <PatientDemographicsChart demographics={patientDemographics} />
          </div>
          <div className='md:col-span-1'>
            <RecentActivity activities={recentActivity} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return (
      <div className='flex flex-col items-center justify-center h-96'>
        <p className='text-muted-foreground mb-4'>
          Unable to load dashboard data
        </p>
        <p className='text-sm text-muted-foreground'>
          Please check your connection and try again
        </p>
      </div>
    );
  }
}

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Overview of your healthcare organization
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
