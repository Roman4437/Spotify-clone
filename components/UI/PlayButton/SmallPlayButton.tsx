import { DocumentData, collection, getDocs } from "firebase/firestore"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { useContext } from "react"
import { db } from "@/firebase"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

import Equalizer from "@/components/UI/Equalizer"
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid"

interface SmallPlayButtonProps {
  song: DocumentData
  index: number,
  isHover: boolean
}

export default function SmallPlayButton({ song, index, isHover }: SmallPlayButtonProps) {
  const { currentTrack, setCurrentTrack, isPlaying, setIsPlaying, setCurrentList } = useContext(PlayerContext)
  const pathname = usePathname()
  const { data } = useSession()

  async function handlePlay() {
    if (isCurrentSong) {
      return setIsPlaying(true)
    }

    setCurrentTrack(song)
    setIsPlaying(true)

    try {
      if (isInSongPage) {
        localStorage.setItem("currentList", "undefined")
        setCurrentList(undefined)
      }

      if (isLikedPage) {
        const ref = collection(db, "users", data?.user?.email!, "playlists", "liked", "songs")
        const l = await getDocs(ref)

        localStorage.setItem("currentList", JSON.stringify(ref.path))
        setCurrentList(l)
      }

      if (isPlaylistPage) {
        const playlist = pathname.split("/").pop()?.replace("%20", " ")
        const ref = collection(db, "users", data?.user?.email!, "playlists", playlist!, "songs")
        const l = await getDocs(ref)

        localStorage.setItem("currentList", JSON.stringify(ref.path))
        setCurrentList(l)
      }
    } catch (error) {
      console.error(error)
    }
  }

  function handlePause() {
    setIsPlaying(false)
  }

  const isCurrentSong = song.id === currentTrack?.id
  const isInSongPage = pathname.includes("song")
  const isCollectionPage = pathname.includes("collection")
  const isLikedPage = pathname.split("/").pop() === "tracks"
  const isPlaylistPage = isCollectionPage && !isLikedPage

  return (
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
  )
}
