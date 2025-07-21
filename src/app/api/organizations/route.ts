import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.info('🚀 API /organizations: POST request received');

  try {
    const { userId } = await auth();
    console.info('🔐 API /organizations: Auth check', {
      userId: userId ? 'authenticated' : 'not authenticated',
    });

    if (!userId) {
      console.warn('⚠️ API /organizations: Unauthorized request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestBody = await request.json();
    const { name, slug } = requestBody;
    console.info('📥 API /organizations: Request body', { name, slug });

    if (!name || typeof name !== 'string') {
      console.warn('⚠️ API /organizations: Invalid organization name', {
        name,
        type: typeof name,
      });
      return NextResponse.json(
        { error: 'Organization name is required' },
        { status: 400 }
      );
    }

    // Create organization using Clerk
    console.info('📡 API /organizations: Creating organization with Clerk');
    const client = await clerkClient();
    const organizationData = {
      name: name.trim(),
      slug: slug?.trim() || undefined,
      createdBy: userId,
    };
    console.info(
      '📤 API /organizations: Clerk organization data',
      organizationData
    );

    const organization =
      await client.organizations.createOrganization(organizationData);
    console.info('✅ API /organizations: Organization created successfully', {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
    });

    const response = {
      success: true,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
    };
    console.info('📤 API /organizations: Sending success response', response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ API /organizations: Organization creation error', error);
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}
