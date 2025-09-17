import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";

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
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        await mongoose.connect(process.env.MONGO_URL);

        const user = await User.findOne({ email }).select("+password");
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          address: user.address || "",
          profileImage: user.profileImage || null,
          admin: user.admin || false, // ✅ Include admin here
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, profile, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name || profile?.name || "";
        token.email = user.email;
        token.phone = user.phone || "";
        token.address = user.address || "";
        token.profileImage = user.profileImage || profile?.picture || null;
        token.admin = user.admin || false; // ✅ include admin in token
      }

      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.phone = session.user.phone;
        token.address = session.user.address;
        token.profileImage = session.user.profileImage || null;
        token.admin = session.user.admin || false; // ✅ include admin on update
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.phone = token.phone;
      session.user.address = token.address;
      session.user.profileImage = token.profileImage;
      session.user.admin = token.admin || false; // ✅ now session.user.admin works
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
