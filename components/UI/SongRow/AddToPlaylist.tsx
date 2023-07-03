import { DocumentData, DocumentReference, QuerySnapshot, doc, setDoc } from "firebase/firestore"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

interface AddToPlaylistProps {
  song: DocumentData,
  playlists: QuerySnapshot<DocumentData>
  isSelectOpen: boolean,
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AddToPlaylist({ song, playlists, isSelectOpen, setIsSelectOpen }: AddToPlaylistProps) {
  const pathname = usePathname()

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (divRef.current && !divRef.current.contains(event.target as Node))
        setIsSelectOpen(false)
    }
    document.addEventListener('click', handleClickOutside)

    return () =>
      document.removeEventListener('click', handleClickOutside)
  }, [isSelectOpen])

  function addToPlaylist(ref: DocumentReference<DocumentData>) {
    setDoc(
      doc(ref, "songs", song.id), {
      ...song.data()
    })
    setIsSelectOpen(false)
  }

  return (
    <>
      {pathname.includes("song") && <div className="hidden group-hover:block relative text-lg">
        <button onClick={() => setIsSelectOpen(p => !p)}>
          &#8942;
        </button>
        {isSelectOpen && <div ref={divRef} className="absolute flex flex-col items-start p-1 space-y-1 -right-9 bg-[#383838]">
          {playlists?.docs.map(list => <button
            key={list.id}
            onClick={() => addToPlaylist(list.ref)}
            className="truncate text-sm">+ {list.id.replace("%20", " ")}</button>)}
        </div>}
      </div>}
    </>
  )
}
