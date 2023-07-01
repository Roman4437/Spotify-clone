'use client'

import { useSession } from "next-auth/react"
import SignIn from "../../UI/SignIn/SignIn"
import Loadin from "../../UI/Loading/Loading"

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { status } = useSession()

  switch (status) {
    case 'loading':
      return <Loadin />
    case 'unauthenticated':
      return <SignIn />
    case 'authenticated':
      return children
  }
}
