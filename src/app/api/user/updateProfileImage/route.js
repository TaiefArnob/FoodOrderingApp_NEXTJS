import mongoose from "mongoose";
import User from "@/app/models/User";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URL);

    // Verify logged-in user
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get form data
    const formData = await req.formData();
    const name = formData.get("name");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const profileImage = formData.get("profileImage");

    // Only allow updates for certain fields (no email update)
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    if (profileImage) updateFields.profileImage = profileImage;

    // Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      token.sub,
      { $set: updateFields },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email, // Email stays the same
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
        profileImage: updatedUser.profileImage || "",
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
