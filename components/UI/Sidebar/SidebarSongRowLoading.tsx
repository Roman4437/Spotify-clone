export default function SidebarSongRowLoading() {
  return (
    <div className="flex items-center p-2 rounded-md space-x-3">
      <div className="bg-[rgb(40,40,40)] h-12 aspect-square rounded-sm" />
      <div className="flex flex-col w-full space-y-2">
        <div className="bg-[rgb(40,40,40)] h-4 w-4/5 rounded-sm" />
        <div className="bg-[rgb(40,40,40)] h-3 w-3/5 rounded-sm" />
      </div>
    </div>
  )
}
