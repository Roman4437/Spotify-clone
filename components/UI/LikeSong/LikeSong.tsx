import { DocumentData, collection, deleteDoc, doc, setDoc } from "firebase/firestore"

import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline"
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"
import { db } from "@/firebase"
import { useSession } from "next-auth/react"
import { useCollection } from "react-firebase-hooks/firestore"

interface LikeSongProps {
  className?: string,
  song: DocumentData
}

export default function LikeSong({ className, song }: LikeSongProps) {
  const { data } = useSession()
  const [likedSongs] = useCollection(collection(db, "users", data?.user?.email!, "playlists", "liked", "songs"))

  async function addToFavorite() {
    setDoc(
      doc(db, "users", data?.user?.email!, "playlists", "liked", "songs", song.id), {
      ...song.data()
    })
  }

  function removeFromFavorite() {
    deleteDoc(doc(db, "users", data?.user?.email!, "playlists", "liked", "songs", song.id))
  }

  return (
    <>
      {likedSongs?.docs.find(s => s.id === song.id)
        ? <button className="p-2 cursor-default" onClick={removeFromFavorite}>
          <HeartIconSolid className={`text-green-500 transition h-5 ${className}`} />
        </button>
        : <button className="p-2 cursor-default" onClick={addToFavorite}>
          <HeartIconOutline className={`text-neutral-400 hover:text-white transition h-5 ${className}`} />
        </button>}
    </>
  )
}
