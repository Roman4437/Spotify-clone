import { formatDuration } from "@/lib";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";

interface SongPageHeaderProps {
  song: DocumentSnapshot<DocumentData>
}

export default function SongPageHeader({ song }: SongPageHeaderProps) {
  return (
    <div className="flex space-x-6 h-36 md:h-60 mb-6">
      <img src={song!.data()!.path.cover} className="h-full aspect-square object-cover drop-shadow-2xl" alt="cover" />
      <div className="flex flex-col justify-end space-y-6 overflow-hidden">
        <span className="text-sm">Single</span>
        <h1 className="text-3xl md:text-7xl md:pb-4 font-extrabold truncate drop-shadow-2xl select-text">
          {song!.data()!.metadata.songName}
        </h1>
        <div className="flex space-x-2 items-center">
          <h2 className="text-xs md:text-base select-text">
            {song!.data()!.metadata.artistName}
          </h2>
          <div>&bull;</div>
          <span className="text-xs md:text-base">
            {new Intl.DateTimeFormat("en", { year: "numeric" }).format(song!.data()!.uploadedAt.miliseconds)}
          </span>
          <div>&bull;</div>
          <span className="text-xs md:text-base opacity-60">
            {formatDuration(song!.data()!.duration)}
          </span>
        </div>
      </div>
    </div>
  )
}
