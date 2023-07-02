import { db } from "@/firebase"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { deleteDoc, doc } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

interface RemoveFromPlaylistButtonProps {
  id: string
}

export default function RemoveFromPlaylistButton({ id }: RemoveFromPlaylistButtonProps) {
  const pathname = usePathname()
  const { data } = useSession()

  function removeFromPlaylist() {
    deleteDoc(doc(db, "users", data?.user?.email!, "playlists", pathname.split('/').pop()?.replace("%20", " ")!, "songs", id))
  }

  return (
    <>
      {pathname.includes("collection/Play") && <div className="relative text-lg">
        <button
          onClick={removeFromPlaylist}
          className="hidden group-hover:block p-1 bg-neutral-400/40 rounded-full hover:bg-neutral-300/10">
          <XMarkIcon className="h-3" />
        </button>
      </div>}
    </>
  )
}
