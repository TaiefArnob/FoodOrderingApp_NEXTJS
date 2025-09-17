"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineShoppingCart, AiFillDelete } from "react-icons/ai";
import { FiPlus, FiMinus } from "react-icons/fi";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const VAT_PERCENT = 10;
  const DELIVERY_CHARGE = 50;
  const vat = (subtotal * VAT_PERCENT) / 100;
  const grandTotal = subtotal + vat + DELIVERY_CHARGE;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-amber-700 mb-8 flex items-center gap-3">
        <AiOutlineShoppingCart size={36} />
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="flex flex-col justify-center items-center mt-16">
          <AiOutlineShoppingCart className="text-gray-300 text-9xl mb-6 animate-bounce" />
          <p className="text-gray-500 text-xl mb-6">Your cart is empty.</p>
          <Link
            href="/menu"
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full shadow-md transition"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Cart items */}
          <div className="flex-1 space-y-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition gap-4"
              >
                {/* Product image */}
                <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Product details */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-amber-600">৳ {item.price} each</p>
                    <p className="text-gray-500 text-sm">
                      Subtotal: ৳ {item.price * item.quantity}
                    </p>
                  </div>

                  {/* Quantity control */}
                  <div className="flex items-center bg-gray-100 rounded-full shadow-sm overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, Math.max(1, item.quantity - 1))
                      }
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition text-amber-700 font-bold flex items-center justify-center rounded-l-full scale-100 hover:scale-105"
                    >
                      <FiMinus size={18} />
                    </button>
                    <span className="px-6 py-2 text-lg font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition text-amber-700 font-bold flex items-center justify-center rounded-r-full scale-100 hover:scale-105"
                    >
                      <FiPlus size={18} />
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-600 text-2xl p-2 rounded-full transition self-start md:self-auto"
                    title="Remove Item"
                  >
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Price summary */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold text-amber-700 mb-4">Price Summary</h2>
            <div className="flex flex-col gap-2 text-gray-700 text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>৳ {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT ({VAT_PERCENT}%):</span>
                <span>৳ {vat}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>৳ {DELIVERY_CHARGE}</span>
              </div>
              <hr className="my-2 border-gray-300" />
              <div className="flex justify-between text-xl font-bold text-amber-700">
                <span>Grand Total:</span>
                <span>৳ {grandTotal}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6 flex-wrap justify-end">
              <button
                onClick={clearCart}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-md transition"
              >
                Clear Cart
              </button>
              <Link
                href="/checkout"
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full shadow-md transition"
              >
                Proceed to Payment
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
