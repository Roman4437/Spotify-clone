'use client'

import { useContext, useEffect, useRef, useState } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useSession } from "next-auth/react"
import usePlayerControls from "@/hooks/usePlayerControls"
import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"

import VolumeProgressBar from "./VolumeProgressBar/VolumeProgressBar"
import PlayerProgressBar from "./PlayerProgressBar/PlayerProgressBar"
import SongMetadata from "./SongMetadata/SongMetadata"

export default function Footer() {
  const { currentTrack, setCurrentTrack, isPlaying, setIsPlaying, currentList } = useContext(PlayerContext)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioVolume, setAudioVolume] = useState(30)
  const { data } = useSession()
  const { controls } = usePlayerControls()
  const { isShuffleEnable, setIsShuffleEnable, isLoopEnable, setIsLoopEnable } = controls

  const audioRef = useRef<HTMLAudioElement>(null)
  const shuffledList = useRef<number[]>([])

  useEffect(() => {
    const savedTime = localStorage.getItem("currentTime")
    const volume = localStorage.getItem("volume")
    const shuffle = localStorage.getItem("isShuffleEnable")
    const loop = localStorage.getItem("isLoopEnable")

    setAudioVolume(volume && volume !== "undefined" ? JSON.parse(volume) * 100 : 0)
    setCurrentTime(savedTime && savedTime !== "undefined" ? JSON.parse(savedTime) : 0)
    setIsShuffleEnable(shuffle && shuffle !== "undefined" ? JSON.parse(shuffle) : false)
    setIsLoopEnable(loop && loop !== "undefined" ? JSON.parse(loop) : false)
  }, [])

  useEffect(() => {
    async function getRecentlyPlayed() {
      const document = await getDoc(doc(db, "users", data?.user?.email!))
      const recentlyPlayed: Song[] = document.data()?.recentlyPlayed ?? []

      if (recentlyPlayed.length > 7) {
        recentlyPlayed.shift()
      }

      if (!recentlyPlayed.find(s => s.path.audio === currentTrack?.data().path.audio))
        recentlyPlayed.push({ ...currentTrack?.data(), id: currentTrack?.id })

      setDoc(
        doc(db, "users", data?.user?.email!), {
        recentlyPlayed: recentlyPlayed
      }, {
        merge: true
      })
    }

    if (currentTrack) {
      localStorage.setItem("currentTrack", JSON.stringify(currentTrack?.id))
      getRecentlyPlayed()
    }
  }, [currentTrack])

  useEffect(() => {
    if (currentList) {
      shuffleList()
    }
  }, [currentList])

  useEffect(() => {
    function saveCurrentTime() {
      localStorage.setItem("currentTime", JSON.stringify(currentTime))
    }
    window.addEventListener("beforeunload", saveCurrentTime)
    return () =>
      window.removeEventListener("beforeunload", saveCurrentTime)
  }, [currentTime])

  useEffect(() => {
    const volume = audioVolume / 100
    audioRef.current!.volume = volume
    localStorage.setItem("volume", JSON.stringify(volume))
  }, [audioVolume])

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
      if (shuffledList.current.length === 0)
        shuffleList()

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

  function shuffleList() {
    if (currentList) {
      const list = Array.from({ length: currentList.size }, (_, i) => i)
      const index = currentList.docs.findIndex(doc => doc.id === currentTrack?.id)
      list.splice(index, 1)

      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]]
      }

      shuffledList.current = list
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
