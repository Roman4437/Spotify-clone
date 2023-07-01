'use client'

import { db } from "@/firebase"
import { DocumentData, QuerySnapshot, collection, doc, getDoc, getDocs } from "firebase/firestore"
import { createContext, useEffect, useState } from "react"

interface PlayerProviderProps {
  children: React.ReactNode
}

interface PlayerContext {
  loading: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  currentTrack: DocumentData | undefined,
  setCurrentTrack: React.Dispatch<React.SetStateAction<DocumentData | undefined>>,
  currentList: QuerySnapshot<DocumentData> | undefined,
  setCurrentList: React.Dispatch<React.SetStateAction<QuerySnapshot<DocumentData> | undefined>>,
  isPlaying: boolean,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultValue = {
  loading: true,
  setLoading: () => { },
  currentTrack: undefined,
  setCurrentTrack: () => { },
  currentList: undefined,
  setCurrentList: () => { },
  isPlaying: false,
  setIsPlaying: () => { }
}

const PlayerContext = createContext<PlayerContext>(defaultValue)

function PlayerProvider({ children }: PlayerProviderProps) {
  const [currentTrack, setCurrentTrack] = useState<DocumentData | undefined>(undefined)
  const [currentList, setCurrentList] = useState<QuerySnapshot<DocumentData> | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getLastPlayed() {
      const lastPlayed = localStorage.getItem("currentTrack")
      const lastList = localStorage.getItem("currentList")

      if (lastPlayed) {
        const currentTrackRef = doc(db, "songs", JSON.parse(lastPlayed))
        const currentTrack = await getDoc(currentTrackRef)
        setCurrentTrack(currentTrack)
      }

      if (lastList !== 'undefined') {
        const currentListkRef = collection(db, JSON.parse(lastList!))
        const currentList = await getDocs(currentListkRef)
        setCurrentList(currentList)
      }
    }

    getLastPlayed()
  }, [])

  return (
    <PlayerContext.Provider value={{ loading, setLoading, currentTrack, setCurrentTrack, currentList, setCurrentList, isPlaying, setIsPlaying }}>
      {children}
    </PlayerContext.Provider>
  )
}

export { PlayerContext, PlayerProvider }
