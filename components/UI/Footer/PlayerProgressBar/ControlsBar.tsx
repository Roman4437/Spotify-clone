import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { useContext } from "react"

import {
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  PauseIcon,
  PlayIcon
} from "@heroicons/react/24/solid"

export interface Controls {
  isLoopEnable: boolean,
  setIsLoopEnable: React.Dispatch<React.SetStateAction<boolean>>,
  isShuffleEnable: boolean,
  setIsShuffleEnable: React.Dispatch<React.SetStateAction<boolean>>
}

interface ControlsProps {
  controls: Controls
}

export default function ControlsBar({ controls }: ControlsProps) {
  const { isLoopEnable, isShuffleEnable, setIsLoopEnable, setIsShuffleEnable } = controls
  const { currentTrack, setCurrentTrack, currentList, isPlaying, setIsPlaying } = useContext(PlayerContext)

  function handlePrevSong() {
    const order = currentList?.docs.findIndex(doc => doc.id === currentTrack?.id)
    if (order === 0)
      setCurrentTrack(currentList?.docs[currentList?.size - 1])
    else
      setCurrentTrack(currentList?.docs[order! - 1])

    if (!isPlaying)
      setIsPlaying(true)
  }

  function handleNextSong() {
    const order = currentList?.docs.findIndex(doc => doc.id === currentTrack?.id)
    if (order === currentList?.size! - 1)
      setCurrentTrack(currentList?.docs[0])
    else
      setCurrentTrack(currentList?.docs[order! + 1])

    if (!isPlaying)
      setIsPlaying(true)
  }

  function toggleShuffle() {
    if (isShuffleEnable) {
      localStorage.setItem("isShuffleEnable", "false")
      setIsShuffleEnable(false)
    } else {
      localStorage.setItem("isShuffleEnable", "true")
      setIsShuffleEnable(true)
    }
  }

  function toggleLoop() {
    if (isLoopEnable) {
      localStorage.setItem("isLoopEnable", "false")
      setIsLoopEnable(false)
    } else {
      localStorage.setItem("isLoopEnable", "true")
      setIsLoopEnable(true)
    }
  }

  return (
    <div className="flex items-center justify-center space-x-4">
      {currentTrack
        ? <button
          onClick={toggleShuffle}
          className={`cursor-default relative ${isShuffleEnable ? "text-green-500 set_active" : "hover:text-white"}`}>
          <ArrowsRightLeftIcon className="w-5 h-5" />
        </button>
        : <div>
          <ArrowsRightLeftIcon className="w-5 h-5 text-[rgb(40,40,40)]" />
        </div>}
      {currentTrack
        ? <button
          onClick={handlePrevSong} className="hover:text-white cursor-default disabled:text-[rgb(40,40,40)] disabled:cursor-not-allowed"
          disabled={currentList === undefined}>
          <ChevronDoubleLeftIcon className="w-5 h-5" />
        </button>
        : <div>
          <ChevronDoubleLeftIcon className="w-5 h-5 text-[rgb(40,40,40)]" />
        </div>}
      {!currentTrack && <div className="flex w-8 h-8 p-1 bg-[rgb(40,40,40)] rounded-full items-center justify-center">
        <PauseIcon className="text-black h-5 w-5" />
      </div>}
      {isPlaying
        ? currentTrack && <button
          onClick={() => setIsPlaying(false)}
          className="flex w-8 h-8 p-1 bg-white rounded-full items-center justify-center hover:scale-105 cursor-default">
          <PauseIcon className="text-black h-5 w-5" />
        </button>
        : currentTrack && <button
          onClick={() => setIsPlaying(true)}
          className="flex w-8 h-8 p-1 bg-white rounded-full items-center justify-center hover:scale-105 cursor-default">
          <PlayIcon className="text-black h-5 w-5" />
        </button>}
      {currentTrack
        ? <button
          onClick={handleNextSong} className="hover:text-white cursor-default disabled:text-[rgb(40,40,40)] disabled:cursor-not-allowed"
          disabled={currentList === undefined}>
          <ChevronDoubleRightIcon className="w-5 h-5" />
        </button>
        : <div>
          <ChevronDoubleRightIcon className="w-5 h-5 text-[rgb(40,40,40)]" />
        </div>}
      {currentTrack
        ? <button
          onClick={toggleLoop}
          className={`cursor-default relative ${isLoopEnable ? "text-green-500 set_active" : "hover:text-white"}`}>
          <ArrowPathRoundedSquareIcon className="w-5 h-5" />
        </button>
        : <div>
          <ArrowPathRoundedSquareIcon className="w-5 h-5 text-[rgb(40,40,40)]" />
        </div>}
    </div>
  )
}
