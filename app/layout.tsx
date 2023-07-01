import { HistoryProvider } from '@/components/Providers/HistoryProvider/HistoryProvider'
import { PlayerProvider } from '@/components/Providers/PlayerProvider/PlayerProvider'
import SessionProvider from '@/components/Providers/SessionProvider/SessionProvider'
import AuthProvider from '@/components/Providers/AuthProvider/AuthProvider'
import NotificationProvider from '@/components/Providers/NotificationProvider/NotificationProvider'

import Footer from '@/components/UI/Footer/Footer'
import Sidebar from '@/components/UI/Sidebar/Sidebar'
import Header from '@/components/UI/Header/Header'

import { getServerSession } from 'next-auth'

import '@/styles/globals.css'

export const metadata = {
  title: 'Spotify',
  description: 'Listen to music',
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className="text-white bg-black overflow-hidden">
        <main className="flex flex-col h-screen">
          <SessionProvider session={session}>
            <AuthProvider>
              <HistoryProvider>
                <PlayerProvider>
                  <div className="flex h-[calc(100dvh-160px)] md:h-auto">
                    <NotificationProvider />
                    <Sidebar />
                    <div className="flex flex-col flex-1 px-2 pt-2">
                      <div className="flex flex-col bg-[#121212] rounded-lg h-full scrollbar-custom select-none">
                        <Header />
                        {children}
                      </div>
                    </div>
                  </div>
                  <Footer />
                </PlayerProvider>
              </HistoryProvider>
            </AuthProvider>
          </SessionProvider>
        </main>
      </body>
    </html>
  )
}
