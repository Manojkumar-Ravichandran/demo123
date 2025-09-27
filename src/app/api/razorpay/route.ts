import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: body.amount * 100, // amount in paise
      currency: "INR",
      receipt: "receipt#1",
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ orderId: order.id });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}