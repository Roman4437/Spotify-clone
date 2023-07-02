'use client'

import { useContext, useEffect } from "react"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { useSession } from "next-auth/react"
import { useCollection } from "react-firebase-hooks/firestore"
import { collection } from "firebase/firestore"
import { db } from "@/firebase"

import LikedSongsPageHeader from "@/components/UI/Collection/Liked/LikedSongsPageHeader"
import PlaylistPlayButton from "@/components/UI/PlayButton/PlaylistPlayButton"
import SongHeader from "@/components/UI/Collection/SongHeader"
import SongFooter from "@/components/UI/Collection/SongFooter"

export default function LikedSongsPage() {
  const { setLoading } = useContext(PlayerContext)
  const { data } = useSession()
  const [likedSongs, loading] = useCollection(collection(db, "users", data?.user?.email!, "playlists", "liked", "songs"))

  useEffect(() => {
    if (loading)
      setLoading(true)
    else
      setLoading(false)
  }, [loading])

  if (loading) {
    return null
  }

  return (
    <div className="flex flex-col px-6 w-full bg-gradient-to-b from-blue-950 to-[#121214] pt-4">
      <LikedSongsPageHeader size={likedSongs?.size!} />
      <div className="flex flex-col -mx-6 bg-gradient-to-b from-blue-950 to-[#121214] h-48 text-[#b3b3b3]">
        <div className="p-6">
          <PlaylistPlayButton songs={likedSongs!} type="visible" />
        </div>
        <SongHeader />
        <SongFooter songs={likedSongs!} />
      </div>
    </div>
  )
}
