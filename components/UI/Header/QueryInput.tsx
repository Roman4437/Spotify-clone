import useHistory from "@/hooks/useHistory"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"

export default function QueryInput() {
  const [query, setQuery] = useState(localStorage.getItem("query") ?? "")
  const { push } = useHistory()
  const pathname = usePathname()

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (pathname.includes("search")) {
        if (query !== "")
          push(`/search/${query}`)
        else
          push("/search")
      }
    }, 500)
    return () => clearTimeout(debounce)
  }, [query])

  function saveQuery(event: React.ChangeEvent<HTMLInputElement>) {
    localStorage.setItem("query", event.target.value)
    setQuery(event.target.value)
  }

  return (
    <>
      {pathname.includes("search") &&
        <form
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
    </>
  )
}
