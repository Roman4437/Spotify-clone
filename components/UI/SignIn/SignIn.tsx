import { signIn } from "next-auth/react"
import Image from "next/image"

export default function SignIn() {
  return (
    <div className="flex h-screen w-screen items-center justify-center text-[#b3b3b3]">
      <button
        className="flex bg-[#121212] hover:bg-white hover:text-black p-1 items-center space-x-4 border border-[#ffffff12] transition ease-out"
        onClick={() => signIn("google")}>
        <Image
          width={48}
          height={48}
          className="bg-white p-3"
          src="/google.png"
          alt="google" />
        <span className="pr-4">Sign up with Google</span>
      </button>
    </div>
  )
}
