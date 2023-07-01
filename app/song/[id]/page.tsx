'use client'

import { useContext, useEffect } from "react"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { formatDuration } from "@/lib"
import { db } from "@/firebase"
import { useDocument } from "react-firebase-hooks/firestore"
import { doc } from "firebase/firestore"
import { usePathname } from "next/navigation"

import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid"
import { ClockIcon } from "@heroicons/react/24/outline"
import LikeSong from "@/components/UI/LikeSong/LikeSong"
import SongRow from "@/components/UI/SongRow/SongRow"

export default function SongPage() {
  const { currentTrack, setCurrentTrack, isPlaying, setIsPlaying, setLoading, setCurrentList } = useContext(PlayerContext)
  const pathname = usePathname()
  const [song, loading] = useDocument(doc(db, "songs", pathname.split("/").pop()!))

  useEffect(() => {
    if (loading)
      setLoading(true)
    else
      setLoading(false)
  }, [loading])

  function handlePlay() {
    if (currentTrack?.id === song?.id)
      setIsPlaying(p => !p)
    else {
      localStorage.setItem("currentList", "undefined")
      setCurrentList(undefined)
      setCurrentTrack(song)
      setIsPlaying(true)
    }
  }

  if (loading) {
    return null
  }

  return (
    <div className="flex flex-col px-6 w-full bg-gradient-to-b from-blue-950 to-[#121214] pt-4">
      <div className="flex space-x-6 h-36 md:h-60 mb-6">
        <img src={song!.data()!.path.cover} className="h-full aspect-square object-cover drop-shadow-2xl" alt="cover" />
        <div className="flex flex-col justify-end space-y-6 overflow-hidden">
          <span className="text-sm">Single</span>
          <h1 className="text-3xl md:text-7xl md:pb-4 font-extrabold truncate drop-shadow-2xl select-text">
            {song!.data()!.metadata.songName}
          </h1>
          <div className="flex space-x-2 items-center">
            <h2 className="text-xs md:text-base select-text">
              {song!.data()!.metadata.artistName}
            </h2>
            <div>&bull;</div>
            <span className="text-xs md:text-base">
              {new Intl.DateTimeFormat("en", { year: "numeric" }).format(song!.data()!.uploadedAt.miliseconds)}
            </span>
            <div>&bull;</div>
            <span className="text-xs md:text-base opacity-60">
              {formatDuration(song!.data()!.duration)}
            </span>
          </div>
        </div>
      </div>
      <div className={`flex flex-col -mx-6 bg-gradient-to-b from-blue-950 to-[#121214] h-48 text-[#b3b3b3]`}>
        <div className="flex space-x-4 p-6">
          <button onClick={handlePlay} className="flex items-center justify-center h-14 w-14 rounded-full bg-green-500 hover:scale-105">
            {isPlaying && song!.id === currentTrack?.id
              ? <PauseIcon className="h-8 text-black" />
              : <PlayIcon className="h-8 text-black" />}
          </button>
          <LikeSong className="h-9" song={song!} />
        </div>
        <div className="flex justify-between items-center border-b border-white/20 mx-6 py-2 px-4">
          <div className="flex space-x-4">
            <span>#</span>
            <span>Title</span>
          </div>
          <div>
            <ClockIcon className="h-5" />
          </div>
        </div>
        <SongRow song={song!} />
      </div>
    </div>
  )
}
