import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { name, email, password } = req.body;

      const newUser = await User.create({ name, email, password });
      res.status(201).json({ success: true, data: newUser });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Only POST method allowed' });
  }
}
