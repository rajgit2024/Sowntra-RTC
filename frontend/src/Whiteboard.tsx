import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Whiteboard({ roomId }: { roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("draw", (data) => {
      if (!ctx) return;
      const { x, y, type } = data;
      if (type === "start") {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else if (type === "draw") {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    });

    return () => {
      socket.off("draw");
    };
  }, [ctx, roomId]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;
    context.lineWidth = 2;
    context.strokeStyle = "black";
    setCtx(context);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDrawing(true);
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    ctx?.beginPath();
    ctx?.moveTo(x, y);
    socket.emit("draw", { roomId, data: { x, y, type: "start" } });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing || !ctx) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    ctx.lineTo(x, y);
    ctx.stroke();
    socket.emit("draw", { roomId, data: { x, y, type: "draw" } });
  };

  const handleMouseUp = () => setDrawing(false);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl mb-2 text-white font-bold">Room: {roomId}</h2>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="border border-gray-400 rounded bg-white"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
