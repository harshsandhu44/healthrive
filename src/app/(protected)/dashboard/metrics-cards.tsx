'use client';

import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  StethoscopeIcon,
  UsersIcon,
  XCircleIcon,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { DashboardMetrics } from './analytics-actions';

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: 'Total Patients',
      value: metrics.totalPatients.toLocaleString(),
      icon: UsersIcon,
      description: 'Registered patients',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Doctors',
      value: metrics.totalDoctors.toLocaleString(),
      icon: StethoscopeIcon,
      description: 'Active doctors',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Appointments',
      value: metrics.totalAppointments.toLocaleString(),
      icon: CalendarIcon,
      description: 'All appointments',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: "Today's Appointments",
      value: metrics.todayAppointments.toLocaleString(),
      icon: ClockIcon,
      description: 'Scheduled today',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completed',
      value: metrics.completedAppointments.toLocaleString(),
      icon: CheckCircleIcon,
      description: 'Finished appointments',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Cancelled',
      value: metrics.cancelledAppointments.toLocaleString(),
      icon: XCircleIcon,
      description: 'Cancelled appointments',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{card.value}</div>
            <p className='text-xs text-muted-foreground'>{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
