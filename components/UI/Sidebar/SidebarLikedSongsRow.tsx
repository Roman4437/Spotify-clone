import { db } from "@/firebase"
import useHistory from "@/hooks/useHistory"
import { DocumentData, QuerySnapshot, collection } from "firebase/firestore"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useCollection } from "react-firebase-hooks/firestore"
import SidebarSongRowLoading from "./SidebarSongRowLoading"

interface SidebarLikedSongsRowProps {
  songs: QuerySnapshot<DocumentData>
}

export default function SidebarLikedSongsRow({ songs }: SidebarLikedSongsRowProps) {
  const { data } = useSession()
  const [likedSongs] = useCollection(collection(db, "users", data?.user?.email!, "playlists", "liked", "songs"))
  const { push } = useHistory()
  const pathname = usePathname()

  const isLikedSongsPage = pathname === "/collection/tracks"
  return (
    <>
      {songs
        ? likedSongs && likedSongs.size > 0 && <div
          onClick={() => push("/collection/tracks")}
          className={`flex items-center p-2 rounded-md space-x-3 cursor-pointer hover:bg-[#ffffff12] transition ${isLikedSongsPage ? "bg-[#ffffff12]" : "bg-transparent"}`}>
          <Image
            width={48}
            height={48}
            className="rounded-sm object-cover"
            src="/liked-songs-640.png"
            alt="Liked Songs" />
          <div className="flex flex-col justify-between">
            <span className="text-green-400">Liked Songs</span>
            <span className="text-xs text-[#b3b3b3] truncate">Playlist &bull; {data?.user?.name}</span>
          </div>
        </div>
        : <SidebarSongRowLoading />}
    </>
  )
}
