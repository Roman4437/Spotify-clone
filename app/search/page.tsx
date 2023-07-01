'use client'

import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { db } from "@/firebase"
import useHistory from "@/hooks/useHistory"
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid"
import { DocumentData, QueryDocumentSnapshot, collection } from "firebase/firestore"
import { useContext, useEffect } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

export default function SearchPage() {
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying, setLoading } = useContext(PlayerContext)
  const { push } = useHistory()
  const [songs] = useCollection(collection(db, "songs"))

  useEffect(() => {
    setLoading(true)
  }, [])

  function handlePlay(song: QueryDocumentSnapshot<DocumentData>, event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    setCurrentTrack(song)
    setIsPlaying(true)
  }

  function handlePause(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    setIsPlaying(false)
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 p-6 gap-6 pb-4">
      {songs
        ? songs.docs.map(song => <button
          key={song.id}
          onClick={() => push(`/song/${song.id}`)}
          className="group flex flex-col rounded-md bg-[#171717] p-4">
          <div className="relative">
            <img src={song.data().path.cover} className="w-full aspect-square self-center rounded-md" loading="lazy" />
            {currentTrack?.id !== song.id
              ? <button
                className="opacity-0 group-hover:opacity-100 transition ease-in-out absolute bottom-2 right-2 play_button"
                onClick={e => handlePlay(song, e)}>
                <PlayIcon className="h-8 text-black" />
              </button>
              : isPlaying
                ? <button
                  className="opacity-0 group-hover:opacity-100 transition ease-in-out absolute bottom-2 right-2 play_button"
                  onClick={handlePause}>
                  <PauseIcon className="h-8 text-black" />
                </button>
                : <button
                  className="opacity-0 group-hover:opacity-100 transition ease-in-out absolute bottom-2 right-2 play_button"
                  onClick={e => handlePlay(song, e)}>
                  <PlayIcon className="h-8 text-black" />
                </button>}
          </div>
          <span className="mt-2 truncate">{song.data().metadata.songName}</span>
          <span className="text-sm text-[#b3b3b3] truncate">{song.data().metadata.artistName}</span>
        </button>)
        : Array.from({ length: 10 }, () => <div key={crypto.randomUUID()} className="flex flex-col rounded-md bg-[#171717] p-4">
          <div className="bg-[#383838] w-full aspect-square self-center rounded-md" />
          <div className="bg-[#383838] w-full mt-2 truncate h-4 rounded-md" />
          <div className="bg-[#383838] w-4/5 text-sm mt-2 truncate h-4 rounded-md" />
        </div>)}
    </div>)
}