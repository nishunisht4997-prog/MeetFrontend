export const createPeer = (onTrack, onIceCandidate, onError, onConnectionStateChange) => {
  const peer = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      // Add TURN servers for production (replace with your own TURN server credentials)
      {
        urls: "turn:turn.example.com:3478",
        username: "your-turn-username",
        credential: "your-turn-password"
      }
    ]
  });

  peer.ontrack = event => {
    if (event.streams && event.streams[0]) {
      onTrack(event.streams[0]);
    }
  };

  peer.onicecandidate = event => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };

  peer.onerror = error => {
    console.error("Peer connection error:", error);
    if (onError) onError(error);
  };

  peer.onconnectionstatechange = () => {
    console.log("Connection state changed:", peer.connectionState);
    if (onConnectionStateChange) onConnectionStateChange(peer.connectionState);
  };

  // Add retry logic for failed connections
  let retryCount = 0;
  const maxRetries = 3;

  const retryOffer = () => {
    if (retryCount < maxRetries) {
      retryCount++;
      console.log(`Retrying offer creation (attempt ${retryCount})`);
      // Implement retry logic here if needed
    }
  };

  return peer;
};

