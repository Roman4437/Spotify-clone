import { useSession } from "next-auth/react"
import Image from "next/image"

interface LikedSongsPageHeaderProps {
  size: number
}

export default function LikedSongPageHeader({ size }: LikedSongsPageHeaderProps) {
  const { data } = useSession()

  return (
    <div className="flex space-x-6 h-36 md:h-60 mb-6">
      <img
        src="/liked-songs-640.png"
        className="h-full aspect-square object-cover drop-shadow-2xl"
        alt="cover" />
      <div className="flex flex-col justify-end space-y-6 overflow-hidden">
        <span className="text-sm">Playlist</span>
        <h1 className="text-3xl md:text-7xl md:pb-4 font-extrabold drop-shadow-2xl line-clamp-1">Liked songs</h1>
        <div className="flex space-x-2 items-center">
          <Image
            width={24}
            height={24}
            className="h-6 rounded-full"
            src={data?.user?.image!}
            alt="pfp" />
          <h2 className="text-xs md:text-base md:font-bold">{data?.user?.name}</h2>
          <div>&bull;</div>
          <span>{size} songs</span>
        </div>
      </div>
    </div>
  )
}
