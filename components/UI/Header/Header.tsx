'use client'

import { useContext } from "react"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { signOut, useSession } from "next-auth/react"

import Image from "next/image"
import Navigation from "./Navigation"
import QueryInput from "./QueryInput"

export default function Header() {
  const { loading } = useContext(PlayerContext)
  const { data } = useSession()

  return (
    <div className={`sticky top-0 z-40 flex justify-end md:justify-between items-center py-4 px-6 w-full h-16 ${loading ? "bg-[#121212]" : "bg-blue-950"} rounded-t-lg`}>
      <div className="md:flex space-x-2 hidden items-center">
        <Navigation />
        <QueryInput />
      </div>
      <div className="flex bg-black/60 h-8 w-8 rounded-full items-center justify-center font-bold">
        <button onClick={() => signOut()} className="hover:opacity-50">
          <Image width={28} height={28} className="rounded-full" src={data?.user?.image!} alt="pfp" />
        </button>
      </div>
    </div >
  )
}
