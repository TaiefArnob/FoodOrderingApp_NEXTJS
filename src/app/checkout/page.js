"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ssl");

  // Name, Phone, Address fields
  const [name, setName] = useState(session?.user?.name || "");
  const [phone, setPhone] = useState(session?.user?.phone || "");
  const [address, setAddress] = useState("");

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const vat = total * 0.05;
  const grandTotal = total + vat;

  const handlePayment = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    if (!session) return router.push("/login");
    if (!name || !phone || !address) return alert("Please fill in all fields!");

    setLoading(true);
    const order_id = uuidv4();

    try {
      if (paymentMethod === "ssl") {
        // Online payment via SSLCommerz
        const res = await axios.post("/api/payment/sslcommerz-payment", {
          amount: grandTotal,
          customer_name: name,
          customer_email: session.user.email,
          customer_phone: phone,
          customer_address: address,
          order_id,
          items: cart,
        });

        if (res.data.GatewayPageURL) {
          // Save order in DB as Pending before redirect
          await axios.post("/api/orders", {
            order_id,
            items: cart,
            total: grandTotal,
            payment_method: "SSL",
            user_email: session.user.email,
            status: "Pending",
            customer_name: name,
            customer_phone: phone,
            customer_address: address,
            createdAt: new Date(),
          });

          window.location.href = res.data.GatewayPageURL;
        } else {
          alert("Payment initiation failed!");
        }
      } else {
        // Cash on Delivery
        await axios.post("/api/orders", {
          order_id,
          items: cart,
          total: grandTotal,
          payment_method: "COD",
          user_email: session.user.email,
          status: "Pending",
          customer_name: name,
          customer_phone: phone,
          customer_address: address,
          createdAt: new Date(),
        });

        clearCart();
        alert("Order placed successfully! You chose Cash on Delivery.");
        router.push("/orders");
      }
    } catch (err) {
      console.error(err);
      alert("Payment/order failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen flex flex-col gap-6">
      <h1 className="text-4xl font-bold text-amber-700 mb-6">Checkout</h1>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {/* Name, Phone, Address Fields */}
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />
        <textarea
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-3 rounded-lg"
          rows={3}
        ></textarea>

        <p>Total: ৳ {total}</p>
        <p>VAT (5%): ৳ {vat.toFixed(2)}</p>
        <p className="font-bold text-amber-700 text-lg">
          Grand Total: ৳ {grandTotal.toFixed(2)}
        </p>

        {/* Payment Selection */}
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => setPaymentMethod("ssl")}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
              paymentMethod === "ssl"
                ? "border-amber-500 bg-amber-50"
                : "border-gray-300"
            }`}
          >
            <FaCreditCard /> Pay Online
          </button>
          <button
            onClick={() => setPaymentMethod("cod")}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
              paymentMethod === "cod"
                ? "border-amber-500 bg-amber-50"
                : "border-gray-300"
            }`}
          >
            <FaMoneyBillWave /> Cash on Delivery
          </button>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full shadow-md transition disabled:opacity-50"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>

      <Link
        href="/cart"
        className="text-gray-500 hover:text-gray-700 underline mt-4"
      >
        Back to Cart
      </Link>
    </div>
  );
}
