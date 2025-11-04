"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"

const socket = io("http://localhost:5000")

export default function Whiteboard({ roomId }: { roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [drawing, setDrawing] = useState(false)

  useEffect(() => {
    socket.emit("join-room", roomId)

    socket.on("draw", (data) => {
      if (!ctx) return
      const { x, y, type } = data
      if (type === "start") {
        ctx.beginPath()
        ctx.moveTo(x, y)
      } else if (type === "draw") {
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    })

    return () => {
      socket.off("draw")
    }
  }, [ctx, roomId])

  useEffect(() => {
    const canvas = canvasRef.current!
    const context = canvas.getContext("2d")!
    context.lineWidth = 2
    context.strokeStyle = "White"
    setCtx(context)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setDrawing(true)
    const x = e.nativeEvent.offsetX
    const y = e.nativeEvent.offsetY
    ctx?.beginPath()
    ctx?.moveTo(x, y)
    socket.emit("draw", { roomId, data: { x, y, type: "start" } })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing || !ctx) return
    const x = e.nativeEvent.offsetX
    const y = e.nativeEvent.offsetY
    ctx.lineTo(x, y)
    ctx.stroke()
    socket.emit("draw", { roomId, data: { x, y, type: "draw" } })
  }

  const handleMouseUp = () => setDrawing(false)

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Whiteboard Canvas
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          Room ID: <span className="text-cyan-400 font-semibold">{roomId}</span>
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-2xl blur-xl opacity-60"></div>
        <div className="relative bg-white backdrop-blur-sm border-2 border-cyan-500/30 rounded-2xl p-2 shadow-2xl hover:border-cyan-500/50 transition-all duration-300">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="border-2 border-cyan-400/40 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 cursor-crosshair hover:border-cyan-400/60 transition-all duration-200 shadow-inner"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>

      <p className="mt-6 text-slate-400 text-sm text-center max-w-md">
        Draw on the canvas and your strokes will be shared with all users in the room in real-time
      </p>
    </div>
  )
}