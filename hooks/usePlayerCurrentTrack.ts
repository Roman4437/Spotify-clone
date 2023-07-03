import { PlayerContext } from "@/components/Providers/PlayerProvider/PlayerProvider"
import { db } from "@/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { useContext, useEffect } from "react"

export default function usePlayerCurrentTrack() {
  const { currentTrack, setCurrentTrack } = useContext(PlayerContext)
  const { data } = useSession()

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

  return { currentTrack, setCurrentTrack }
}
