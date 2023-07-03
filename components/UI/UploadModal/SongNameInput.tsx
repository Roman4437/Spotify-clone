interface SongNameInputProps {
  song: string
  setSong: React.Dispatch<React.SetStateAction<string>>
}

export default function SongNameInput({ song, setSong }: SongNameInputProps) {
  return (
    <div className="flex bg-[#302944]/60 rounded-sm items-center h-20 px-4 space-x-4">
      <span className="truncate">Song Name</span>
      <div className="flex flex-1 p-3 items-center rounded-md bg-[#ffffff12]">
        <input
          className="bg-transparent w-full ml-2 outline-none text-xs font-bold"
          placeholder="E.g. Bury the Light"
          onChange={e => setSong(e.target.value)}
          value={song}
          type="text" />
      </div>
    </div>
  )
}
