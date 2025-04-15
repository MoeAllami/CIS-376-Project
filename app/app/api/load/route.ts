import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';

import { dbConnect } from '@/lib/mongodb';
import SavedVisualization from '@/models/SavedVisualization';
import authOptions from '@/pages/api/auth/[...nextauth]';

// Handle GET requests to load saved visualizations for the current user
export async function GET(req: NextRequest) {
  // Get the current user session
  const session = (await getServerSession(authOptions)) as Session | null;

  // Ensure the user is authenticated and has an email
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Connect to the database
  await dbConnect();

  // Parse query parameters
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');       // used when loading a specific visualization
  const type = searchParams.get('type');   // used when listing all of a specific type

  // If an ID is provided, load one visualization by ID
  if (id) {
    const visualization = await SavedVisualization.findOne({
      _id: id,
      userEmail: session.user.email,
    });

    if (!visualization) {
      return NextResponse.json({ error: 'Visualization not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, visualization });
  }

  // If a type is provided, load all visualizations of that type
  if (type) {
    const visualizations = await SavedVisualization.find({
      userEmail: session.user.email,
      type,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, visualizations });
  }

  // Otherwise return all saved visualizations for the user
  const visualizations = await SavedVisualization.find({
    userEmail: session.user.email,
  }).sort({ createdAt: -1 });

  return NextResponse.json({ success: true, visualizations });
}
