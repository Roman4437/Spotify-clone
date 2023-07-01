'use client'

import { useContext, useEffect } from "react"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { useSession } from "next-auth/react"
import useHistory from "@/hooks/useHistory"
import { useCollection } from "react-firebase-hooks/firestore"
import { collection, deleteDoc, doc } from "firebase/firestore"
import { usePathname } from "next/navigation"
import { db } from "@/firebase"

import { PauseIcon, PlayIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { ClockIcon, MusicalNoteIcon } from "@heroicons/react/24/outline"
import SongRow from "@/components/UI/SongRow/SongRow"


export default function PlaylistPage() {
  const { currentTrack, setCurrentTrack, currentList, setCurrentList, isPlaying, setIsPlaying, setLoading } = useContext(PlayerContext)
  const { push } = useHistory()
  const { data } = useSession()
  const pathname = usePathname()
  const [playlist, loading] = useCollection(collection(db, "users", data?.user?.email!, "playlists", `${pathname.split('/').pop()}`, "songs"))

  useEffect(() => {
    if (loading)
      setLoading(true)
    else
      setLoading(false)
  }, [loading])

  function handlePlay() {
    if (playlist?.docs.find(s => s.id === currentTrack?.id)) {
      setIsPlaying(true)
    } else {
      if (currentList?.metadata !== playlist?.metadata)
        setCurrentList(playlist)
      setCurrentTrack(playlist?.docs[0])
      setIsPlaying(true)
    }
  }

  function handlePause() {
    setIsPlaying(false)
  }

  function deletePlaylist() {
    deleteDoc(doc(db, "users", data?.user?.email!, "playlists", `${pathname.split('/').pop()?.replace("%20", " ")}`))
    push("/")
  }

  if (loading) {
    return null
  }

  return (
    <div className="flex flex-col px-6 w-full bg-gradient-to-b from-blue-950 to-[#121214] pt-4">
      <div className="flex space-x-6 h-36 md:h-60 mb-6">
        <div className="group flex relative justify-center items-center h-full bg-blue-300 aspect-square object-cover drop-shadow-2xl" >
          <MusicalNoteIcon className="h-32" />
          <button
            onClick={deletePlaylist}
            className="hidden group-hover:block absolute top-2 right-2 p-1 bg-blue-950/40 rounded-full hover:bg-blue-950/30">
            <XMarkIcon className="h-3" />
          </button>
        </div>
        <div className="flex flex-col justify-end space-y-6 overflow-hidden">
          <span className="text-sm">Playlist</span>
          <h1 className="text-3xl md:text-7xl md:pb-4 font-extrabold drop-shadow-2xl line-clamp-1">{pathname.split('/').pop()?.replace("%20", " ")}</h1>
          <div className="flex space-x-2 items-center">
            <img className="h-6 rounded-full" src={data?.user?.image!} alt="pfp" />
            <h2 className="text-xs md:text-base md:font-bold">{data?.user?.name}</h2>
            <div>&bull;</div>
            <span>{playlist?.size} songs</span>
          </div>
        </div>
      </div>
      <div className={`flex flex-col -mx-6 bg-gradient-to-b from-blue-950 to-[#121214] h-48 text-[#b3b3b3]`}>
        <div className="flex space-x-4 p-6">
          {isPlaying && playlist?.docs.find(s => s.id === currentTrack?.id)
            ? <button onClick={handlePause} className="flex items-center justify-center h-14 w-14 rounded-full bg-green-500 hover:scale-105">
              <PauseIcon className="h-8 text-black" />
            </button>
            : <button
              disabled={playlist?.size === 0}
              onClick={handlePlay} className="flex items-center justify-center h-14 w-14 rounded-full disabled:cursor-not-allowed disabled:bg-blue-300 bg-green-500 enabled:hover:scale-105">
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
          {playlist?.docs.map((song, index) => <SongRow key={song.id} song={song} index={index} />)}
          {playlist?.size === 0 &&
            <div className="flex justify-center mt-8">
              <span className="text-xs text-neutral-400">Empty.</span>
            </div>}
        </div>
      </div>
    </div>
  )
}
