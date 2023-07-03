import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid"
import { DocumentData, QuerySnapshot } from "firebase/firestore"
import { useContext } from "react"

interface PlaylistPlayButtonProps {
  songs: QuerySnapshot<DocumentData>
  type: "visible" | "hover"
}

export default function PlaylistPlayButton({ songs, type }: PlaylistPlayButtonProps) {
  const { currentTrack, setCurrentTrack, currentList, setCurrentList, isPlaying, setIsPlaying } = useContext(PlayerContext)

  function handlePlay(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()

    if (!isCurrentSongInPlaylist) {
      setCurrentTrack(songs?.docs[0])
    }

    if (!isActiveList && !isCurrentSongInPlaylist) {
      setCurrentList(songs)
    }

    setIsPlaying(true)
  }

  function handlePause(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()

    setIsPlaying(false)
  }

  const isActiveList = currentList?.metadata === songs?.metadata
  const isCurrentSongInPlaylist = songs?.docs.find(s => s.id === currentTrack?.id)

  return (
    <>
      {isPlaying && isCurrentSongInPlaylist
        ? <button
          onClick={handlePause}
          className={`${type === "visible" ? "play_button" : "play_button_visible_on_hover"}`}
          disabled={songs?.size === 0}>
          <PauseIcon className="h-8 text-black" />
        </button>
        : <button
          onClick={handlePlay}
          className={`${type === "visible" ? "play_button" : "play_button_visible_on_hover"}`}
          disabled={songs?.size === 0}>
          <PlayIcon className="h-8 text-black" />
        </button>}
    </>
  )
}
