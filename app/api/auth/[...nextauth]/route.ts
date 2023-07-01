import { db } from "@/firebase"
import { doc, setDoc } from "firebase/firestore"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        await setDoc(
          doc(db, "users", user.email!),
          {
            name: user.name,
            email: user.email,
            image: user.image,
          },
          {
            merge: true
          }
        )
      } catch (error) {
        console.error(error)
      }
      return true
    }
  }
})

export { handler as GET, handler as POST }