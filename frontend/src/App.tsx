import { useState } from "react";
import axios from "axios";
import Whiteboard from "./Whiteboard";

export default function App() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const createRoom = async () => {
    const res = await axios.post("http://localhost:5000/api/rooms", {
      name: `Room ${Date.now()}`,
    });
    setRoom(res.data.id);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      {!joined ? (
        <>
          <h1 className="text-2xl mb-4">Collaborative Whiteboard</h1>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Enter or create room ID"
            className="border px-2 py-1"
          />
          <div className="mt-2 space-x-2">
            <button
              onClick={createRoom}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Create Room
            </button>
            <button
              onClick={() => setJoined(true)}
              className="bg-green-500 text-white px-4 py-1 rounded"
            >
              Join Room
            </button>
          </div>
        </>
      ) : (
        <Whiteboard roomId={room} />
      )}
    </div>
  );
}
