'use client'

import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { db } from "@/firebase"
import useHistory from "@/hooks/useHistory"
import { PlayIcon } from "@heroicons/react/24/solid"
import { collection, doc } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { useContext, useEffect } from "react"
import { useCollection, useDocument } from "react-firebase-hooks/firestore"

export default function Home() {
  const { setLoading } = useContext(PlayerContext)
  const { push } = useHistory()
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
        Good {Intl.DateTimeFormat("eu-GB", { dayPeriod: "long" }).format(new Date()).split(" ").pop()}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pb-4">
        {songs
          ? <>
            <div className="flex group bg-[#302944]/60 rounded-sm items-center justify-between h-20">
              <button onClick={() => push("/collection/tracks")} className="flex items-center h-full space-x-4">
                <img src="/liked-songs-640.png" className="h-full aspect-square object-cover rounded-l-sm" alt="liked songs" />
                <span className="truncate">Liked Songs</span>
              </button>
              <button
                className="opacity-0 transition ease-in-out group-hover:opacity-100 play_button mr-4"
                onClick={() => push("/collection/tracks")}>
                <PlayIcon className="h-8 text-black" />
              </button>
            </div>
            {songs?.docs.slice(songs.size - 3, songs.size).map(song => <div
              key={song.id}
              className="flex group bg-[#302944]/60 rounded-sm items-center justify-between h-20">
              <button onClick={() => push("/collection/tracks")} className="relative flex items-center h-full space-x-4">
                <img src={song.data().path.cover} className="h-full aspect-square object-cover rounded-l-sm" alt={song.data().metadata.songName} />
                <span className="truncate">{song.data().metadata.songName}</span>
              </button>
              <button
                className="opacity-0 transition ease-in-out group-hover:opacity-100 play_button mr-4"
                onClick={() => push(`/song/${song.id}`)}>
                <PlayIcon className="h-8 text-black" />
              </button>
            </div>)}
          </>
          : Array.from({ length: 4 }, () => <div key={crypto.randomUUID()} className="bg-[#383838]/60 rounded-sm h-20" />)}
      </div>
      <h2 className="text-2xl font-bold mb-6">
        Recently played
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-6 pb-4">
        {songs
          ? recentlyPlayed?.data()?.recentlyPlayed?.map((song: Song) => <button
            key={song.id}
            onClick={() => push(`/song/${song.id}`)}
            className="flex group flex-col rounded-md bg-[#171717] p-4">
            <div className="relative">
              <img src={song.path.cover} className="w-full aspect-square self-center rounded-md" alt={song.metadata.songName} />
              <div className="opacity-0 group-hover:opacity-100 transition ease-in-out absolute bottom-2 right-2 play_button">
                <button>
                  <PlayIcon className="h-8 text-black" />
                </button>
              </div>
            </div>
            <span className="mt-2 truncate">{song.metadata.songName}</span>
            <span className="text-sm text-[#b3b3b3] truncate">{song.metadata.artistName}</span>
          </button>)
          : Array.from({ length: 5 }, () => <div key={crypto.randomUUID()} className="flex flex-col rounded-md bg-[#171717] p-4">
            <div className="bg-[#383838] w-full aspect-square self-center rounded-md" />
            <div className="bg-[#383838] w-full mt-2 truncate h-4 rounded-md" />
            <div className="bg-[#383838] w-4/5 text-sm mt-2 truncate h-4 rounded-md" />
          </div>)}
      </div>
    </div>
  )
}
