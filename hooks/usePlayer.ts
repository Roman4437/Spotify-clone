import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { useContext, useEffect } from "react"
import usePlayerVolume from "./usePlayerVolume"
import usePlayerCurrentTrack from "./usePlayerCurrentTrack"
import usePlayerCurrentList from "./usePlayerCurrentList"
import usePlayerCurrentTime from "./usePlayerCurrentTime"
import usePlayerControls from "./usePlayerControls"

export default function usePlayer() {
  const { isPlaying, setIsPlaying } = useContext(PlayerContext)
  const { audioRef, audioVolume, setAudioVolume } = usePlayerVolume(30)
  const { currentTrack, setCurrentTrack } = usePlayerCurrentTrack()
  const { currentList, shuffledList } = usePlayerCurrentList()
  const { currentTime, setCurrentTime } = usePlayerCurrentTime()
  const { controls } = usePlayerControls()
  const { isShuffleEnable, isLoopEnable } = controls

  useEffect(() => {
    if (isPlaying)
      audioRef.current?.play()
    else
      audioRef.current?.pause()

  }, [isPlaying])

  function handleEnded() {
    setIsPlaying(false)
    setCurrentTime(0)

    if (currentList && isShuffleEnable && currentList.size > 1) {
      const random = shuffledList.current.pop()
      setCurrentTrack(currentList?.docs[random!])
      setIsPlaying(true)
    }

    if (currentList && !isShuffleEnable && currentList.size > 1) {
      const order = currentList?.docs.findIndex(doc => doc.id === currentTrack?.id)
      if (order === currentList?.size! - 1)
        setCurrentTrack(currentList?.docs[0])
      else
        setCurrentTrack(currentList?.docs[order! + 1])

      setIsPlaying(true)
    }
  }

  function handleLoadedMetadata() {
    audioRef.current!.currentTime = currentTime

    if (isPlaying)
      audioRef.current?.play()
  }

  function handleTimeUpdate() {
    setCurrentTime(p => {
      if (Math.floor(audioRef.current!.currentTime) !== Math.floor(p!))
        return audioRef.current!.currentTime
      else
        return p
    })
  }

  function jumpToOffset(time: number) {
    audioRef.current!.currentTime = time
  }

  return {
    audioRef,
    controls,
    isLoopEnable,
    audioVolume,
    setAudioVolume,
    curretState: {
      currentTrack,
      currentTime
    },
    methods: {
      handleEnded,
      handleLoadedMetadata,
      handleTimeUpdate,
      jumpToOffset
    }
  }
}
