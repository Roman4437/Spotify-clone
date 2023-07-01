import path from "path"
import fs from "fs"

import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()

    const audio = data.get("audio") as File
    const cover = data.get("cover") as File
    const artist = data.get("artist") as string
    const song = data.get("song") as string

    const filePath = path.join(process.cwd(), "public", "songs")
    const baseName = crypto.randomUUID()
    const coverName = `${artist} - ${song} [${baseName}].${cover.name.split(".").pop()}`
    const audioName = `${artist} - ${song} [${baseName}].${audio.name.split(".").pop()}`

    const coverBuffer = new Uint8Array(await cover.arrayBuffer())
    const audioBuffer = new Uint8Array(await audio.arrayBuffer())

    if (!fs.existsSync(filePath))
      fs.mkdirSync(filePath, { recursive: true })

    fs.writeFileSync(path.join(filePath, coverName), coverBuffer)
    fs.writeFileSync(path.join(filePath, audioName), audioBuffer)

    return NextResponse.json({ message: { audio: audioName, cover: coverName }, success: true })
  } catch (error) {
    return NextResponse.json({ message: error, success: false })
  }
}