
import { useState } from "react";
import Home from "./pages/Home";
import Room from "./pages/Room";
import Navbar from "./components/Navbar";

function App() {
  const [roomId, setRoomId] = useState(null);
  const [name, setName] = useState("");
  const [isHost, setIsHost] = useState(false);

  return (
    <>
      <Navbar />
      {!roomId ? (
        <Home setRoomId={setRoomId} setName={setName} setIsHost={setIsHost} />
      ) : (
        <Room roomId={roomId} name={name} isHost={isHost} />
      )}
    </>
  );
}

export default App;
