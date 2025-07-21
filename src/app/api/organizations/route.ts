import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug } = await request.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Organization name is required' },
        { status: 400 }
      );
    }

    // Create organization using Clerk
    const client = await clerkClient();
    const organization = await client.organizations.createOrganization({
      name: name.trim(),
      slug: slug?.trim() || undefined,
      createdBy: userId,
    });

    return NextResponse.json({
      success: true,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
    });
  } catch (error) {
    console.error('Organization creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}
