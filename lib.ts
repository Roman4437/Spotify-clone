import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

export function headToURL(URL: string, CurrentURL: string, setValue: React.Dispatch<React.SetStateAction<string[]>>, router: AppRouterInstance) {
  if (CurrentURL === URL)
    return
  setValue(p => {
    if (p[p.length - 1] !== URL)
      return [...p, URL]
    else
      return [...p]
  })
  router.push(URL)
}

export function formatTime(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  if (isNaN(minutes) || isNaN(seconds))
    return "00:00"

  return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds
}

export function formatDuration(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${minutes > 0 ? minutes + " min" : ""} ${seconds} sec`
}

export function getGreeting() {
  const currentDate = new Date()
  const currentHour = currentDate.getHours()

  if (currentHour >= 5 && currentHour < 12)
    return "Good morning"
  else if (currentHour >= 12 && currentHour < 18)
    return "Good afternoon"
  else
    return "Good evening"
}