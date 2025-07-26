import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

const handler=NextAuth({
    providers:[
         CredentialsProvider({
    name: 'Credentials',
    credentials: {
      username: { label: "Email", type: "email", placeholder: "test@example.com" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      console.log({credentials});
      
      return null
    }
  })
    ]
})

export {}