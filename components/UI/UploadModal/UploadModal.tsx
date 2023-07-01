import { FormEvent, useEffect, useRef, useState } from "react"

import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import useUpload from "@/hooks/useUpload"
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore"
import { db, storage } from "@/firebase"

import { ArrowUpTrayIcon, PaperClipIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { MusicalNoteIcon } from "@heroicons/react/24/outline"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

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
    const coverName = `${artist} - ${song} [${baseName}].${cover?.name.split(".").pop()}`
    const audioName = `${artist} - ${song} [${baseName}].${audio?.name.split(".").pop()}`

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
          audio: await getDownloadURL(ref(storage, `audio/${audioName}`)),
          cover: await getDownloadURL(ref(storage, `cover/${coverName}`))
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
          <div className="z-10 flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              Upload a Song
            </h1>
            <button onClick={() => setIsModalOpen(false)}>
              <XMarkIcon className="h-4 text-neutral-400" />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid z-10 grid-cols-1 gap-6 pb-4 text-[#b3b3b3]">
            {true
              ? <div className="flex bg-[#302944]/60 rounded-sm items-center h-20 px-4 space-x-4">
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
              : <div className="flex h-20 bg-[rgb(40,40,40)] px-4 items-center justify-end" >
                <div className="h-6 w-full md:w-4/5 rounded-full bg-neutral-500" />
              </div>}
            {true
              ? <div className="flex bg-[#302944]/60 rounded-sm items-center h-20 px-4 space-x-4">
                <span className="truncate">Artist Name</span>
                <div className="flex flex-1 p-3 items-center rounded-md bg-[#ffffff12]">
                  <input
                    className="bg-transparent w-full ml-2 outline-none text-xs font-bold"
                    placeholder="E.g. Caesy Edward"
                    onChange={e => setArtist(e.target.value)}
                    value={artist}
                    type="text" />
                </div>
              </div>
              : <div className="flex h-20 bg-[rgb(40,40,40)] px-4 items-center justify-end" >
                <div className="h-6 w-full rounded-full bg-neutral-500" />
              </div>}
            {true
              ? <div className="flex bg-[#302944]/60 rounded-sm items-center justify-between h-20 pr-4 space-x-4">
                <div className="flex truncate h-full items-center">
                  {image
                    ? <img className="h-full rounded-l-sm aspect-square object-cover" src={image} alt="cover" />
                    : <span className="pl-4">Cover</span>}
                </div>
                <button
                  className="p-2 rounded-full text-white bg-green-500 hover:bg-green-400 transition-colors ease-in-out"
                  onClick={() => coverInputRef.current?.click()}
                  type="button">
                  <PaperClipIcon className="w-5" />
                </button>
                <input
                  ref={coverInputRef}
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverSelect} />
              </div>
              : <div className="flex h-20 bg-[rgb(40,40,40)] px-4 items-center justify-end" >
                <div className="h-6 w-full md:w-4/5 rounded-full bg-neutral-500" />
              </div>}
            {true
              ? <div className="flex bg-[#302944]/60 rounded-sm items-center justify-between h-20 px-4 space-x-4">
                <div className="flex truncate h-full items-center">
                  <span className="truncate">{audio ? audio.name : "Audio"}</span>
                </div>
                <button
                  className="p-2 rounded-full text-white bg-green-500 hover:bg-green-400 transition-colors ease-in-out"
                  onClick={() => audioInputRef.current?.click()}
                  type="button">
                  <MusicalNoteIcon className="w-5" />
                </button>
                <input
                  ref={audioInputRef}
                  className="hidden"
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioSelect} />
              </div>
              : <div className="flex h-20 bg-[rgb(40,40,40)] px-4 items-center justify-end" >
                <div className="h-6 w-full md:w-full rounded-full bg-neutral-500" />
              </div>}
            {true
              ? <div className="flex bg-[#302944]/60 rounded-sm items-center h-20 px-4 space-x-4">
                <span>{mandatoryFields}/4</span>
                <div className="relative flex-1 bg-white h-1 rounded-full">
                  <div
                    className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                    style={{ width: `${mandatoryFields * 25} % ` }} />
                </div>
                <button
                  className="flex space-x-3 rounded-sm p-2 text-white bg-green-500 hover:bg-green-400 transition-colors ease-in-out disabled:cursor-not-allowed disabled:bg-gray-400"
                  disabled={artist === "" || song === "" || !audio || !cover}
                  ref={buttonRef}
                  type="submit">
                  <span>Upload</span>
                  <ArrowUpTrayIcon className="w-6" />
                </button>
              </div>
              : <div className="flex h-20 bg-[rgb(40,40,40)] px-4 items-center justify-end" >
                <div className="h-6 w-full rounded-full bg-neutral-500" />
              </div>}
          </form>
        </div>
      </div>
    </div>
  )
}
