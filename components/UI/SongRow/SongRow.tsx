import { useContext, useEffect, useRef, useState } from "react"
import { db } from "@/firebase"
import { formatTime } from "@/lib"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { DocumentData, DocumentReference, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCollection } from "react-firebase-hooks/firestore"

import Equalizer from "@/components/UI/Equalizer"
import LikeSong from "@/components/UI/LikeSong/LikeSong"
import { PauseIcon, PlayIcon, XMarkIcon } from "@heroicons/react/24/solid"
import Image from "next/image"

interface SongRowProps {
  song: DocumentData,
  index?: number
}

export default function SongRow({ song, index = 0 }: SongRowProps) {
  const { currentTrack, setCurrentTrack, isPlaying, setIsPlaying, setCurrentList } = useContext(PlayerContext)
  const [isHover, setSiHover] = useState(false)
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const { data } = useSession()
  const pathname = usePathname()
  const [playlists] = useCollection(collection(db, "users", data?.user?.email!, "playlists"))

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (divRef.current && !divRef.current.contains(event.target as Node))
        setIsSelectOpen(false)
    }

    document.addEventListener('click', handleClickOutside)

    return () =>
      document.removeEventListener('click', handleClickOutside)
  }, [isSelectOpen])

  async function handlePlay() {
    if (song.id === currentTrack?.id) {
      setIsPlaying(true)
    } else {
      if (pathname.includes("song")) {
        localStorage.setItem("currentList", "undefined")
        setCurrentList(undefined)
      }

      try {
        const t = await getDoc(doc(db, "songs", song?.id))
        setCurrentTrack(t)
        setIsPlaying(true)
      } catch (error) {
        console.error(error)
      }

      let ref
      if (pathname.includes("collection")) {
        if (pathname.split('/').pop() === "tracks")
          ref = collection(db, "users", data?.user?.email!, "playlists", "liked", "songs")
        else
          ref = collection(db, "users", data?.user?.email!, "playlists", pathname.split('/').pop()!, "songs")
        try {
          const t = await getDocs(ref)
          setCurrentList(t)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }

  function handlePause() {
    setIsPlaying(false)
  }

  function addToPlaylist(ref: DocumentReference<DocumentData>) {
    setDoc(
      doc(ref, "songs", song.id),
      {
        ...song.data()
      })
    setIsSelectOpen(false)
  }

  function removeFromPlaylist() {
    deleteDoc(doc(db, "users", data?.user?.email!, "playlists", pathname.split('/').pop()?.replace("%20", " ")!, "songs", song.id))
  }

  return (
    <div
      onMouseEnter={() => setSiHover(true)}
      onMouseLeave={() => setSiHover(false)}
      className="group flex justify-between items-center mx-6 mt-3 px-4 py-2 rounded-sm hover:bg-[#ffffff12]">
      <div className="flex items-center space-x-4">
        <div className="flex w-4 justify-center">
          {currentTrack?.id === song.id &&
            isPlaying
            ? isHover
              ? <button onClick={handlePause}>
                <PauseIcon className="h-4 text-white" />
              </button>
              : <Equalizer />
            : isHover
              ? <button onClick={handlePlay}>
                <PlayIcon className="h-4 text-white" />
              </button>
              : <span className={`text-sm ${currentTrack?.id === song.id ? "text-green-500" : "text-white"}`}>{index + 1}</span>}
        </div>
        <Image width={40} height={40} className="object-cover" src={song.data().path.cover} alt="cover" />
        <div className="flex flex-col space-y-1">
          <span className={`${currentTrack?.i === song.id ? "text-green-500" : "text-white"} select-text`}>
            {song.data().metadata.songName}
          </span>
          <span className="text-xs select-text">{song.data().metadata.artistName}</span>
        </div>
        {pathname.includes("collection/Play") && <div className="relative text-lg">
          <button
            onClick={removeFromPlaylist}
            className="hidden group-hover:block p-1 bg-neutral-400/40 rounded-full hover:bg-neutral-300/10">
            <XMarkIcon className="h-3" />
          </button>
        </div>}
        {pathname.includes("song") && <div className="hidden group-hover:block relative text-lg">
          <button onClick={() => setIsSelectOpen(p => !p)}>
            &#8942;
          </button>
          {isSelectOpen && <div ref={divRef} className="absolute flex flex-col items-start p-1 space-y-1 -right-9 bg-[#383838]">
            {playlists?.docs.map(list => <button
              key={list.id}
              onClick={() => addToPlaylist(list.ref)}
              className="truncate text-sm">+ {list.id.replace("%20", " ")}</button>)}
          </div>}
        </div>}
      </div>
      <div className="flex space-x-6 items-center">
        <LikeSong song={song} />
        <span className="text-sm">{formatTime(song.data().duration)}</span>
      </div>
    </div>
  )
}
