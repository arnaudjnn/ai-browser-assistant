import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { useMessage } from "@plasmohq/messaging/hook"

import Topbar from "./components/topbar"

import "~base.css"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Listen for messages from background script
    const messageListener = (message: any, sender: any, sendResponse: any) => {
      if (message.action === "toggle-overlay") {
        setIsVisible((prev) => !prev)
        sendResponse({ success: true })
      }
    }

    chrome.runtime.onMessage.addListener(messageListener)

    // Optional: Listen for keyboard shortcut
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "E") {
        event.preventDefault()
        setIsVisible((prev) => !prev)
      }
    }

    document.addEventListener("keydown", handleKeydown)

    // Cleanup
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
      document.removeEventListener("keydown", handleKeydown)
    }
  }, [])

  return (
    <div
      className={`z-[9999] flex flex-col p-4 fixed top-2 right-2 h-[725px] w-[320px] bg-slate-900 rounded-2xl shadow-2xl text-base box-border transition-transform duration-300 ${
        !isVisible ? 'translate-x-[340px]' : 'translate-x-0'
      }`}
      style={{ fontFamily: "system-ui, sans-serif" }}>
      <Topbar />
      <p className="text-white text-[28px] font-normal text-center my-auto mx-auto">
        Hello Extensions
      </p>
      <div className="flex flex-col gap-2">
        <button className="bg-white h-12 text-black p-2 rounded-md">
          login
        </button>
        <button className="bg-white h-12 text-black p-2 rounded-md">
          signup
        </button>
      </div>
    </div>
  )
}

export default PlasmoOverlay
