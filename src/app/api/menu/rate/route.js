// app/api/menu/rate/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "mongoose";
import MenuItem from "@/app/models/MenuItem";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL);
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Login required" }), { status: 403 });
    }

    await connectDB();
    const { itemId, value } = await req.json();

    if (!itemId || !value) {
      return new Response(JSON.stringify({ error: "Item ID and rating required" }), { status: 400 });
    }

    const item = await MenuItem.findById(itemId);
    if (!item) return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });

    // Check if user already rated
    const existing = item.ratings.find((r) => r.user.toString() === session.user.id);
    if (existing) {
      existing.value = value; // update old rating
    } else {
      item.ratings.push({ user: session.user.id, value });
    }

    await item.save();
    return new Response(JSON.stringify({ average: item.averageRating }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
