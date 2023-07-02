import { DocumentData, QuerySnapshot } from "firebase/firestore"
import SongRow from "../SongRow/SongRow"

interface SongFooterProps {
  songs: QuerySnapshot<DocumentData>
}

export default function SongFooter({ songs }: SongFooterProps) {

  return (
    <div className="pb-4">
      {songs.docs.map((song, index) => <SongRow key={song.id} song={song} index={index} />)}
      {songs.size === 0
        && <div className="flex justify-center mt-8">
          <span className="text-xs text-neutral-400">Empty.</span>
        </div>}
    </div>
  )
}
