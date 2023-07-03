import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import useHistory from "@/hooks/useHistory"
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useContext } from "react"
import Equalizer from "../Equalizer"

interface SidebarSongRowProps {
  song: QueryDocumentSnapshot<DocumentData>
}

export default function SidebarSongRow({ song }: SidebarSongRowProps) {
  const { currentTrack, isPlaying } = useContext(PlayerContext)
  const { push } = useHistory()
  const pathname = usePathname()

  const isActive = pathname.includes(song.id)

  return (
    <div
      key={song.id}
      onClick={() => push(`/song/${song.id}`)}
      className={`flex p-2 justify-between items-center rounded-md cursor-pointer hover:bg-[#ffffff12] transition ${isActive ? "bg-[#ffffff12]" : "bg-transparent"}`}>
      <div className="flex space-x-3 items-center">
        <Image
          width={48}
          height={48}
          className="rounded-sm aspect-square object-cover"
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
    </div>
  )
}
