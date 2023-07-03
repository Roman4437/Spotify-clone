import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import SidebarSearch from "./SidebarSearch"

interface SearchPanelProps {
  setFilter: React.Dispatch<React.SetStateAction<string>>,
  searchRef: React.RefObject<HTMLFormElement>,
  isInputOpen: boolean,
  setIsInputOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SearchPanel({ setFilter, searchRef, isInputOpen, setIsInputOpen }: SearchPanelProps) {
  function handleFocus() {
    setIsInputOpen(true)
  }

  return (
    <>
      {isInputOpen
        ? <SidebarSearch setFilter={setFilter} searchRef={searchRef} />
        : <button className="rounded-full hover:bg-[#ffffff12] p-2" onClick={handleFocus} type="button">
          <MagnifyingGlassIcon className="w-5" />
        </button>}
      <span className="truncate font-bold text-xs mx-2">
        Uploaded Songs
      </span>
    </>
  )
}
