'use client'

import { usePathname } from "next/navigation"
import { createContext, useState } from "react"

interface HistoryProviderProps {
  children: React.ReactNode
}

interface HistoryContext {
  value: string[]
  setValue: React.Dispatch<React.SetStateAction<string[]>>
}

const defaultValue = {
  value: [],
  setValue: () => { }
}

const HistoryContext = createContext<HistoryContext>(defaultValue)

function HistoryProvider({ children }: HistoryProviderProps) {
  const pathname = usePathname()
  const [value, setValue] = useState<string[]>([pathname])
  return (
    <HistoryContext.Provider value={{ value, setValue }}>
      {children}
    </HistoryContext.Provider>
  )
}

export { HistoryContext, HistoryProvider }
