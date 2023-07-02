import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import useHistory from "@/hooks/useHistory"
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid"
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import { useContext } from "react"
import SongPlayButton from "../PlayButton/SongPlayButton"

interface SongRowSmallProps {
  song: QueryDocumentSnapshot<DocumentData>
}

export default function SongRowSmall({ song }: SongRowSmallProps) {
  const { currentTrack, setCurrentTrack, isPlaying, setIsPlaying, currentList, setCurrentList } = useContext(PlayerContext)
  const { push } = useHistory()

  function handlePlay(event: React.MouseEvent<HTMLButtonElement>, song: QueryDocumentSnapshot<DocumentData>) {
    event.stopPropagation()

    if (!isInActiveList)
      setCurrentList(undefined)

    setCurrentTrack(song)
    setIsPlaying(true)
  }

  function handlePause(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()

    setIsPlaying(false)
  }

  const isInActiveList = currentList?.docs.find(s => s.id === song.id)
  const isCurrentTrack = currentTrack?.id === song.id

  return (
    <div
      onClick={() => push(`/song/${song.id}`)}
      className="flex group bg-[#302944]/60 rounded-sm items-center justify-between h-20 cursor-pointer">
      <div className="flex items-center h-full space-x-4">
        <img
          src={song.data().path.cover}
          className="h-full aspect-square object-cover rounded-l-sm"
          alt={song.data().metadata.songName} />
        <span className="truncate">{song.data().metadata.songName}</span>
      </div>
      <SongPlayButton song={song} type="hover" />
    </div>
  )
}
