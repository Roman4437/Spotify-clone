'use client'

import { Session } from "next-auth"
import { SessionProvider as Provider } from "next-auth/react"

interface AuthProviderProps {
  children: React.ReactNode,
  session: Session | null
}

export default function SessionProvider({ children, session }: AuthProviderProps) {
  return (
    <Provider>
      {children}
    </Provider>
  )
}
