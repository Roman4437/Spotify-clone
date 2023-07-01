import { useState } from "react"

export default function usePlayerControls() {
  const [isShuffleEnable, setIsShuffleEnable] = useState(false)
  const [isLoopEnable, setIsLoopEnable] = useState(false)

  return {
    controls: {
      isShuffleEnable,
      setIsShuffleEnable,
      isLoopEnable,
      setIsLoopEnable,
    }
  }
}
