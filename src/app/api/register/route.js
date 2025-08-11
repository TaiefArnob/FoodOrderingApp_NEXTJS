import User from "@/app/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password, profileImage } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    await mongoose.connect(process.env.MONGO_URL);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const newUser = new User({ 
      name, 
      email, 
      password, 
      profileImage: profileImage || "" // fallback if no profileImage provided
    });
    const createdUser = await newUser.save();

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: createdUser._id.toString(),
        name: createdUser.name,
        email: createdUser.email,
        profileImage: createdUser.profileImage || "",
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
