import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // ✅ you forgot to import this
import User from "@/app/models/User";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        // Connect to DB
        await mongoose.connect(process.env.MONGO_URL);

        // Find user
        const user = await User.findOne({ email });
        if (!user) return null;

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return null;

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

// ✅ Export these for App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
