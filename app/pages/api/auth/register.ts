import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST")
    return res.status(405).json({ message: "Only POST requests allowed" });

  await dbConnect(); // Connect to MongoDB

  const { name, email, password } = req.body;

  // Check if a user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "Email already in use" });

  // Hash the password securely before saving
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create a new user in the database
  const newUser = await User.create({ name, email, password: hashedPassword });

  // Return the created user
  return res.status(201).json({ user: newUser });
}
