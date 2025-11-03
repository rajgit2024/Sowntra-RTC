"use client"

import { useState } from "react"
import axios from "axios"
import Whiteboard from "./Whiteboard"

export default function App() {
  const [room, setRoom] = useState("")
  const [joined, setJoined] = useState(false)

  const createRoom = async () => {
    const res = await axios.post("http://localhost:5000/api/rooms", {
      name: `Room ${Date.now()}`,
    })
    setRoom(res.data.id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {!joined ? (
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-cyan-500/20 rounded-2xl blur-xl opacity-75"></div>
            <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 border border-cyan-500/20 rounded-2xl p-8 shadow-2xl">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                  Collaborative Whiteboard
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Create a new room or join an existing one to start drawing together in real-time
                </p>
              </div>

              {/* Input Section */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="room-id" className="block text-sm font-semibold text-slate-300 mb-2">
                    Room ID
                  </label>
                  <input
                    id="room-id"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Enter room ID or leave blank to create new"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 hover:border-slate-500"
                  />
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    onClick={createRoom}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50 hover:shadow-2xl transform hover:scale-105"
                  >
                    Create Room
                  </button>
                  <button
                    onClick={() => setJoined(true)}
                    disabled={!room}
                    className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 hover:shadow-2xl transform hover:scale-105"
                  >
                    Join Room
                  </button>
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-xs text-slate-400 text-center">
                  ✨ Create a room first, then share the ID with others to collaborate
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Whiteboard roomId={room} />
      )}
    </div>
  )
}
