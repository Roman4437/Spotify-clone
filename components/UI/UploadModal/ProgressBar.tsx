import { ArrowUpTrayIcon } from "@heroicons/react/24/solid"
import { RefObject } from "react"

interface ProgressBarProps {
  mandatoryFields: number,
  buttonRef: RefObject<HTMLButtonElement>,
  artist: string,
  song: string,
  audio: File,
  cover: File
}

export default function ProgressBar({ mandatoryFields, artist, audio, cover, song, buttonRef }: ProgressBarProps) {
  return (
    <div className="flex bg-[#302944]/60 rounded-sm items-center h-20 px-4 space-x-4">
      <span>{mandatoryFields}/4</span>
      <div className="relative flex-1 bg-white h-1 rounded-full">
        <div
          className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
          style={{ width: `${mandatoryFields * 25}% ` }} />
      </div>
      <button
        className="flex space-x-3 rounded-sm p-2 text-white bg-green-500 hover:bg-green-400 transition-colors ease-in-out disabled:cursor-not-allowed disabled:bg-gray-400"
        disabled={artist === "" || song === "" || !audio || !cover}
        ref={buttonRef}
        type="submit">
        <span>Upload</span>
        <ArrowUpTrayIcon className="w-6" />
      </button>
    </div>
  )
}
