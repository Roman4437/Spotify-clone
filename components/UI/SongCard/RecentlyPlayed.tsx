import useHistory from "@/hooks/useHistory"

interface RecentlyPlayedProps {
  song: Song
}

export default function RecentlyPlayed({ song }: RecentlyPlayedProps) {
  const { push } = useHistory()

  return (
    <div
      onClick={() => push(`/song/${song.id}`)}
      className="flex group flex-col rounded-md bg-[#171717] p-4 cursor-pointer">
      <img src={song.path.cover} className="w-full aspect-square self-center rounded-md" alt={song.metadata.songName} />
      <span className="mt-2 truncate">{song.metadata.songName}</span>
      <span className="text-sm text-[#b3b3b3] truncate">{song.metadata.artistName}</span>
    </div>
  )
}
