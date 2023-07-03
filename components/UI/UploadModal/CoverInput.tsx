import { PaperClipIcon } from "@heroicons/react/24/solid"

interface CoverInputProps {
  image: string,
  handleCoverSelect: (event: React.ChangeEvent<HTMLInputElement>) => void,
  CoverRef: React.RefObject<HTMLInputElement>
}

export default function CoverInput({ image, handleCoverSelect, CoverRef }: CoverInputProps) {
  return (
    <div className="flex bg-[#302944]/60 rounded-sm items-center justify-between h-20 pr-4 space-x-4">
      <div className="flex truncate h-full items-center">
        {image
          ? <img className="h-full rounded-l-sm aspect-square object-cover" src={image} alt="cover" />
          : <span className="pl-4">Cover</span>}
      </div>
      <button
        className="p-2 rounded-full text-white bg-green-500 hover:bg-green-400 transition-colors ease-in-out"
        onClick={() => CoverRef.current?.click()}
        type="button">
        <PaperClipIcon className="w-5" />
      </button>
      <input
        ref={CoverRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleCoverSelect} />
    </div>
  )
}
