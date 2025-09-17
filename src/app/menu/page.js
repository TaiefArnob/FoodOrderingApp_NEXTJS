"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

export default function MenuPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", image: "", price: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchItems(), fetchCategories()]);
    setLoading(false);
  };

  const fetchItems = async () => {
    const res = await fetch("/api/menu");
    const data = await res.json();
    setItems(data);
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...form, id: editingId } : form;

    const res = await fetch("/api/menu", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) return toast.error(data.error);

    toast.success(editingId ? "Item updated" : "Item created");
    setForm({ name: "", image: "", price: "", category: "" });
    setEditingId(null);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete item?")) return;
    const res = await fetch("/api/menu", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);

    toast.success("Item deleted");
    fetchItems();
  };

  const handleRating = async (itemId, value) => {
    const res = await fetch("/api/menu/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, value }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);

    toast.success(`Rated ${value}⭐`);
    fetchItems();
  };

  const RatingStars = ({ item }) => {
    const average =
      item.ratings && item.ratings.length > 0
        ? (
            item.ratings.reduce((acc, r) => acc + r.value, 0) /
            item.ratings.length
          ).toFixed(1)
        : "0.0";

    return (
      <div className="mt-2 flex items-center justify-between">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(item._id, star)}
              className="text-lg hover:scale-110 transition-transform duration-200"
            >
              <span
                className={
                  item.ratings && item.ratings.some((r) => r.value >= star)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>
        <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-full shadow-sm">
          {average} ⭐ ({item.ratings?.length || 0})
        </span>
      </div>
    );
  };

  if (status === "loading" || loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
        <span className="ml-4 text-xl font-semibold text-amber-700">Loading menu...</span>
      </div>
    );

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <img
        src="/logo.png"
        alt="Watermark"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none w-1/2"
      />

      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-800 drop-shadow-lg">
        Our Menu
      </h1>
      <p className="text-center text-gray-700 text-lg md:text-xl mb-16 max-w-3xl mx-auto">
        Explore our delicious dishes crafted with love. Order your favorites now!
      </p>

      {session?.user?.admin && (
        <form
          className="bg-white p-6 rounded-xl shadow-lg mb-12"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold mb-4 text-amber-800">
            Manage Menu Item
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium">Name</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Item name"
              />
            </div>

            <div>
              <label className="font-medium">Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const toastId = toast.loading("Uploading image...");
                  try {
                    const formData = new FormData();
                    formData.append("file", file);

                    const res = await fetch("/api/upload-menu", {
                      method: "POST",
                      body: formData,
                    });
                    const data = await res.json();

                    if (data.url) {
                      setForm({ ...form, image: data.url });
                      toast.success("Image uploaded!", { id: toastId });
                    } else {
                      toast.error("Upload failed", { id: toastId });
                    }
                  } catch (err) {
                    toast.error("Upload error", { id: toastId });
                  }
                }}
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="mt-2 h-40 w-full object-cover rounded shadow-md"
                />
              )}
            </div>

            <div>
              <label className="font-medium">Price</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Price"
              />
            </div>

            <div>
              <label className="font-medium">Category</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300">
            {editingId ? "Update Item" : "Add Item"}
          </button>
        </form>
      )}

      {categories.map((cat) => {
        const catItems = items.filter((item) => item.category?._id === cat._id);
        return (
          <div key={cat._id} className="mb-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-amber-700">{cat.name}</h2>
                {cat.description && (
                  <p className="text-lg md:text-xl text-gray-600 mt-2 max-w-2xl">
                    {cat.description}
                  </p>
                )}
              </div>
            </div>
            <hr className="border-gray-300 mb-8" />

            {catItems.length === 0 ? (
              <p className="text-gray-500 italic">No items available under this category.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {catItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-xl md:text-2xl">{item.name}</h3>
                        <p className="text-amber-600 font-bold text-lg md:text-xl mt-2">
                          ৳ {item.price}
                        </p>
                        <RatingStars item={item} />
                      </div>

                      {session?.user?.admin ? (
                        <div className="flex gap-3 mt-4 justify-end">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full text-sm transition-all duration-300"
                            onClick={() => {
                              setEditingId(item._id);
                              setForm({
                                name: item.name,
                                image: item.image,
                                price: item.price,
                                category: item.category._id,
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm transition-all duration-300"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <button
                          className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-full transition-all duration-300"
                          onClick={() => {
                            if (!session) {
                              window.location.href = "/login";
                            } else {
                              addToCart(item);
                            }
                          }}
                        >
                          Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
