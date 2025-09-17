// app/api/menu/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";
import MenuItem from "@/app/models/MenuItem";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL);
  }
}

// ✅ CREATE Menu Item
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    await connectDB();
    const { name, image, price, category, rating } = await req.json();
    if (!name || !price || !category || !image) {
      return new Response(JSON.stringify({ error: "All fields required" }), { status: 400 });
    }

    const item = await MenuItem.create({
      name,
      image,
      price,
      category,
      rating: rating || 4, // default rating 4 if not provided
    });

    return new Response(JSON.stringify(item), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ✅ READ Menu Items
export async function GET() {
  try {
    await connectDB();
    const items = await MenuItem.find()
      .populate("category")
      .sort({ createdAt: -1 });
    return new Response(JSON.stringify(items), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ✅ UPDATE Menu Item
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    await connectDB();
    const { id, name, image, price, category, rating } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "ID required" }), { status: 400 });
    }

    const updated = await MenuItem.findByIdAndUpdate(
      id,
      { name, image, price, category, rating },
      { new: true }
    );

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ✅ DELETE Menu Item
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    await connectDB();
    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "ID required" }), { status: 400 });
    }

    await MenuItem.findByIdAndDelete(id);

    return new Response(JSON.stringify({ message: "Item deleted" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
