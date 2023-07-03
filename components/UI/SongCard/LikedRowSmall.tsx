import { db } from "@/firebase"
import useHistory from "@/hooks/useHistory"
import { collection } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { useCollection } from "react-firebase-hooks/firestore"

import PlaylistPlayButton from "../PlayButton/PlaylistPlayButton"

export default function LikedRowSmall() {
  const { data } = useSession()
  const [likedSongs] = useCollection(collection(db, "users", data?.user?.email!, "playlists", "liked", "songs"))
  const { push } = useHistory()

  return (
    <div
      onClick={() => push("/collection/tracks")}
      className="flex group bg-[#302944]/60 rounded-sm items-center justify-between h-20 cursor-pointer">
      <div className="flex items-center h-full space-x-4">
        <img
          src="/liked-songs-640.png"
          className="h-full aspect-square object-cover rounded-l-sm"
          alt="liked songs" />
        <span className="truncate">Liked Songs</span>
      </div>
      <div className="hidden xl:block  mr-4">
        <PlaylistPlayButton songs={likedSongs!} type="hover" />
      </div>
    </div>
  )
}
