import { MusicalNoteIcon } from "@heroicons/react/24/solid"
import { useRef } from "react"

interface AudioInputProps {
  audio: File,
  handleAudioSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  AudioRef: React.RefObject<HTMLInputElement>
}

export default function AudioInput({ audio, handleAudioSelect, AudioRef }: AudioInputProps) {
  return (
    <div className="flex bg-[#302944]/60 rounded-sm items-center justify-between h-20 px-4 space-x-4">
      <div className="flex truncate h-full items-center">
        <span className="truncate">{audio ? audio.name : "Audio"}</span>
      </div>
      <button
        className="p-2 rounded-full text-white bg-green-500 hover:bg-green-400 transition-colors ease-in-out"
        onClick={() => AudioRef.current?.click()}
        type="button">
        <MusicalNoteIcon className="w-5" />
      </button>
      <input
        ref={AudioRef}
        className="hidden"
        type="file"
        accept="audio/*"
        onChange={handleAudioSelect} />
    </div>
  )
}
