import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';

import { dbConnect } from '@/lib/mongodb';
import SavedVisualization from '@/models/SavedVisualization';
import authOptions from '@/pages/api/auth/[...nextauth]'; 

// Handle POST requests to save visualization data
export async function POST(req: NextRequest) {
  // Fetch the user session from the server
  const session = (await getServerSession(authOptions)) as Session | null;

  // Ensure user is authenticated and has a valid email
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, data, name } = await req.json();
  if (!type || !data || !name) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  
  await dbConnect();
  await SavedVisualization.create({
    userEmail: session.user.email,
    type,
    name,
    data,
  });
  

  // Respond with success
  return NextResponse.json({ success: true });
}
