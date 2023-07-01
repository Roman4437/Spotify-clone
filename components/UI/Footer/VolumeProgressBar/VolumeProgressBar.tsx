import { memo, useContext, useRef, useState } from "react"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"

import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid"

interface VolumeProgressBarProps {
  audioVolume: number,
  setAudioVolume: (n: number) => void
}

export default memo(function VolumeProgressBar({ audioVolume, setAudioVolume }: VolumeProgressBarProps) {
  const { currentTrack } = useContext(PlayerContext)
  const [isHovered, setIsHovered] = useState(false)
  const [isAudioMuted, setIsAudioMuted] = useState(false)

  const copiedVolume = useRef<number>(audioVolume)

  function volumeChange(event: React.MouseEvent) {
    event.preventDefault()

    const startX = event.clientX
    const startValue = audioVolume

    const onMouseMove = (event: MouseEvent) => {
      const dX = event.clientX - startX
      const newValue = Math.max(0, Math.min(100, startValue + (dX / 128) * 100))
      setAudioVolume(newValue)

      if (newValue > 0)
        setIsAudioMuted(false)

      if (newValue === 0)
        setIsAudioMuted(true)
    }

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  function volumeJump(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const newValue = Math.max(0, Math.min(100, (clickX / rect.width) * 100))
    setAudioVolume(newValue)

    if (newValue > 0)
      setIsAudioMuted(false)

    if (newValue === 0)
      setIsAudioMuted(true)
  }

  function muteAudio() {
    copiedVolume.current = audioVolume
    setAudioVolume(0)
    setIsAudioMuted(true)
  }

  function unmuteAudio() {
    setAudioVolume(copiedVolume.current)
    setIsAudioMuted(false)
  }

  return (
    <div className="flex p-3 space-x-2 items-center">
      {!currentTrack && <SpeakerXMarkIcon className="w-5 text-[rgb(40,40,40)]" />}
      {isAudioMuted || audioVolume === 0
        ? currentTrack && <SpeakerXMarkIcon onClick={unmuteAudio} className="w-5" />
        : currentTrack && <SpeakerWaveIcon onClick={muteAudio} className="w-5" />}
      <div
        className="p-1"
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        onClick={volumeJump}>
        {currentTrack
          ? <div className="relative w-32 h-1 bg-[hsla(0,0%,100%,.3)] rounded-full">
            <div
              className={`absolute top-0 left-0 h-full ${isHovered ? "bg-green-400" : "bg-white"} rounded-full`}
              style={{ width: `${audioVolume * 1.28}px` }} />
            <div
              className={`absolute w-3 h-3 -top-1 ${isHovered ? "bg-white" : "bg-transparent"} rounded-full`}
              style={{ left: `${audioVolume * 1.28 - 6}px` }}
              onMouseDown={volumeChange} />
          </div>
          : <div className="relative w-32 h-1 bg-[rgb(40,40,40)] rounded-full" />}
      </div>
    </div>
  )
})