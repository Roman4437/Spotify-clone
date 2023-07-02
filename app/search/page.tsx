'use client'

import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { db } from "@/firebase"
import { collection } from "firebase/firestore"
import { useContext, useEffect } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

import SongCardMedium from "@/components/UI/SongCard/SongCardMedium"
import SongCarMediumLoading from "@/components/UI/SongCard/SongCarMediumLoading"

export default function SearchPage() {
  const { setLoading } = useContext(PlayerContext)
  const [songs] = useCollection(collection(db, "songs"))

  useEffect(() => {
    setLoading(true)
  }, [])

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 p-6 gap-6 pb-4">
      {songs
        ? songs.docs.reverse().map(song => <SongCardMedium key={song.id} song={song} />)
        : Array.from({ length: 10 }, () => <SongCarMediumLoading key={crypto.randomUUID()} />)}
    </div>)
}