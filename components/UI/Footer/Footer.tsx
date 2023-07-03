'use client'

import usePlayer from "@/hooks/usePlayer"

import VolumeProgressBar from "./VolumeProgressBar/VolumeProgressBar"
import PlayerProgressBar from "./PlayerProgressBar/PlayerProgressBar"
import SongMetadata from "./SongMetadata/SongMetadata"

export default function Footer() {
  const { audioRef, curretState, controls, audioVolume, setAudioVolume, isLoopEnable, methods } = usePlayer()
  const { handleEnded, handleLoadedMetadata, handleTimeUpdate, jumpToOffset } = methods
  const { currentTime, currentTrack } = curretState

  return (
    <footer className="grid grid-cols-2 md:grid-cols-3 h-40 md:h-24 text-[#b3b3b3] select-none">
      <audio
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        loop={isLoopEnable}
        ref={audioRef}
        src={currentTrack?.data().path.audio} />
      <div className="flex p-3 space-x-4 items-center h-20 md:h-24">
        <SongMetadata />
      </div>
      <div className="flex order-3 col-span-2 md:order-2 md:col-span-1 justify-center items-center">
        <PlayerProgressBar
          currentTime={currentTime!}
          jumpToOffset={jumpToOffset}
          duration={currentTrack?.data().duration}
          controls={controls} />
      </div>
      <div className="flex order-2 md:order-3 justify-end">
        <VolumeProgressBar
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume} />
      </div>
    </footer>
  )
}
