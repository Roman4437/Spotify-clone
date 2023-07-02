import { ClockIcon } from "@heroicons/react/24/solid"

export default function SongHeader() {
  return (
    <div className="flex justify-between items-center border-b border-white/20 mx-6 py-2 px-4">
      <div className="flex space-x-4">
        <span>#</span>
        <span>Title</span>
      </div>
      <div>
        <ClockIcon className="h-5" />
      </div>
    </div>
  )
}
