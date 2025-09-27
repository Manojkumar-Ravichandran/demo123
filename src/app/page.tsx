"use client";

import Script from "next/script";

// Type definitions for Razorpay
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open(): void;
    };
  }
}

export default function Home() {
  const handlePayment = async () => {
    // Call backend to create order
    const res = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 500 }), // ₹500
    });

    const data = await res.json();
    if (!data.orderId) {
      alert("Order creation failed");
      return;
    }

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: 500 * 100,
      currency: "INR",
      name: "My Test App",
      description: "Test Transaction",
      order_id: data.orderId,
      handler: function (response: RazorpayResponse) {
        alert("Payment successful: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Pay ₹500
      </button>
    </div>
  );
}