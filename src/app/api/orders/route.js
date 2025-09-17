import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/app/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

mongoose.connect(process.env.MONGO_URL);

export async function GET(req) {
  try {
    const orders = await Order.find();
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const order = new Order(data);
    await order.save();
    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { orderId, status } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session?.user?.admin)
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const order = await Order.findOneAndUpdate(
      { order_id: orderId },
      { status },
      { new: true }
    );

    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
