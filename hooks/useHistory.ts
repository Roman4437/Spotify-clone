import { HistoryContext } from "@/components/Providers/HistoryProvider/HistoryProvider"
import { headToURL } from "@/lib"
import { usePathname, useRouter } from "next/navigation"
import { useContext } from "react"

export default function useHistory() {
  const { setValue } = useContext(HistoryContext)
  const pathname = usePathname()
  const router = useRouter()

  function push(URL: string) {
    headToURL(URL, pathname, setValue, router)
  }

  return { push }
}
