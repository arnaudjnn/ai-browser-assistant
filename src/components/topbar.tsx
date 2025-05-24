import React from "react"

type TopbarProps = {
  onClose?: () => void
}

const Topbar = ({ onClose }: TopbarProps) => {
  return (
    <div className="flex justify-between items-center h-12 w-full  rounded-t-2xl border-b-2 border-gray-800">
      <img
        src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
        alt="Google"
        className="w-18 h-8 ml-2"
      />
   
      <button
        onClick={onClose}
        className="text-white mr-3 p-0.5 rounded-full transition-colors hover:bg-gray-800"
        aria-label="Close panel">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}

export default Topbar
