import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { memo, useContext } from "react"

import LikeSong from "@/components/UI/LikeSong/LikeSong"
import Image from "next/image"

export default memo(function SongMetadata() {
  const { currentTrack } = useContext(PlayerContext)
  return (
    <>
      {currentTrack
        ? <>
          <Image width={56} height={56} src={currentTrack.data().path.cover} className="rounded-sm object-cover" alt="cover" />
          <div className="flex flex-col">
            <span className="text-white line-clamp-1">{currentTrack.data().metadata.songName}</span>
            <span className="text-xs">{currentTrack.data().metadata.artistName}</span>
          </div>
          <LikeSong className="hidden md:block" song={currentTrack} />
        </>
        : <div className="h-20" />
      }
    </>
  )
})
