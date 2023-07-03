import { useEffect, useState } from "react"

export default function usePlayerControls() {
  const [isShuffleEnable, setIsShuffleEnable] = useState(false)
  const [isLoopEnable, setIsLoopEnable] = useState(false)

  useEffect(() => {
    const shuffle = localStorage.getItem("isShuffleEnable")
    const loop = localStorage.getItem("isLoopEnable")

    setIsShuffleEnable(shuffle && shuffle !== "undefined" ? JSON.parse(shuffle) : false)
    setIsLoopEnable(loop && loop !== "undefined" ? JSON.parse(loop) : false)
  }, [])

  return {
    controls: {
      isShuffleEnable,
      setIsShuffleEnable,
      isLoopEnable,
      setIsLoopEnable,
    }
  }
}
