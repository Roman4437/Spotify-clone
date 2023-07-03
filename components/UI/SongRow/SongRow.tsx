import { useContext, useState } from "react"
import { db } from "@/firebase"
import { formatTime } from "@/lib"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { DocumentData, collection } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { useCollection } from "react-firebase-hooks/firestore"

import LikeSong from "@/components/UI/LikeSong/LikeSong"
import Image from "next/image"
import SmallPlayButton from "../PlayButton/SmallPlayButton"
import RemoveFromPlaylistButton from "./RemoveFromPlaylistButton"
import AddToPlaylist from "./AddToPlaylist"

interface SongRowProps {
  song: DocumentData,
  index?: number
}

export default function SongRow({ song, index = 0 }: SongRowProps) {
  const { currentTrack } = useContext(PlayerContext)
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [isHover, setiSHover] = useState(false)
  const { data } = useSession()
  const [playlists] = useCollection(collection(db, "users", data?.user?.email!, "playlists"))

  function handleEnter() {
    setiSHover(true)
  }

  function handleLeave() {
    setiSHover(false)
    setIsSelectOpen(false)
  }

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group flex justify-between items-center mx-6 mt-3 px-4 py-2 rounded-sm hover:bg-[#ffffff12]">
      <div className="flex items-center space-x-4">
        <SmallPlayButton
          song={song}
          index={index}
          isHover={isHover} />
        <Image
          width={40}
          height={40} className="object-cover"
          src={song.data().path.cover}
          alt="cover" />
        <div className="flex flex-col space-y-1">
          <span className={`${currentTrack?.i === song.id ? "text-green-500" : "text-white"} select-text`}>
            {song.data().metadata.songName}
          </span>
          <span className="text-xs select-text">{song.data().metadata.artistName}</span>
        </div>
        <RemoveFromPlaylistButton id={song.id} />
        <AddToPlaylist
          song={song}
          playlists={playlists!}
          isSelectOpen={isSelectOpen}
          setIsSelectOpen={setIsSelectOpen} />
      </div>
      <div className="flex space-x-6 items-center">
        <LikeSong song={song} />
        <span className="text-sm">{formatTime(song.data().duration)}</span>
      </div>
    </div>
  )
}
