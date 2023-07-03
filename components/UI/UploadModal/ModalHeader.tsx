import { XMarkIcon } from "@heroicons/react/24/solid"

interface ModalHeaderProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ModalHeader({ setIsModalOpen }: ModalHeaderProps) {
  return (
    <div className="z-10 flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">
        Upload a Song
      </h1>
      <button onClick={() => setIsModalOpen(false)}>
        <XMarkIcon className="h-4 text-neutral-400" />
      </button>
    </div>
  )
}
