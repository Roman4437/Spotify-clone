import { db } from "@/firebase"
import useHistory from "@/hooks/useHistory"
import { MusicalNoteIcon } from "@heroicons/react/24/solid"
import { DocumentData, QuerySnapshot, collection } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useCollection } from "react-firebase-hooks/firestore"

interface SidebarPlaylistRowProps {
  songs: QuerySnapshot<DocumentData>
}

export default function SidebarPlaylistRow({ songs }: SidebarPlaylistRowProps) {
  const { data } = useSession()
  const [playlists] = useCollection(collection(db, "users", data?.user?.email!, "playlists"))
  const { push } = useHistory()
  const pathname = usePathname()

  return (
    <>
      {songs && playlists?.docs.map(list => <div
        key={list.id}
        onClick={() => push(`/collection/${list.id}`)}
        className={`flex p-2 justify-between items-center rounded-md cursor-pointer hover:bg-[#ffffff12] transition ${pathname.includes(list.id) ? "bg-[#ffffff12]" : "bg-transparent"}`}>
        <div className="flex space-x-3">
          <div className="flex justify-center items-center rounded-sm h-12 aspect-square bg-[#383838]">
            <MusicalNoteIcon className="h-6 text-[#b3b3b3]" />
          </div>
          <div className="flex flex-col justify-between">
            <span className="">{list.id}</span>
            <span className="text-xs text-[#b3b3b3] truncate">Playlist &bull; {data?.user?.name}</span>
          </div>
        </div>
      </div>)}
    </>
  )
}