import { db } from "@/firebase"
import useHistory from "@/hooks/useHistory"
import { MusicalNoteIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { deleteDoc, doc } from "firebase/firestore"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { usePathname } from "next/navigation"

interface PlaylistSongsPageHeaderProps {
  size: number
}

export default function PlaylistSongsPageHeader({ size }: PlaylistSongsPageHeaderProps) {
  const { push } = useHistory()
  const { data } = useSession()
  const pathname = usePathname()

  function deletePlaylist() {
    deleteDoc(doc(db, "users", data?.user?.email!, "playlists", pathname.split('/').pop()?.replace("%20", " ")!))
    push("/")
  }

  return (
    <div className="flex space-x-6 h-36 md:h-60 mb-6">
      <div className="group flex relative justify-center items-center h-full bg-blue-300 aspect-square object-cover drop-shadow-2xl" >
        <MusicalNoteIcon className="h-32" />
        <button
          onClick={deletePlaylist}
          className="hidden group-hover:block absolute top-2 right-2 p-1 bg-blue-950/40 rounded-full hover:bg-blue-950/30">
          <XMarkIcon className="h-3" />
        </button>
      </div>
      <div className="flex flex-col justify-end space-y-6 overflow-hidden">
        <span className="text-sm">Playlist</span>
        <h1 className="text-3xl md:text-7xl md:pb-4 font-extrabold drop-shadow-2xl line-clamp-1">
          {pathname.split('/').pop()?.replace("%20", " ")}
        </h1>
        <div className="flex space-x-2 items-center">
          <Image
            width={24}
            height={24}
            className="rounded-full"
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
