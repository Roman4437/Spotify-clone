import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

interface SidebarSearchProps {
  setFilter: React.Dispatch<React.SetStateAction<string>>,
  searchRef: React.RefObject<HTMLFormElement>
}

export default function SidebarSearch({ setFilter, searchRef }: SidebarSearchProps) {
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    const debounce = setTimeout(() => setFilter(inputValue), 500)
    return () =>
      clearTimeout(debounce)
  }, [inputValue])

  return (
    <form ref={searchRef} onSubmit={e => e.preventDefault()} className="flex rounded-md bg-[#ffffff12] p-2">
      <MagnifyingGlassIcon className="w-5" />
      <input
        className="bg-transparent ml-2 w-36 outline-none text-xs font-bold animate-grow"
        placeholder="Search in Your Library"
        onChange={e => setInputValue(e.target.value)}
        value={inputValue}
        autoFocus
        type="text" />
    </form>
  )
}
