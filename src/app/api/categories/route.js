import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";
import Category from "@/app/models/Category";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL);
  }
}

// ✅ CREATE category
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    await connectDB();
    const { name, description } = await req.json();
    if (!name) return new Response(JSON.stringify({ error: "Name required" }), { status: 400 });

    const category = await Category.create({ name, description });
    return new Response(JSON.stringify(category), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ✅ READ categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ✅ UPDATE category
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    await connectDB();
    const { id, name, description } = await req.json();
    if (!id) return new Response(JSON.stringify({ error: "Category ID required" }), { status: 400 });

    const updated = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ✅ DELETE category
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    await connectDB();
    const { id } = await req.json();
    if (!id) return new Response(JSON.stringify({ error: "Category ID required" }), { status: 400 });

    await Category.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: "Category deleted" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
