import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { memo, useContext } from "react"

import LikeSong from "@/components/UI/LikeSong/LikeSong"

export default memo(function SongMetadata() {
  const { currentTrack } = useContext(PlayerContext)
  return (
    <>
      {currentTrack
        ? <>
          <img src={currentTrack.data().path.cover} className="rounded-sm h-14 aspect-square object-cover" />
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
