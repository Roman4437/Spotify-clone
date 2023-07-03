import { useEffect, useRef, useState } from "react"

export default function usePlayerVolume(initialVolume: number) {
  const [audioVolume, setAudioVolume] = useState(initialVolume)

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const volume = localStorage.getItem("volume")

    setAudioVolume(volume && volume !== "undefined" ? JSON.parse(volume) * 100 : 0)
  }, [])

  useEffect(() => {
    const volume = audioVolume / 100
    audioRef.current!.volume = volume
    localStorage.setItem("volume", JSON.stringify(volume))
  }, [audioVolume])

  return { audioRef, audioVolume, setAudioVolume }
}
