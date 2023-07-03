import { db } from "@/firebase"
import { DocumentData, QuerySnapshot, doc, setDoc } from "firebase/firestore"
import { useSession } from "next-auth/react"

interface NewPlaylistProps {
  playlists: QuerySnapshot<DocumentData>
}

export default function NewPlaylist({ playlists }: NewPlaylistProps) {
  const { data } = useSession()

  function addPlaylist() {
    setDoc(doc(db, "users", data?.user?.email!, "playlists", `Playlist ${playlists?.size! + 1}`), {})
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={addPlaylist}
        className="py-[5px] px-3 font-bold text-sm rounded-full bg-[#ffffff12] hover:opacity-80">
        New Playlist
      </button>
    </div>
  )
}
