
import { useState } from "react";
import Home from "./pages/Home";
import Room from "./pages/Room";

function App() {
  const [roomId, setRoomId] = useState(null);
  const [name, setName] = useState("");
  const [isHost, setIsHost] = useState(false);

  return (
    <>
      {!roomId ? (
        <Home setRoomId={setRoomId} setName={setName} setIsHost={setIsHost} />
      ) : (
        <Room roomId={roomId} name={name} isHost={isHost} />
      )}
    </>
  );
}

export default App;
