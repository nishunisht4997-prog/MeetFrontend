
import { useState } from "react";
import Home from "./pages/Home";
import Room from "./pages/Room";

function App() {
  const [roomId, setRoomId] = useState(null);
  const [name, setName] = useState("");

  return (
    <>
      {!roomId ? (
        <Home setRoomId={setRoomId} setName={setName} />
      ) : (
        <Room roomId={roomId} name={name} />
      )}
    </>
  );
}

export default App;
