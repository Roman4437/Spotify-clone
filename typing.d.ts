interface Song {
  id?: string,
  duration: number,
  metadata: Metadata,
  path: Path,
  uploadedAt: Time,
  uploadedBy: string
}

interface Metadata {
  artistName: string,
  songName: string
}

interface Path {
  audio: string,
  cover: string
}

interface Time {
  nanoseconds: number,
  seconds: number
}
