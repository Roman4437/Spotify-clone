'use client'

import { useContext, useEffect } from "react"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { useSession } from "next-auth/react"
import { useCollection } from "react-firebase-hooks/firestore"
import { collection } from "firebase/firestore"
import { db } from "@/firebase"

import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid"
import { ClockIcon } from "@heroicons/react/24/outline"
import SongRow from "@/components/UI/SongRow/SongRow"

export default function LikedSongsPage() {
  const { currentTrack, setCurrentTrack, currentList, setCurrentList, isPlaying, setIsPlaying, setLoading } = useContext(PlayerContext)
  const { data } = useSession()
  const [likedSongs, loading] = useCollection(collection(db, "users", data?.user?.email!, "playlists", "liked", "songs"))

  useEffect(() => {
    if (loading)
      setLoading(true)
    else
      setLoading(false)
  }, [loading])

  function handlePlay() {
    if (likedSongs?.docs.find(s => s.id === currentTrack?.id)) {
      setIsPlaying(true)
    } else {
      if (currentList?.metadata !== likedSongs?.metadata)
        setCurrentList(likedSongs)
      setCurrentTrack(likedSongs?.docs[0])
      setIsPlaying(true)
    }
  }

  function handlePause() {
    setIsPlaying(false)
  }

  if (loading) {
    return null
  }

  return (
    <div className="flex flex-col px-6 w-full bg-gradient-to-b from-blue-950 to-[#121214] pt-4">
      <div className="flex space-x-6 h-36 md:h-60 mb-6">
        <img src="/liked-songs-640.png" className="h-full aspect-square object-cover drop-shadow-2xl" alt="cover" />
        <div className="flex flex-col justify-end space-y-6 overflow-hidden">
          <span className="text-sm">Playlist</span>
          <h1 className="text-3xl md:text-7xl md:pb-4 font-extrabold drop-shadow-2xl line-clamp-1">Liked songs</h1>
          <div className="flex space-x-2 items-center">
            <img className="h-6 rounded-full" src={data?.user?.image!} alt="pfp" />
            <h2 className="text-xs md:text-base md:font-bold">{data?.user?.name}</h2>
            <div>&bull;</div>
            <span>{likedSongs?.size} songs</span>
          </div>
        </div>
      </div>
      <div className={`flex flex-col -mx-6 bg-gradient-to-b from-blue-950 to-[#121214] h-48 text-[#b3b3b3]`}>
        <div className="flex space-x-4 p-6">
          {isPlaying && likedSongs?.docs.find(s => s.id === currentTrack?.id)
            ? <button onClick={handlePause} className="flex items-center justify-center h-14 w-14 rounded-full bg-green-500 hover:scale-105">
              <PauseIcon className="h-8 text-black" />
            </button>
            : <button onClick={handlePlay} className="flex items-center justify-center h-14 w-14 rounded-full bg-green-500 hover:scale-105">
              <PlayIcon className="h-8 text-black" />
            </button>}
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
        <div className="pb-4">
          {likedSongs?.docs.map((song, index) => <SongRow key={song.id} song={song} index={index} />)}
          {likedSongs?.size === 0 &&
            <div className="flex justify-center mt-8">
              <span className="text-xs text-neutral-400">Empty.</span>
            </div>}
        </div>
      </div>
    </div>
  )
}
