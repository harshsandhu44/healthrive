'use client';

import { Building2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreateOrganization() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Auto-generate slug from name
      ...(field === 'name' && {
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      }),
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Organization name is required');
      return;
    }

    setIsLoading(true);
    try {
      // Create organization using Clerk
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          slug: formData.slug.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create organization');
      }

      // Redirect to dashboard after creation
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to create organization. Please try again.');
      console.error('Organization creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <Building2 className='h-12 w-12 mx-auto mb-4 text-gray-600' />
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Create Organization
          </h1>
          <p className='text-gray-600'>
            Set up your organization to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Plus className='h-5 w-5' />
              New Organization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {error && (
                <div className='p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md'>
                  {error}
                </div>
              )}

              <div className='space-y-2'>
                <Label htmlFor='name'>Organization Name</Label>
                <Input
                  id='name'
                  type='text'
                  placeholder='Enter organization name'
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='slug'>Organization Slug</Label>
                <Input
                  id='slug'
                  type='text'
                  placeholder='organization-slug'
                  value={formData.slug}
                  onChange={e => handleInputChange('slug', e.target.value)}
                  disabled={isLoading}
                />
                <p className='text-xs text-gray-500'>
                  This will be used in URLs. Leave empty to auto-generate.
                </p>
              </div>

              <Button
                type='submit'
                className='w-full'
                disabled={isLoading || !formData.name.trim()}
              >
                {isLoading ? (
                  <>
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white mr-2' />
                    Creating...
                  </>
                ) : (
                  'Create Organization'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
