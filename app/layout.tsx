import { getServerSession } from 'next-auth'

import Footer from '@/components/UI/Footer/Footer'
import Sidebar from '@/components/UI/Sidebar/Sidebar'
import Header from '@/components/UI/Header/Header'
import ProvidersComponent from '@/components/Providers/ProvidersComponent'
import SessionProvider from '@/components/Providers/SessionProvider/SessionProvider'

import '@/styles/globals.css'

export const metadata = {
  title: 'Spotify',
  description: 'Listen to music',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className="text-white bg-black overflow-hidden">
        <main className="flex flex-col h-screen">
          <SessionProvider session={session}>
            <ProvidersComponent>
              <div className="flex h-[calc(100dvh-160px)] md:h-auto">
                <Sidebar />
                <div className="flex flex-col flex-1 px-2 pt-2">
                  <div className="flex flex-col bg-[#121212] rounded-lg h-full scrollbar-custom select-none">
                    <Header />
                    {children}
                  </div>
                </div>
              </div>
              <Footer />
            </ProvidersComponent>
          </SessionProvider>
        </main>
      </body>
    </html>
  )
}
