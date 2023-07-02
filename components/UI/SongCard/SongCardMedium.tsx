import useHistory from "@/hooks/useHistory"
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"

import SongPlayButton from "../PlayButton/SongPlayButton"

interface SongCardMediumProps {
  song: QueryDocumentSnapshot<DocumentData>
}

export default function SongCardMedium({ song }: SongCardMediumProps) {
  const { push } = useHistory()

  return (
    <div
      onClick={() => push(`/song/${song.id}`)}
      className="group flex flex-col rounded-md bg-[#171717] p-4 cursor-pointer">
      <div className="relative">
        <img
          src={song.data().path.cover}
          className="w-full aspect-square self-center rounded-md"
          alt="cover"
          loading="lazy" />
        <SongPlayButton song={song} type="hover" />
      </div>
      <span className="mt-2 truncate">{song.data().metadata.songName}</span>
      <span className="text-sm text-[#b3b3b3] truncate">{song.data().metadata.artistName}</span>
    </div>
  )
}
