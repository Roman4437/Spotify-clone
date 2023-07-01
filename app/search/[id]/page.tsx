'use client'

import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { db } from "@/firebase"
import useHistory from "@/hooks/useHistory"
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid"
import { DocumentData, QueryDocumentSnapshot, collection } from "firebase/firestore"
import { usePathname } from "next/navigation"
import { useContext, useEffect } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

export default function QueryPage() {
  const { currentTrack, setCurrentTrack, isPlaying, setIsPlaying, setLoading } = useContext(PlayerContext)
  const [songs] = useCollection(collection(db, "songs"))
  const { push } = useHistory()
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
  }, [])

  function handlePlay(song: QueryDocumentSnapshot<DocumentData>, event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    setCurrentTrack(song)
    setIsPlaying(true)
  }

  function handlePause(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    setIsPlaying(false)
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 p-6 gap-6 pb-4">
      {songs?.docs
        .filter(song => song.data().metadata.songName.toLowerCase().includes(pathname.split("/").pop()?.toLowerCase())
          || song.data().metadata.artistName.toLowerCase().includes(pathname.split("/").pop()?.toLowerCase()))
        .map(song => <button
          onClick={() => push(`/song/${song.id}`)}
          className="group flex flex-col rounded-md bg-[#171717] p-4">
          <div className="relative">
            <img src={song.data().path.cover} className="w-full aspect-square self-center rounded-md" loading="lazy" />
            <div className="opacity-0 group-hover:opacity-100 transition ease-in-out absolute bottom-2 right-2 play_button">
              {currentTrack?.id !== song.id
                ? <button onClick={e => handlePlay(song, e)}>
                  <PlayIcon className="h-8 text-black" />
                </button>
                : isPlaying
                  ? <button onClick={handlePause}>
                    <PauseIcon className="h-8 text-black" />
                  </button>
                  : <button onClick={e => handlePlay(song, e)}>
                    <PlayIcon className="h-8 text-black" />
                  </button>}
            </div>
          </div>
          <span className="mt-2 truncate">{song.data().metadata.songName}</span>
          <span className="text-sm text-[#b3b3b3] truncate">{song.data().metadata.artistName}</span>
        </button>)}
      {!songs && <div className="flex col-span-3 md:col-span-5 w-full justify-center">
        <span className="text-[#b3b3b3] animate-pulse">Loading...</span>
      </div>}
      <div className="flex col-span-3 md:col-span-5 w-full justify-center">
        {songs?.docs
          .filter(song => song.data().metadata.songName.toLowerCase().includes(pathname.split("/").pop()?.toLowerCase())
            || song.data().metadata.artistName.toLowerCase().includes(pathname.split("/").pop()?.toLowerCase())).length === 0
          && <span className="text-[#b3b3b3]">No results.</span>}
      </div>
    </div>
  )
}
