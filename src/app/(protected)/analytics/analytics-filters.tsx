'use client';

import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export function AnalyticsFilters() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [timeframe, setTimeframe] = useState('30d');

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);

    const now = new Date();
    let from: Date;

    switch (value) {
      case '7d':
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    setDateRange({ from, to: now });
  };

  return (
    <div className='flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg'>
      <div className='flex items-center space-x-2'>
        <label className='text-sm font-medium'>Time Range:</label>
        <Select value={timeframe} onValueChange={handleTimeframeChange}>
          <SelectTrigger className='w-32'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='7d'>Last 7 days</SelectItem>
            <SelectItem value='30d'>Last 30 days</SelectItem>
            <SelectItem value='90d'>Last 90 days</SelectItem>
            <SelectItem value='1y'>Last year</SelectItem>
            <SelectItem value='custom'>Custom range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {timeframe === 'custom' && (
        <div className='flex items-center space-x-2'>
          <label className='text-sm font-medium'>Custom Range:</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-[280px] justify-start text-left font-normal',
                  !dateRange.from && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {dateRange.from.toLocaleDateString()} -{' '}
                      {dateRange.to.toLocaleDateString()}
                    </>
                  ) : (
                    dateRange.from.toLocaleDateString()
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                initialFocus
                mode='range'
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={range =>
                  setDateRange({
                    from: range?.from,
                    to: range?.to,
                  })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <div className='flex items-center space-x-2'>
        <label className='text-sm font-medium'>Department:</label>
        <Select defaultValue='all'>
          <SelectTrigger className='w-40'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Departments</SelectItem>
            <SelectItem value='cardiology'>Cardiology</SelectItem>
            <SelectItem value='emergency'>Emergency</SelectItem>
            <SelectItem value='pediatrics'>Pediatrics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center space-x-2'>
        <label className='text-sm font-medium'>Status:</label>
        <Select defaultValue='all'>
          <SelectTrigger className='w-32'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Status</SelectItem>
            <SelectItem value='pending'>Pending</SelectItem>
            <SelectItem value='confirmed'>Confirmed</SelectItem>
            <SelectItem value='completed'>Completed</SelectItem>
            <SelectItem value='cancelled'>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant='default' size='sm'>
        Apply Filters
      </Button>

      <Button variant='outline' size='sm'>
        Reset
      </Button>
    </div>
  );
}
