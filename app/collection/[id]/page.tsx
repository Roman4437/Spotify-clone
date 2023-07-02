'use client'

import { useContext, useEffect } from "react"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { useSession } from "next-auth/react"
import { useCollection } from "react-firebase-hooks/firestore"
import { collection } from "firebase/firestore"
import { usePathname } from "next/navigation"
import { db } from "@/firebase"

import PlaylistSongsPageHeader from "@/components/UI/Collection/PlaylistSongsPageHeader"
import PlaylistPlayButton from "@/components/UI/PlayButton/PlaylistPlayButton"
import SongHeader from "@/components/UI/Collection/SongHeader"
import SongFooter from "@/components/UI/Collection/SongFooter"


export default function PlaylistPage() {
  const { setLoading } = useContext(PlayerContext)

  const { data } = useSession()
  const pathname = usePathname()
  const [playlist, loading] = useCollection(collection(db, "users", data?.user?.email!, "playlists", pathname.split('/').pop()?.replace("%20", " ")!, "songs"))

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
      <PlaylistSongsPageHeader size={playlist?.size!} />
      <div className="flex flex-col -mx-6 bg-gradient-to-b from-blue-950 to-[#121214] h-48 text-[#b3b3b3]">
        <div className="p-6">
          <PlaylistPlayButton songs={playlist!} type="visible" />
        </div>
        <SongHeader />
        <SongFooter songs={playlist!} />
      </div>
    </div>
  )
}
