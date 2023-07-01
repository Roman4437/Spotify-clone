'use client'

import { ChangeEvent, useContext, useEffect, useLayoutEffect, useState } from "react"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import useHistory from "@/hooks/useHistory"
import { signOut, useSession } from "next-auth/react"
import { HistoryContext } from "@/components/Providers/HistoryProvider/HistoryProvider"
import { usePathname, useRouter } from "next/navigation"

import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import Image from "next/image"

export default function Header() {
  const [currentPage, setCurrentPage] = useState(0)
  const [query, setQuery] = useState(localStorage.getItem("query") ?? "")
  const { value } = useContext(HistoryContext)
  const { loading } = useContext(PlayerContext)
  const { push } = useHistory()
  const { data } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (pathname.includes("search"))
        if (query !== "")
          push(`/search/${query}`)
        else
          push("/search")
    }, 500)
    return () => clearTimeout(debounce)
  }, [query])

  useLayoutEffect(() => {
    setCurrentPage(value.length - 1)
  }, [value])

  function goBackward() {
    setCurrentPage(p => p - 1)
    router.push(value[currentPage - 1])
  }

  function goForward() {
    setCurrentPage(p => p + 1)
    router.push(value[currentPage + 1])
  }

  function saveQuery(event: ChangeEvent<HTMLInputElement>) {
    localStorage.setItem("query", event.target.value)
    setQuery(event.target.value)
  }

  return (
    <div className={`sticky top-0 z-40 flex justify-end md:justify-between items-center py-4 px-6 w-full h-16 ${loading ? "bg-transparent" : "bg-blue-950"} rounded-t-lg`}>
      <div className="md:flex space-x-2 hidden items-center">
        <button
          className="flex bg-black/60 rounded-full h-8 w-8 items-center justify-center disabled:cursor-not-allowed disabled:opacity-75"
          disabled={currentPage === 0}
          onClick={goBackward}>
          <ChevronLeftIcon className="h-6" />
        </button>
        <button
          className="flex bg-black/60 rounded-full h-8 w-8 items-center justify-center disabled:cursor-not-allowed disabled:opacity-75"
          disabled={currentPage === value.length - 1}
          onClick={goForward}>
          <ChevronRightIcon className="h-6" />
        </button>
        {pathname.includes("search") && <form
          className="flex justify-center items-center bg-black/20 rounded-full p-3 space-x-1"
          onSubmit={e => e.preventDefault()}>
          <MagnifyingGlassIcon className="h-4" />
          <input
            className="bg-transparent outline-none text-sm w-64"
            placeholder="What do you want to listen to?"
            onChange={saveQuery}
            value={query}
            autoFocus
            type="text" />
        </form>}
      </div>
      <div className="flex bg-black/60 h-8 w-8 rounded-full items-center justify-center font-bold">
        <button onClick={() => signOut()} className="hover:opacity-50">
          <Image width={28} height={28} className="rounded-full" src={data?.user?.image!} alt="pfp" />
        </button>
      </div>
    </div >
  )
}
