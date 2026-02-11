import { useState } from "react";
import "../styles/controls.css";

function Controls({ stream, socket, roomId, onToggleChat, onToggleParticipants, onToggleRoomInfo, onToggleVideoEffects, isScreenSharing, onToggleScreenShare }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const toggleMute = () => {
    const audioTrack = stream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = async () => {
    const videoTrack = stream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    } else {
      // Enable video if not present
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        const newVideoTrack = videoStream.getVideoTracks()[0];
        stream.addTrack(newVideoTrack);
        setIsVideoOff(false);
        // Update the stream to trigger re-render
        setStream(new MediaStream([...stream.getTracks()]));
      } catch (error) {
        console.error("Error enabling video:", error);
      }
    }
  };

  const shareScreen = () => {
    if (onToggleScreenShare) {
      onToggleScreenShare();
    }
  };

  const toggleHand = () => {
    setIsHandRaised(!isHandRaised);
    // Send hand raise signal to other participants
    if (socket) {
      socket.emit("raise-hand", { roomId, raised: !isHandRaised });
    }
  };

  const moreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  const endCall = () => {
    stream?.getTracks().forEach(track => track.stop());
    window.location.reload();
  };

  return (
    <div className="controls">
      {/* Left side controls - Microphone, Camera */}
      <div className="controls-left">
        <div className="control-item">
          <button
            onClick={toggleMute}
            className={isMuted ? "muted" : ""}
          >
            {isMuted ? "🔇" : "🎤"}
          </button>
          <span>{isMuted ? "Unmute" : "Mute"}</span>
        </div>

        <div className="control-item">
          <button
            onClick={toggleVideo}
            className={isVideoOff ? "video-off" : ""}
          >
            {isVideoOff ? "📷" : "📹"}
          </button>
          <span>{isVideoOff ? "Turn on camera" : "Turn off camera"}</span>
        </div>
      </div>

      {/* Center - More options with Hand raise, Chat, People */}
      <div className="controls-center">
        <div className="more-options-group">
          <div className="control-item">
            <button onClick={moreOptions} className="more-options">
              ☰
            </button>
            <span>More options</span>
          </div>

          {/* Hidden controls that appear when more options is clicked */}
          <div className={`more-options-menu ${showMoreOptions ? 'show' : ''}`}>
            <div className="control-item">
              <button
                onClick={toggleHand}
                className={isHandRaised ? "hand-raised" : ""}
              >
                ✋
              </button>
              <span>{isHandRaised ? "Lower hand" : "Raise hand"}</span>
            </div>

            <div className="control-item">
              <button onClick={onToggleChat} className="chat-btn">
                💬
              </button>
              <span>Chat</span>
            </div>

            <div className="control-item">
              <button onClick={onToggleParticipants} className="participants-btn">
                👥
              </button>
              <span>People</span>
            </div>

            <div className="control-item">
              <button onClick={onToggleVideoEffects} className="video-effects-btn">
                🎨
              </button>
              <span>Video effects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side controls - Screen share, Leave call */}
      <div className="controls-right">
        <div className="control-item">
          <button onClick={shareScreen}>
            🖥️
          </button>
          <span>Present now</span>
        </div>

        <div className="control-item">
          <button className="end-call" onClick={endCall}>
            📞
          </button>
          <span>Leave call</span>
        </div>
      </div>
    </div>
  );
}

export default Controls;
