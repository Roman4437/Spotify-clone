'use client'

import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { db } from "@/firebase"
import { getGreeting } from "@/lib"
import { collection, doc } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { useContext, useEffect } from "react"
import { useCollection, useDocument } from "react-firebase-hooks/firestore"

import LikedRowSmall from "@/components/UI/SongCard/LikedRowSmall"
import RecentlyPlayed from "@/components/UI/SongCard/RecentlyPlayed"
import SongCarMediumLoading from "@/components/UI/SongCard/SongCarMediumLoading"
import SongRowSmall from "@/components/UI/SongCard/SongRowSmall"

export default function Home() {
  const { setLoading } = useContext(PlayerContext)
  const { data } = useSession()
  const [songs, loading] = useCollection(collection(db, "songs"))
  const [recentlyPlayed] = useDocument(doc(db, "users", data?.user?.email!))

  useEffect(() => {
    if (loading)
      setLoading(true)
    else
      setLoading(false)
  }, [loading])

  return (
    <div className={`flex flex-col px-6 h-48 w-full ${loading ? "bg-[#121214]" : "bg-gradient-to-b from-blue-950 to-[#121214]"} pt-4`}>
      <h1 className="text-3xl font-bold mb-6">
        {getGreeting()}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pb-4">
        {songs
          ? <>
            <LikedRowSmall />
            {songs?.docs.slice(songs.size - 3, songs.size).map(song => <SongRowSmall key={song.id} song={song} />)}
          </>
          : Array.from({ length: 4 }, () => <div key={crypto.randomUUID()} className="bg-[#383838]/60 rounded-sm h-20" />)}
      </div>
      <h2 className="text-2xl font-bold mb-6">
        Recently played
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-6 pb-4">
        {songs
          ? recentlyPlayed?.data()?.recentlyPlayed?.reverse().map((song: Song) => <RecentlyPlayed key={song.id} song={song} />)
          : Array.from({ length: 5 }, () => <SongCarMediumLoading key={crypto.randomUUID()} />)}
      </div>
    </div>
  )
}
