import useHistory from "@/hooks/useHistory"

interface SidebarRowProps {
  children: React.ReactNode,
  text: string,
  page?: string
}

export default function SidebarRow({ text, page, children }: SidebarRowProps) {
  const { push } = useHistory()

  return (
    <button
      onClick={() => page && push(page)}
      className="flex space-x-4 hover:text-white transition-colors duration-300 ease-in-out">
      {children}
      <span className="font-bold">{text}</span>
    </button>
  )
}
