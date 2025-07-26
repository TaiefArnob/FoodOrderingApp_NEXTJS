import User from "@/app/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    await mongoose.connect(process.env.MONGO_URL);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const newUser = new User({ email, password });
    const createdUser = await newUser.save();

    return NextResponse.json({ message: "User created successfully", user: createdUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
