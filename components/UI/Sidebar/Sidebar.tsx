'use client'

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { useCollection } from "react-firebase-hooks/firestore"
import { collection } from "firebase/firestore"
import { db } from "@/firebase"

import {
  HomeIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  PlusIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline"

import SidebarRow from "./SidebarRow"
import NewPlaylist from "./NewPlaylist"
import SearchPanel from "./SearchPanel"
import SidebarLikedSongsRow from "./SidebarLikedSongsRow"
import SidebarPlaylistRow from "./SidebarPlaylistRow"
import SidebarSongsPanel from "./SidebarSongsPanel"
import UploadModal from "@/components/UI/UploadModal/UploadModal"

export default function Sidebar() {
  const { data } = useSession()
  const [songs] = useCollection(collection(db, "users", data?.user?.email!, "uploadedSongs"))
  const [playlists] = useCollection(collection(db, "users", data?.user?.email!, "playlists"))
  const [isScrolled, setIsScrolled] = useState(false)
  const [isExtended, setIsExtended] = useState(false)
  const [filter, setFilter] = useState("")
  const [isInputOpen, setIsInputOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node))
        setIsInputOpen(false)
    }

    document.addEventListener('click', handleClickOutside)

    return () =>
      document.removeEventListener('click', handleClickOutside)
  }, [isInputOpen])

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    if (event.currentTarget.scrollTop > 0)
      setIsScrolled(true)

    if (event.currentTarget.scrollTop === 0)
      setIsScrolled(false)
  }

  return (
    <>
      <aside
        className="hidden md:flex select-none flex-col pt-2 pl-2 space-y-2"
        style={{ width: `${isExtended ? "50%" : "300px"}` }}>
        <div className="flex flex-col px-5 py-4 space-y-6 text-[#b3b3b3] bg-[#121212] rounded-lg">
          <SidebarRow text="Home" page="/">
            <HomeIcon className="w-6" />
          </SidebarRow>
          <SidebarRow text="Search" page="/search">
            <MagnifyingGlassIcon className="w-6" />
          </SidebarRow>
        </div>
        <div className="flex flex-col px-3 pt-3 bg-[#121212] rounded-lg h-full">
          <div className="flex justify-between ml-2 mb-6 text-[#b3b3b3]">
            <SidebarRow text="Your Library">
              <BookOpenIcon className="w-6" />
            </SidebarRow>
            <div className="flex space-x-4">
              <button onClick={() => setIsModalOpen(true)}>
                <PlusIcon className="w-7 p-1 rounded-full hover:bg-[#1a1a1a]" />
              </button>
              <button onClick={() => setIsExtended(p => !p)}>
                <ArrowRightIcon className={`${isExtended && "-scale-100"} w-7 p-1 rounded-full hover:bg-[#1a1a1a]`} />
              </button>
            </div>
          </div>
          <NewPlaylist playlists={playlists!} />
          <div className={`h-1 -mx-5 shadow-black ${isScrolled ? "shadow-md" : "shadow-none"}`} />
          <div
            onScroll={handleScroll}
            className="overflow-y-auto h-[calc(100dvh-314px)] -mx-3 scrollbar scrollbar-w-3 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
            <div className="flex justify-between items-center my-2 px-3 text-[#b3b3b3]">
              <SearchPanel
                setIsInputOpen={setIsInputOpen}
                setFilter={setFilter}
                searchRef={formRef}
                isInputOpen={isInputOpen} />
            </div>
            <div className="space-y-1 px-2">
              <SidebarLikedSongsRow songs={songs!} />
              <SidebarPlaylistRow songs={songs!} />
              <SidebarSongsPanel filter={filter} songs={songs!} />
            </div>
          </div>
        </div>
      </aside>
      {isModalOpen && <UploadModal setIsModalOpen={setIsModalOpen} />}
    </>
  )
}
