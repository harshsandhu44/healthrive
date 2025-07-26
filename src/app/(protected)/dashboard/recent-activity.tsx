'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  CalendarIcon,
  StethoscopeIcon,
  UserPlusIcon,
  UsersIcon,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { RecentActivity } from './analytics-actions';

interface RecentActivityProps {
  activities: RecentActivity[];
}

const getActivityIcon = (type: RecentActivity['type']) => {
  switch (type) {
    case 'appointment_created':
      return CalendarIcon;
    case 'appointment_updated':
      return CalendarIcon;
    case 'patient_created':
      return UserPlusIcon;
    case 'doctor_created':
      return StethoscopeIcon;
    default:
      return UsersIcon;
  }
};

const getActivityColor = (type: RecentActivity['type']) => {
  switch (type) {
    case 'appointment_created':
      return 'text-blue-600 bg-blue-50';
    case 'appointment_updated':
      return 'text-purple-600 bg-purple-50';
    case 'patient_created':
      return 'text-green-600 bg-green-50';
    case 'doctor_created':
      return 'text-orange-600 bg-orange-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {activities.length === 0 ? (
            <p className='text-center text-muted-foreground py-8'>
              No recent activity
            </p>
          ) : (
            activities.map(activity => {
              const Icon = getActivityIcon(activity.type);
              const colorClasses = getActivityColor(activity.type);

              return (
                <div key={activity.id} className='flex items-start space-x-3'>
                  <Avatar className='h-9 w-9'>
                    <AvatarFallback className={colorClasses}>
                      <Icon className='h-4 w-4' />
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-1'>
                    <p className='text-sm font-medium'>{activity.title}</p>
                    <p className='text-sm text-muted-foreground'>
                      {activity.description}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
