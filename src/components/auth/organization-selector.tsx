'use client';

import { useOrganizationList } from '@clerk/nextjs';
import { Building2, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Organization {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

interface OrganizationSelectorProps {
  organizations: Organization[];
}

export function OrganizationSelector({
  organizations,
}: OrganizationSelectorProps) {
  const { setActive } = useOrganizationList();
  const router = useRouter();

  const handleSelectOrganization = async (orgId: string) => {
    try {
      await setActive({ organization: orgId });
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to set active organization:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <Building2 className='h-12 w-12 mx-auto mb-4 text-gray-600' />
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Select Organization
          </h1>
          <p className='text-gray-600'>Choose an organization to continue</p>
        </div>

        <div className='space-y-3'>
          {organizations.map(org => (
            <Card
              key={org.id}
              className='cursor-pointer hover:shadow-md transition-shadow'
            >
              <CardContent className='p-4'>
                <Button
                  variant='ghost'
                  className='w-full justify-between h-auto p-0 hover:bg-transparent'
                  onClick={() => handleSelectOrganization(org.id)}
                >
                  <div className='flex items-center space-x-3'>
                    {org.imageUrl ? (
                      <Image
                        src={org.imageUrl}
                        alt={org.name}
                        width={40}
                        height={40}
                        className='h-10 w-10 rounded-full object-cover'
                      />
                    ) : (
                      <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                        <Building2 className='h-5 w-5 text-gray-600' />
                      </div>
                    )}
                    <div className='text-left'>
                      <p className='font-medium text-gray-900'>{org.name}</p>
                      <p className='text-sm text-gray-500'>@{org.slug}</p>
                    </div>
                  </div>
                  <ChevronRight className='h-5 w-5 text-gray-400' />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
