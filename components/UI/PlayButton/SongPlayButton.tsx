import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid"
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import { useContext } from "react"

interface SongPlayButtonProps {
  song: QueryDocumentSnapshot<DocumentData>
  type: "visible" | "hover"
}

export default function SongPlayButton({ song, type }: SongPlayButtonProps) {
  const { currentTrack, setCurrentTrack, isPlaying, setIsPlaying, currentList, setCurrentList } = useContext(PlayerContext)

  function handlePlay(event: React.MouseEvent<HTMLButtonElement>, song: QueryDocumentSnapshot<DocumentData>) {
    event.stopPropagation()

    if (!isInActiveList) {
      setCurrentList(undefined)
    }

    setCurrentTrack(song)
    setIsPlaying(true)
  }

  function handlePause(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()

    setIsPlaying(false)
  }

  const isInActiveList = currentList?.docs.find(s => s.id === song.id)

  return (
    <>
      {currentTrack?.id !== song.id
        ? <button
          className={`${type === "visible" ? "play_button" : "play_button_visible_on_hover"}`}
          onClick={e => handlePlay(e, song)}>
          <PlayIcon className="h-8 text-black" />
        </button>
        : isPlaying
          ? <button
            className={`${type === "visible" ? "play_button" : "play_button_visible_on_hover"}`}
            onClick={handlePause}>
            <PauseIcon className="h-8 text-black" />
          </button>
          : <button
            className={`${type === "visible" ? "play_button" : "play_button_visible_on_hover"}`}
            onClick={e => handlePlay(e, song)}>
            <PlayIcon className="h-8 text-black" />
          </button>}
    </>
  )
}
