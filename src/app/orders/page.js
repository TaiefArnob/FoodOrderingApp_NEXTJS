"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBoxOpen } from "react-icons/fa";
import { MdLocalShipping, MdDoneAll } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // wait for session to load

    if (!session) {
      // Redirect to home if logged out
      router.push("/");
      return;
    }

    fetchOrders();
  }, [session, status]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/orders");
      const data = session.user.admin
        ? res.data
        : res.data.filter((o) => o.user_email === session.user.email);
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put("/api/orders", { orderId, status });
      toast.success("Status updated");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-BD", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    let color = "bg-gray-300";
    if (status === "Pending") color = "bg-yellow-500 text-white";
    if (status === "Processing") color = "bg-blue-500 text-white";
    if (status === "Delivered") color = "bg-green-500 text-white";

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
        {status}
      </span>
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-500 border-solid"></div>
      </div>
    );
  }

  if (!orders.length)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <FaBoxOpen className="text-6xl text-gray-400 mb-3" />
        <p className="text-gray-600 text-lg">No orders found.</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-amber-700 mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold text-gray-700">
                Order ID: <span className="text-gray-900">{order.order_id}</span>
              </p>
              {getStatusBadge(order.status)}
            </div>

            {/* Order Time */}
            <p className="text-sm text-gray-500 mb-3">
              <strong>Order Time:</strong> {formatDate(order.createdAt)}
            </p>

            {/* Customer Info */}
            <div className="grid gap-2 text-gray-700 mb-4">
              <p>
                <strong>Name:</strong> {order.customer_name || "-"}
              </p>
              <p>
                <strong>Address:</strong> {order.customer_address || "-"}
              </p>
              <p>
                <strong>Phone:</strong> {order.customer_phone || "-"}
              </p>
              <p>
                <strong>Total:</strong> ৳ {order.total}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.payment_method}
              </p>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Items:</h3>
              <ul className="space-y-3">
                {order.items.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between items-center text-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">x {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Admin Controls */}
            {session.user.admin && (
              <div className="flex gap-3">
                <button
                  className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                  onClick={() => updateStatus(order.order_id, "Processing")}
                >
                  <MdLocalShipping />
                  Processing
                </button>
                <button
                  className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
                  onClick={() => updateStatus(order.order_id, "Delivered")}
                >
                  <MdDoneAll />
                  Delivered
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
