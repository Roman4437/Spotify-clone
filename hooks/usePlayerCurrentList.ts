import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { useContext, useEffect, useRef } from "react"

export default function usePlayerCurrentList() {
  const { currentTrack, currentList } = useContext(PlayerContext)

  const shuffledList = useRef<number[]>([])

  useEffect(() => {
    if (shuffledList.current.length === 0) {
      shuffleList()
    }
  }, [currentTrack])

  useEffect(() => {
    if (currentList !== undefined) {
      const path = JSON.stringify(currentList.docs[0].ref.parent.path)
      localStorage.setItem("currentList", path)
    }

    if (currentList) {
      shuffleList()
    }
  }, [currentList])

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

  return { currentList, shuffledList }
}
