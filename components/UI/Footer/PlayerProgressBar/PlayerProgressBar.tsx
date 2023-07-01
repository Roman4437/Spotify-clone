import { useContext, useEffect, useRef, useState } from "react"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { formatTime } from "@/lib"

import ControlsBar, { Controls } from "./ControlsBar"

interface PlayerProgressBarProps {
  currentTime: number,
  jumpToOffset: (n: number) => void,
  duration: number,
  controls: Controls
}

export default function PlayerProgressBar({ currentTime, jumpToOffset, duration, controls }: PlayerProgressBarProps) {
  const { currentTrack } = useContext(PlayerContext)
  const [isHovered, setIsHovered] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [isMouseUp, setIsMouseUp] = useState(false)
  const [offsetPercentage, setOffsetPercentage] = useState(0)

  const newTime = useRef<number>(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const [trackWidth, setTrackwidth] = useState(trackRef.current?.clientWidth)

  useEffect(() => {
    setTrackwidth(trackRef.current?.clientWidth)
  }, [trackRef.current?.clientWidth])

  useEffect(() => {
    const offset = (currentTime / duration) * 100
    if (!isMouseDown) {
      setOffsetPercentage(offset)
      newTime.current = offset
    }
  }, [currentTime, currentTrack])

  function offsetChange(event: React.MouseEvent) {
    event.preventDefault()
    setIsMouseDown(true)

    const startX = event.clientX
    const startValue = offsetPercentage

    const onMouseMove = (event: MouseEvent) => {
      const distanceX = event.clientX - startX
      const newValue = Math.max(0, Math.min(100, startValue + (distanceX / trackWidth!) * 100))
      newTime.current = newValue
      setOffsetPercentage(newValue)
    }

    const onMouseUp = () => {
      setIsMouseUp(true)
      setIsMouseDown(false)
      jumpToOffset((newTime.current / 100) * (duration - 0) + 0)
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  function offsetJump(event: React.MouseEvent) {
    if (!isMouseUp) {
      const rect = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const newValue = Math.max(0, Math.min(100, (clickX / rect.width) * 100))
      setOffsetPercentage(newValue)
      jumpToOffset((newValue / 100) * duration)
    }

    setIsMouseUp(false)
  }

  return (
    <div className="flex flex-col space-y-3 mb-5 md:mb-0">
      <ControlsBar controls={controls} />
      <div className="flex space-x-1">
        <span className="text-xs">
          {currentTrack
            ? formatTime((offsetPercentage / 100) * duration)
            : <span className="truncate">-:--</span>}
        </span>
        <div
          className="flex items-center justify-center"
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
          onClick={offsetJump}>
          <div className="p-1">
            {currentTrack
              ? <div ref={trackRef} className="relative w-72 md:w-96 h-1 bg-[hsla(0,0%,100%,.3)] rounded-full">
                <div
                  className={`absolute top-0 left-0 h-full ${isHovered ? "bg-green-400" : "bg-white"} rounded-full`}
                  style={{ width: `${offsetPercentage * (trackWidth! / 100)}px` }} />
                <div
                  className={`absolute w-3 h-3 -top-1 ${isHovered ? "bg-white" : "bg-transparent"} rounded-full`}
                  style={{ left: `${offsetPercentage * (trackWidth! / 100) - 6}px` }}
                  onMouseDown={offsetChange} />
              </div>
              : <div ref={trackRef} className="relative w-72 md:w-96 h-1 bg-[rgb(40,40,40)] rounded-full" />}
          </div>
        </div>
        <span className="text-xs">
          {currentTrack
            ? formatTime(duration)
            : <span className="truncate">-:--</span>}
        </span>
      </div>
    </div>
  )
}
