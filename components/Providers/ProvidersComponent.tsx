'use client'

import AuthProvider from "./AuthProvider/AuthProvider"
import { HistoryProvider } from "./HistoryProvider/HistoryProvider"
import { PlayerProvider } from "./PlayerProvider/PlayerProvider"
import NotificationProvider from "./NotificationProvider/NotificationProvider"

interface ProvidersComponentProps {
  children: React.ReactNode,
}

export default async function ProvidersComponent({ children }: ProvidersComponentProps) {
  return (
    <AuthProvider>
      <HistoryProvider>
        <PlayerProvider>
          <NotificationProvider />
          {children}
        </PlayerProvider>
      </HistoryProvider>
    </AuthProvider>
  )
}
