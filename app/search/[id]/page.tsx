'use client'

import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { db } from "@/firebase"
import { collection } from "firebase/firestore"
import { usePathname } from "next/navigation"
import { useContext, useEffect } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

import SongCardMedium from "@/components/UI/SongCard/SongCardMedium"

export default function QueryPage() {
  const { setLoading } = useContext(PlayerContext)
  const [songs] = useCollection(collection(db, "songs"))
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
  }, [])

  const searchTerm = pathname.split("/").pop()?.toLowerCase()

  const filteredSongs = songs?.docs.filter(s => {
    const songName = s.data().metadata.songName.toLowerCase()
    const artistName = s.data().metadata.artistName.toLowerCase()

    return (
      songName.includes(searchTerm) ||
      artistName.includes(searchTerm)
    )
  })

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 p-6 gap-6 pb-4">
      {filteredSongs?.reverse().map(song => <SongCardMedium key={song.id} song={song} />)}
      <div className="flex col-span-3 md:col-span-5 w-full justify-center">
        {!songs
          && <span className="text-[#b3b3b3] animate-pulse">Loading...</span>}
        {filteredSongs?.length === 0
          && <span className="text-[#b3b3b3]">No results.</span>}
      </div>
    </div>
  )
}
