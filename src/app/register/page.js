"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { signIn } from "next-auth/react";

const Register = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!name) {
      toast.error("Name is required");
      setLoading(false);
      return;
    }
    if (!email) {
      toast.error("Email is required");
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email");
      setLoading(false);
      return;
    }
    if (!password || !confirmPassword) {
      toast.error("Both password fields are required");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      toast.error("Password too short");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      let profileImageUrl = "";

      // Upload profile picture if provided
      if (profileFile) {
        const formData = new FormData();
        formData.append("file", profileFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");

        profileImageUrl = uploadData.url;
      }

      // Send data to register API
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, profileImage: profileImageUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      toast.success("Registration successful!");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast("Redirecting to Google...");
    signIn("google");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 px-4">
      <Toaster position="top-center" />
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border-l-4 border-amber-400">
        <h2 className="text-3xl font-extrabold text-[#4b0000] mb-6 text-center">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold text-[#4b0000]">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-[#4b0000]"
              placeholder="Your name"
              required
            />
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block mb-1 font-semibold text-[#4b0000]">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileFile(e.target.files[0])}
              className="w-full px-2 py-2 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-[#4b0000] bg-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold text-[#4b0000]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-[#4b0000]"
              placeholder="your.email@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-semibold text-[#4b0000]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-[#4b0000]"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-semibold text-[#4b0000]">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-[#4b0000]"
              placeholder="Re-enter your password"
              required
              minLength={6}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 ${
              loading
                ? "bg-amber-300 cursor-not-allowed"
                : "bg-amber-400 hover:bg-amber-500"
            } text-[#4b0000] font-semibold py-3 rounded-full shadow-md transition duration-300`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* OR Divider */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-[#4b0000] font-semibold">or</span>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="mt-2 w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-3 hover:shadow-md transition cursor-pointer"
        >
          <FcGoogle size={24} />
          <span className="text-[#4b0000] font-semibold">
            Login with Google
          </span>
        </button>

        {/* Login Link */}
        <p className="mt-4 text-center text-sm text-[#4b0000]">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
