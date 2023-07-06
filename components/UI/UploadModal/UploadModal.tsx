import { FormEvent, useEffect, useRef, useState } from "react"

import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import useUpload from "@/hooks/useUpload"
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore"
import { db, storage } from "@/firebase"

import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import SongNameInput from "./SongNameInput"
import ArtistNameInput from "./ArtistNameInput"
import CoverInput from "./CoverInput"
import AudioInput from "./AudioInput"
import ProgressBar from "./ProgressBar"
import ModalHeader from "./ModalHeader"

interface UploadModal {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function UploadModal({ setIsModalOpen }: UploadModal) {
  const { image, audio, cover, duration, handleAudioSelect, handleCoverSelect, reset } = useUpload()
  const [artist, setArtist] = useState("")
  const [song, setSong] = useState("")
  const { data } = useSession()
  const [mandatoryFields, setMandatoryFields] = useState(0)

  const coverInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMandatoryFields([audio, cover, artist, song].filter(i => i !== undefined && i !== "").length)
  }, [audio, cover, artist, song])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    buttonRef.current!.disabled = true
    const notification = toast.loading("Uploading...")

    const baseName = crypto.randomUUID()
    const coverExtension = `${cover?.name.split(".").pop()}`
    const audioExtension = `${audio?.name.split(".").pop()}`
    const coverName = `${artist} - ${song} [${baseName}].${coverExtension}`
    const audioName = `${artist} - ${song} [${baseName}].${audioExtension}`

    try {
      const coverRef = ref(storage, `cover/${coverName}`)
      const audioRef = ref(storage, `audio/${audioName}`)

      await uploadBytes(coverRef, cover!)
      await uploadBytes(audioRef, audio!)

      const body = {
        metadata: {
          songName: song,
          artistName: artist
        },
        path: {
          audio: await getDownloadURL(audioRef),
          cover: await getDownloadURL(coverRef)
        },
        uploadedBy: data?.user?.email,
        uploadedAt: serverTimestamp(),
        duration: duration
      }

      const id = await addDoc(collection(db, "songs"), body)

      setDoc(doc(db, "users", data?.user?.email!, "uploadedSongs", id.id), body)

      setArtist("")
      setSong("")
      reset()

      audioInputRef.current!.value = ""
      coverInputRef.current!.value = ""

      toast.success("Successfully uploaded!", { id: notification })
      setIsModalOpen(false)

    } catch (error) {
      console.error(error)
      toast.error("Something went wrong!", { id: notification })
    }
  }

  function toggleModal(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === modalRef.current)
      setIsModalOpen(false)
  }

  return (
    <div
      onClick={toggleModal}
      ref={modalRef}
      className="absolute flex z-50 inset-0 justify-center items-center bg-black/80">
      <div className="relative flex flex-col w-full md:w-[420px] ">
        <div className="absolute inset-0 h-48 bg-gradient-to-b from-blue-950 to-[#121214]" />
        <div className="flex flex-col py-4 px-6 bg-[#121214]">
          <ModalHeader setIsModalOpen={setIsModalOpen} />
          <form
            className="grid z-10 grid-cols-1 gap-6 pb-4 text-[#b3b3b3]"
            onSubmit={handleSubmit}>
            <SongNameInput
              song={song}
              setSong={setSong} />
            <ArtistNameInput
              artist={artist}
              setArtist={setArtist} />
            <CoverInput
              image={image!}
              handleCoverSelect={handleCoverSelect}
              CoverRef={coverInputRef} />
            <AudioInput
              audio={audio!}
              handleAudioSelect={handleAudioSelect}
              AudioRef={audioInputRef} />
            <ProgressBar
              mandatoryFields={mandatoryFields}
              buttonRef={buttonRef}
              artist={artist}
              song={song}
              audio={audio!}
              cover={cover!} />
          </form>
        </div>
      </div>
    </div>
  )
}
