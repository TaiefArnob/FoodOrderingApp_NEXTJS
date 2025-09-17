"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user) {
      setUser(session.user);
      setName(session.user.name || "");
      setPhone(session.user.phone || "");
      setAddress(session.user.address || "");
      setIsAdmin(session.user.admin || false);
    }
  }, [status, session, router]);

  useEffect(() => {
    if (user) {
      console.log("📌 User Profile Details:", {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        isAdmin: isAdmin,
      });
    }
  }, [user, isAdmin]);

  if (status === "loading")
    return <p className="text-center mt-10">Loading...</p>;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (selectedFile.size > 1 * 1024 * 1024) {
      toast.error("Image size cannot be more than 1 MB");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an image first");

    setUploading(true);
    try {
      setUser({ ...user, profileImage: URL.createObjectURL(file) });

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      const updateForm = new FormData();
      updateForm.append("profileImage", uploadData.url);

      const updateRes = await fetch("/api/user/updateProfileImage", {
        method: "POST",
        body: updateForm,
      });
      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.message || "Update failed");

      setUser(updateData.user);
      setPreview(null);
      setFile(null);
      setFileName("");

      toast.success("Profile picture updated!");
      if (update) await update({ user: updateData.user });
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("address", address);

      const res = await fetch("/api/user/updateProfileImage", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setUser(data.user);
      toast.success("Profile updated successfully!");
      if (update) await update({ user: data.user });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 px-4 py-10">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Profile Card */}
        <div className="flex-1 bg-white rounded-3xl p-8 shadow-xl border border-amber-200">
          <h1 className="text-3xl font-extrabold text-[#4b0000] mb-6 text-center">
            My Profile
          </h1>

          <div className="flex flex-col items-center">
            <div className="relative w-[140px] h-[140px] rounded-full overflow-hidden">
              {preview ? (
                <Image
                  src={preview}
                  width={140}
                  height={140}
                  className="object-cover w-full h-full border-4 border-amber-400 shadow-lg"
                  alt="Profile Preview"
                />
              ) : user?.profileImage ? (
                <Image
                  src={user.profileImage}
                  width={140}
                  height={140}
                  className="object-cover w-full h-full border-4 border-amber-400 shadow-lg"
                  alt="Profile"
                />
              ) : (
                <FaUserCircle className="w-full h-full text-gray-400 border-4 border-amber-400 shadow-lg" />
              )}

              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-white font-semibold">Uploading...</span>
                </div>
              )}
            </div>

            <label className="mt-5 bg-amber-400 hover:bg-amber-500 text-[#4b0000] font-semibold px-5 py-2 rounded-full shadow-md cursor-pointer transition duration-300">
              Choose Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {fileName && !uploading && (
              <p className="mt-2 text-sm text-gray-600 italic truncate max-w-[200px]">
                Preview: {fileName}
              </p>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`mt-3 px-5 py-2 rounded-full shadow-md font-semibold transition duration-300 ${
                uploading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-amber-400 hover:bg-amber-500 text-[#4b0000]"
              }`}
            >
              {uploading ? "Uploading..." : "Change Picture"}
            </button>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-[#4b0000] font-semibold mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-[#4b0000]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[#4b0000] font-semibold mb-1">
                Phone
              </label>
              <input
                type="tel"
                pattern="^(\+8801[3-9]\d{8})$"
                placeholder="+8801XXXXXXXXX"
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-[#4b0000]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[#4b0000] font-semibold mb-1">
                Address
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-[#4b0000]"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <p className="text-[#4b0000]">
              <strong className="font-semibold">Email:</strong> {user?.email}
            </p>

            <button
              onClick={handleSaveDetails}
              disabled={saving}
              className={`mt-3 w-full px-5 py-2 rounded-full shadow-md font-semibold transition duration-300 ${
                saving
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-amber-400 hover:bg-amber-500 text-[#4b0000]"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Admin Panel (Separate Card) */}
        {isAdmin && (
          <div className="flex-1 bg-white rounded-3xl p-8 shadow-xl border border-amber-200">
            <h2 className="text-2xl font-bold text-[#4b0000] text-center mb-6">
              Admin Panel
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push("/profile")}
                className="w-full px-5 py-4 rounded-xl shadow-md font-semibold bg-amber-200 hover:bg-amber-300 text-[#4b0000] transition duration-300"
              >
                Profile
              </button>
              <button
                onClick={() => router.push("/categories")}
                className="w-full px-5 py-4 rounded-xl shadow-md font-semibold bg-amber-200 hover:bg-amber-300 text-[#4b0000] transition duration-300"
              >
                Categories
              </button>
              <button
                onClick={() => router.push("/menu")}
                className="w-full px-5 py-4 rounded-xl shadow-md font-semibold bg-amber-200 hover:bg-amber-300 text-[#4b0000] transition duration-300"
              >
                Menu Items
              </button>
              <button
                onClick={() => router.push("/users")}
                className="w-full px-5 py-4 rounded-xl shadow-md font-semibold bg-amber-200 hover:bg-amber-300 text-[#4b0000] transition duration-300"
              >
                Users
              </button>
              <button
                onClick={() => router.push("/orders")}
                className="w-full px-5 py-4 rounded-xl shadow-md font-semibold bg-amber-200 hover:bg-amber-300 text-[#4b0000] transition duration-300"
              >
                Orders
              </button>
              <button
                onClick={() => router.push("/stats")}
                className="w-full px-5 py-4 rounded-xl shadow-md font-semibold bg-amber-200 hover:bg-amber-300 text-[#4b0000] transition duration-300"
              >
                Statistics
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
