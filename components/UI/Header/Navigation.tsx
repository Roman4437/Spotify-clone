import { HistoryContext } from "@/components/Providers/HistoryProvider/HistoryProvider"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/navigation"
import { useContext, useLayoutEffect, useState } from "react"

export default function Navigation() {
  const [currentPage, setCurrentPage] = useState(0)
  const { value } = useContext(HistoryContext)
  const router = useRouter()

  useLayoutEffect(() => {
    setCurrentPage(value.length - 1)
  }, [value])

  function goBackward() {
    setCurrentPage(p => p - 1)
    router.push(value[currentPage - 1])
  }

  function goForward() {
    setCurrentPage(p => p + 1)
    router.push(value[currentPage + 1])
  }

  return (
    <>
      <button
        className="flex bg-black/60 rounded-full h-8 w-8 items-center justify-center disabled:cursor-not-allowed disabled:opacity-75"
        disabled={currentPage === 0}
        onClick={goBackward}>
        <ChevronLeftIcon className="h-6" />
      </button>
      <button
        className="flex bg-black/60 rounded-full h-8 w-8 items-center justify-center disabled:cursor-not-allowed disabled:opacity-75"
        disabled={currentPage === value.length - 1}
        onClick={goForward}>
        <ChevronRightIcon className="h-6" />
      </button>
    </>
  )
}
