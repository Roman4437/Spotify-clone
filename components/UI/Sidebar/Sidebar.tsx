'use client'

import { useContext, useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import useHistory from "@/hooks/useHistory"
import { usePathname } from "next/navigation"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { useCollection } from "react-firebase-hooks/firestore"
import { collection, doc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"

import UploadModal from "@/components/UI/UploadModal/UploadModal"
import Equalizer from "@/components/UI/Equalizer"
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  PlusIcon,
  BookOpenIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline"

export default function Sidebar() {
  const { currentTrack, isPlaying } = useContext(PlayerContext)
  const [inputValue, setInputValue] = useState("")
  const [filter, setFilter] = useState("")
  const { data } = useSession()
  const [songs] = useCollection(collection(db, "users", data?.user?.email!, "uploadedSongs"))
  const [likedSongs] = useCollection(collection(db, "users", data?.user?.email!, "playlists", "liked", "songs"))
  const [playlists] = useCollection(collection(db, "users", data?.user?.email!, "playlists"))
  const [isScrolled, setIsScrolled] = useState(false)
  const [isExtended, setIsExtended] = useState(false)
  const [isInputOpen, setIsInputOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { push } = useHistory()
  const pathname = usePathname()

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const debounce = setTimeout(() => setFilter(inputValue), 500)
    return () =>
      clearTimeout(debounce)
  }, [inputValue])

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

  function handleFocus() {
    setIsInputOpen(true)
  }

  function addPlaylist() {
    setDoc(doc(db, "users", data?.user?.email!, "playlists", `Playlist ${playlists?.size! + 1}`), {})
  }

  return (
    <>
      <aside style={{ width: `${isExtended ? "50%" : "300px"}` }} className="hidden md:flex select-none flex-col pt-2 pl-2 space-y-2">
        <div className="flex flex-col px-5 py-4 space-y-6 bg-[#121212] rounded-lg">
          <button
            onClick={() => push("/")}
            className="flex space-x-4 text-[#b3b3b3] hover:text-white transition-colors duration-300 ease-in-out">
            <HomeIcon className="w-6" />
            <span className="font-bold">Home</span>
          </button>
          <button
            onClick={() => push("/search")}
            className="flex space-x-4 text-[#b3b3b3] hover:text-white transition-colors duration-300 ease-in-ou">
            <MagnifyingGlassIcon className="w-6" />
            <span className="font-bold">Search</span>
          </button>
        </div>
        <div className="flex flex-col px-3 pt-3 bg-[#121212] rounded-lg h-full">
          <div className="flex justify-between ml-2 mb-6 text-[#b3b3b3]">
            <button
              className="flex space-x-4 hover:text-white transition-colors duration-300 ease-in-out">
              <BookOpenIcon className="w-6" />
              <span className="font-bold">Your Library</span>
            </button>
            <div className="flex space-x-4">
              <button onClick={() => setIsModalOpen(true)}>
                <PlusIcon className="w-7 p-1 rounded-full hover:bg-[#1a1a1a]" />
              </button>
              <button onClick={() => setIsExtended(p => !p)}>
                <ArrowRightIcon className={`${isExtended && "-scale-100"} w-7 p-1 rounded-full hover:bg-[#1a1a1a]`} />
              </button>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={addPlaylist}
              className="py-[5px] px-3 font-bold text-sm rounded-full bg-[#ffffff12] hover:opacity-80">
              New Playlist
            </button>
          </div>
          <div className={`h-1 -mx-5 shadow-black ${isScrolled ? "shadow-md" : "shadow-none"}`} />
          <div
            onScroll={handleScroll}
            className="overflow-y-auto h-[calc(100dvh-314px)] -mx-3 scrollbar scrollbar-w-3 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
            <div className="flex justify-between items-center my-2 px-3 text-[#b3b3b3]">
              {isInputOpen
                ? <form ref={formRef} onSubmit={e => e.preventDefault()} className="flex rounded-md bg-[#ffffff12] p-2">
                  <MagnifyingGlassIcon className="w-5" />
                  <input
                    className="bg-transparent ml-2 w-36 outline-none text-xs font-bold animate-grow"
                    placeholder="Search in Your Library"
                    onChange={e => setInputValue(e.target.value)}
                    value={inputValue}
                    autoFocus
                    type="text" />
                </form>
                : <button className="rounded-full hover:bg-[#ffffff12] p-2" onClick={handleFocus} type="button">
                  <MagnifyingGlassIcon className="w-5" />
                </button>}
              <button className="truncate font-bold text-xs mx-2 hover:text-white">
                Recently Added
              </button>
            </div>
            <div className="space-y-1 px-2">
              {songs
                ? likedSongs && likedSongs.size > 0 && <div
                  onClick={() => push("/collection/tracks")}
                  className={`flex items-center p-2 rounded-md space-x-3 cursor-pointer hover:bg-[#ffffff12] transition ${pathname === "/collection/tracks" ? "bg-[#ffffff12]" : "bg-transparent"}`}>
                  <img
                    className="rounded-sm h-12 aspect-square object-cover"
                    src="/liked-songs-640.png"
                    alt="Liked_Songs" />
                  <div className="flex flex-col justify-between">
                    <span className="text-green-400">Liked Songs</span>
                    <span className="text-xs text-[#b3b3b3] truncate">Playlist &bull; {data?.user?.name}</span>
                  </div>
                </div>
                : <div className="flex items-center p-2 rounded-md space-x-3">
                  <div className="bg-[rgb(40,40,40)] h-12 aspect-square rounded-sm" />
                  <div className="flex flex-col w-full space-y-2">
                    <div className="bg-[rgb(40,40,40)] h-4 w-4/5 rounded-sm" />
                    <div className="bg-[rgb(40,40,40)] h-3 w-3/5 rounded-sm" />
                  </div>
                </div>}
              {songs && playlists?.docs.map(list => <div
                key={list.id}
                onClick={() => push(`/collection/${list.id}`)}
                className={`flex p-2 justify-between items-center rounded-md cursor-pointer hover:bg-[#ffffff12] transition ${pathname.includes(list.id) ? "bg-[#ffffff12]" : "bg-transparent"}`}>
                <div className="flex space-x-3">
                  <div className="flex justify-center items-center rounded-sm h-12 aspect-square bg-[#383838]">
                    <MusicalNoteIcon className="h-6 text-[#b3b3b3]" />
                  </div>
                  <div className="flex flex-col justify-between">
                    <span className="">{list.id}</span>
                    <span className="text-xs text-[#b3b3b3] truncate">Playlist &bull; {data?.user?.name}</span>
                  </div>
                </div>
              </div>)}
              {songs
                ? songs?.docs
                  .filter(song => song.data().metadata.songName.toLowerCase().includes(filter.toLowerCase())
                    || song.data().metadata.artistName.toLowerCase().includes(filter.toLowerCase()))
                  .map(song => <div
                    key={song.id}
                    onClick={() => push(`/song/${song.id}`)}
                    className={`flex p-2 justify-between items-center rounded-md cursor-pointer hover:bg-[#ffffff12] transition ${pathname.includes(song.id) ? "bg-[#ffffff12]" : "bg-transparent"}`}>
                    <div className="flex space-x-3 items-center">
                      <img
                        className="rounded-sm h-12 aspect-square object-cover"
                        src={song.data().path.cover}
                        loading="lazy"
                        alt="cover" />
                      <div className="flex flex-col justify-between">
                        <span className={`${currentTrack?.id === song.id && "text-green-500"}`}>{song.data().metadata.songName}</span>
                        <span className="text-xs text-[#b3b3b3]">{song.data().metadata.artistName}</span>
                      </div>
                    </div>
                    <div className="mr-4">
                      {currentTrack?.id === song.id && isPlaying && <Equalizer />}
                    </div>
                  </div>)
                : <>
                  {Array.from({ length: 20 }, () => <div key={crypto.randomUUID()} className="flex items-center p-2 rounded-md space-x-3">
                    <div className="bg-[rgb(40,40,40)] h-12 aspect-square rounded-sm" />
                    <div className="flex flex-col w-full space-y-2">
                      <div className="bg-[rgb(40,40,40)] h-4 w-4/5 rounded-sm" />
                      <div className="bg-[rgb(40,40,40)] h-3 w-3/5 rounded-sm" />
                    </div>
                  </div>)}
                </>}
              {likedSongs
                && songs
                && likedSongs.size === 0
                && playlists?.size === 0
                && songs.size === 0
                && <span className="text-xs text-neutral-400">Empty.</span>}
            </div>
          </div>
        </div>
      </aside>
      {isModalOpen && <UploadModal setIsModalOpen={setIsModalOpen} />}
    </>
  )
}
