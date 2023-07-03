import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore"
import SidebarSongRowLoading from "./SidebarSongRowLoading"
import SidebarSongRow from "./SidebarSongRow"

interface SidebarSongsPanelProps {
  songs: QuerySnapshot<DocumentData>,
  filter: string
}

export default function SidebarSongsPanel({ songs, filter }: SidebarSongsPanelProps) {
  function withArtist(song: QueryDocumentSnapshot<DocumentData>) {
    return song?.data().metadata.artistName.toLowerCase().includes(filter.toLowerCase())
  }

  function withSong(artist: QueryDocumentSnapshot<DocumentData>) {
    return artist.data().metadata.songName.toLowerCase().includes(filter.toLowerCase())
  }

  const filteredSongs = songs?.docs.filter(song => withSong(song) || withArtist(song))

  return (
    <>
      {songs
        ? filteredSongs.map(song => <SidebarSongRow key={song.id} song={song} />)
        : <>
          {Array.from({ length: 20 }, () => <SidebarSongRowLoading key={crypto.randomUUID()} />)}
        </>}
    </>
  )
}
