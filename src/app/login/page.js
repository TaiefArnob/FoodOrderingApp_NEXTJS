"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("Both fields are required");
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      toast.success("Login successful!");
      setTimeout(() => router.push("/"), 1000);
    } else {
      toast.error("Invalid email or password");
    }

    setLoading(false);
  };

  const handleGoogleLogin = () => {
    toast("Redirecting to Google...");
    signIn("google");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 px-4">
      <Toaster position="top-center" />
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border-l-4 border-amber-400">
        <h2 className="text-3xl font-extrabold text-[#4b0000] mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <label className="block mb-1 font-semibold text-[#4b0000]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-[#4b0000]"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 ${
              loading ? "bg-amber-300 cursor-not-allowed" : "bg-amber-400 hover:bg-amber-500"
            } text-[#4b0000] font-semibold py-3 rounded-full shadow-md transition duration-300`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-[#4b0000]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-[#4b0000] font-semibold">or</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-2 w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-3 hover:shadow-md transition cursor-pointer"
        >
          <FcGoogle size={24} />
          <span className="text-[#4b0000] font-semibold">Login with Google</span>
        </button>

        <p className="mt-4 text-center text-sm text-[#4b0000]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-amber-500 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
