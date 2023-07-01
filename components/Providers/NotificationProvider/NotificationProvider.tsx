'use client'

import { Toaster } from "react-hot-toast";

export default function NotificationProvider() {
  return <Toaster
    toastOptions={{
      style: {
        background: "rgb(96 165 250)",
        color: "white",
        borderRadius: "4px"
      },
      icon: null
    }}
    position="bottom-center"
    containerStyle={{ bottom: "120px" }} />
}
