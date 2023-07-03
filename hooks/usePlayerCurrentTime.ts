import { useEffect, useState } from "react"

export default function usePlayerCurrentTime() {
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const savedTime = localStorage.getItem("currentTime")
    setCurrentTime(savedTime && savedTime !== "undefined" ? JSON.parse(savedTime) : 0)
  }, [])

  useEffect(() => {
    function saveCurrentTime() {
      localStorage.setItem("currentTime", JSON.stringify(currentTime))
    }
    window.addEventListener("beforeunload", saveCurrentTime)
    return () =>
      window.removeEventListener("beforeunload", saveCurrentTime)
  }, [currentTime])

  return { currentTime, setCurrentTime }
}
