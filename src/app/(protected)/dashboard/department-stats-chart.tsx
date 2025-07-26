'use client';

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { DepartmentStats } from './analytics-actions';

interface DepartmentStatsChartProps {
  departments: DepartmentStats[];
}

const COLORS = [
  'hsl(221 83% 53%)',
  'hsl(142 76% 36%)',
  'hsl(47 96% 53%)',
  'hsl(0 84% 60%)',
  'hsl(271 81% 56%)',
  'hsl(24 95% 53%)',
];

export function DepartmentStatsChart({
  departments,
}: DepartmentStatsChartProps) {
  const pieData = departments.map((dept, index) => ({
    name: dept.name,
    value: dept.totalAppointments,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {/* Department Appointments Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={pieData}
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
                {pieData.map((entry, index) => (
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

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={departments} layout='horizontal'>
              <XAxis type='number' tick={{ fontSize: 12 }} />
              <YAxis
                type='category'
                dataKey='name'
                tick={{ fontSize: 12 }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar
                dataKey='avgAppointmentsPerDoctor'
                fill='hsl(var(--primary))'
                radius={[0, 4, 4, 0]}
                name='Avg Appointments per Doctor'
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
