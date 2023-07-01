import { useState } from "react"

export default function useUpload() {
  const [cover, setCover] = useState<File>()
  const [audio, setAudio] = useState<File>()
  const [image, setImage] = useState<string>()
  const [duration, setDuration] = useState<number>()

  function handleCoverSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedImage = event.target.files?.[0]
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(selectedImage)
      setCover(selectedImage)
    }
  }

  function handleAudioSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedAudio = event.target.files?.[0]
    if (selectedAudio) {
      const audio = new Audio()
      audio.src = URL.createObjectURL(selectedAudio)
      audio.addEventListener('loadedmetadata', () => {
        const durationInSeconds = audio.duration
        setDuration(durationInSeconds)
      })
      setAudio(selectedAudio)
    }
  }

  function reset() {
    setAudio(undefined)
    setCover(undefined)
    setImage(undefined)
  }

  return { image, audio, cover, duration, handleCoverSelect, handleAudioSelect, reset }
}
