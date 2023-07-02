'use client'

import { useContext, useEffect } from "react"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { db } from "@/firebase"
import { useDocument } from "react-firebase-hooks/firestore"
import { DocumentData, QueryDocumentSnapshot, doc } from "firebase/firestore"
import { usePathname } from "next/navigation"

import LikeSong from "@/components/UI/LikeSong/LikeSong"
import SongRow from "@/components/UI/SongRow/SongRow"
import SongPageHeader from "@/components/UI/Song/SongPageHeader"
import SongPlayButton from "@/components/UI/PlayButton/SongPlayButton"
import SongHeader from "@/components/UI/Collection/SongHeader"

export default function SongPage() {
  const { setLoading } = useContext(PlayerContext)
  const pathname = usePathname()
  const [song, loading] = useDocument(doc(db, "songs", pathname.split("/").pop()!))

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
      <SongPageHeader song={song!} />
      <div className={`flex flex-col -mx-6 bg-gradient-to-b from-blue-950 to-[#121214] h-48 text-[#b3b3b3]`}>
        <div className="flex space-x-4 p-6">
          <SongPlayButton song={song as QueryDocumentSnapshot<DocumentData>} type="visible" />
          <LikeSong className="h-9" song={song!} />
        </div>
        <SongHeader />
        <SongRow song={song!} />
      </div>
    </div>
  )
}
