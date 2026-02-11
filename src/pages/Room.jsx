import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import VideoBox from "../components/VideoBox";
import Controls from "../components/Controls";
import Chat from "../components/Chat";
import Participants from "../components/Participants";
import RoomInfo from "../components/RoomInfo";
import VideoEffects from "../components/VideoEffects";
import { createPeer } from "../webrtc/peer";
import "../styles/room.css";

function Room({ roomId, name, isHost }) {
  const [stream, setStream] = useState(null);
  const [socket, setSocket] = useState(null);
  const peerRef = useRef(null);
  const peersRef = useRef({});
  const [remoteStreams, setRemoteStreams] = useState({});
  const streamRef = useRef();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [pinnedStream, setPinnedStream] = useState(null);
  const [mainStream, setMainStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Panel visibility states
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [showVideoEffects, setShowVideoEffects] = useState(false);

  // Waiting room state
  const [waitingParticipants, setWaitingParticipants] = useState([]);
  const [hasJoinedCall, setHasJoinedCall] = useState(isHost); // Host joins immediately

  // Handle video pinning
  const handlePinVideo = (streamToPin) => {
    if (pinnedStream === streamToPin) {
      setPinnedStream(null);
      setMainStream(null);
    } else {
      setPinnedStream(streamToPin);
      setMainStream(streamToPin);
    }
  };

  // Handle video click to make main
  const handleVideoClick = (streamToMain) => {
    if (!pinnedStream) {
      setMainStream(streamToMain);
    }
  };

  // Handle video effects changes
  const handleVideoEffectChange = (effectData) => {
    // Apply effects to the actual video elements in the call
    const videoElements = document.querySelectorAll('video');

    if (effectData.type === 'style') {
      // Apply style effects (filters) to all video elements
      videoElements.forEach(videoElement => {
        let filterString = '';

        switch (effectData.effect.id) {
          case 'brightness-up':
            filterString = 'brightness(120%)';
            break;
          case 'brightness-down':
            filterString = 'brightness(80%)';
            break;
          case 'contrast-up':
            filterString = 'contrast(120%)';
            break;
          case 'grayscale':
            filterString = 'grayscale(100%)';
            break;
          case 'sepia':
            filterString = 'sepia(100%)';
            break;
          case 'blur-soft':
            filterString = 'blur(2px)';
            break;
          case 'hue-rotate':
            filterString = 'hue-rotate(90deg)';
            break;
          case 'invert':
            filterString = 'invert(100%)';
            break;
          case 'saturate':
            filterString = 'saturate(150%)';
            break;
          default:
            filterString = 'none';
        }

        videoElement.style.filter = filterString;
      });
    } else if (effectData.type === 'background') {
      // Apply background effects to video containers
      const videoContainers = document.querySelectorAll('.video-wrapper, .video-preview');

      videoContainers.forEach(container => {
        // Remove existing background classes
        container.className = container.className.replace(/bg-\w+/g, '').trim();

        switch (effectData.background.type) {
        case 'blur':
          const blurIntensity = effectData.background.intensity || 10;
          // Apply blur to the video element itself for better visibility
          const videoElement = container.querySelector('video');
          if (videoElement) {
            videoElement.style.filter = `blur(${blurIntensity}px)`;
          }
          container.style.backgroundColor = 'rgba(0,0,0,0.1)';
          container.style.backgroundImage = 'none';
          container.style.backdropFilter = 'none';
          break;
          case 'image':
            // For virtual backgrounds, set background image
            container.style.backgroundImage = `url(${effectData.background.url})`;
            container.style.backgroundSize = 'cover';
            container.style.backgroundPosition = 'center';
            container.style.backdropFilter = 'none';
            break;
          case 'none':
          default:
            container.style.backgroundColor = 'transparent';
            container.style.backgroundImage = 'none';
            container.style.backdropFilter = 'none';
            break;
        }
      });
    }
  };

  // Handle screen sharing toggle
  const handleToggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing and switch back to camera
        const videoTrack = streamRef.current?.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.stop();
        }

        // Get camera stream
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        const cameraTrack = cameraStream.getVideoTracks()[0];

        // Replace video track in local stream
        const sender = streamRef.current?.getVideoTracks()[0];
        if (sender) {
          streamRef.current.removeTrack(sender);
          sender.stop();
        }
        streamRef.current.addTrack(cameraTrack);

        // Update peers with new track
        Object.values(peersRef.current).forEach((peer) => {
          const videoSender = peer.getSenders().find(s => s.track?.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(cameraTrack);
          }
        });

        setStream(new MediaStream([...streamRef.current.getTracks()]));
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace video track in local stream
        const sender = streamRef.current?.getVideoTracks()[0];
        if (sender) {
          streamRef.current.removeTrack(sender);
          sender.stop();
        }
        streamRef.current.addTrack(screenTrack);

        // Update peers with screen track
        Object.values(peersRef.current).forEach((peer) => {
          const videoSender = peer.getSenders().find(s => s.track?.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(screenTrack);
          }
        });

        setStream(new MediaStream([...streamRef.current.getTracks()]));
        setIsScreenSharing(true);

        // Handle when user stops sharing via browser UI
        screenTrack.onended = () => {
          handleToggleScreenShare();
        };
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  };

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        // First, get user media
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setStream(mediaStream);
        streamRef.current = mediaStream;

        // Then connect to socket
        const socketConnection = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
        setSocket(socketConnection);

        if (isHost) {
          socketConnection.emit("join-room", roomId);
        } else {
          socketConnection.emit("request-to-join", { roomId, name });
        }

        // Socket event listeners - now safe to create peers since stream is ready
        socketConnection.on("request-to-join", ({ userId, name }) => {
          if (isHost) {
            setWaitingParticipants(prev => [...prev, { id: userId, name }]);
          }
        });

        socketConnection.on("accept-join", () => {
          if (!isHost) {
            setHasJoinedCall(true);
            socketConnection.emit("join-room", roomId);
          }
        });

        socketConnection.on("reject-join", () => {
          if (!isHost) {
            alert("Your request to join was rejected by the host.");
            // Redirect back to home or handle rejection
          }
        });

        socketConnection.on("user-joined", (userId) => {
          console.log("User joined:", userId);
          // Create peer for new user
          const peer = createPeer(
            (stream) => {
              setRemoteStreams((prev) => ({ ...prev, [userId]: stream }));
            },
            (candidate) => {
              socketConnection.emit("ice-candidate", { roomId, candidate, to: userId });
            },
            (error) => {
              console.error(`Peer error for user ${userId}:`, error);
            },
            (state) => {
              console.log(`Connection state for user ${userId}:`, state);
              if (state === 'failed' || state === 'disconnected') {
                // Handle reconnection or cleanup
                handlePeerDisconnect(userId);
              }
            }
          );
          peersRef.current[userId] = peer;

          // Add local stream to peer
          streamRef.current.getTracks().forEach((track) => {
            peer.addTrack(track, streamRef.current);
          });

          // Create offer
          peer.createOffer().then((offer) => {
            peer.setLocalDescription(offer);
            socketConnection.emit("offer", { roomId, offer, to: userId });
          }).catch((error) => {
            console.error("Error creating offer:", error);
          });
        });

        socketConnection.on("offer", ({ offer, from }) => {
          console.log("Received offer from:", from);
          const peer = createPeer(
            (stream) => {
              setRemoteStreams((prev) => ({ ...prev, [from]: stream }));
            },
            (candidate) => {
              socketConnection.emit("ice-candidate", { roomId, candidate, to: from });
            },
            (error) => {
              console.error(`Peer error for user ${from}:`, error);
            },
            (state) => {
              console.log(`Connection state for user ${from}:`, state);
              if (state === 'failed' || state === 'disconnected') {
                handlePeerDisconnect(from);
              }
            }
          );
          peersRef.current[from] = peer;

          // Add local stream to peer
          streamRef.current.getTracks().forEach((track) => {
            peer.addTrack(track, streamRef.current);
          });

          peer.setRemoteDescription(new RTCSessionDescription(offer));
          peer.createAnswer().then((answer) => {
            peer.setLocalDescription(answer);
            socketConnection.emit("answer", { roomId, answer, to: from });
          }).catch((error) => {
            console.error("Error creating answer:", error);
          });
        });

        socketConnection.on("answer", ({ answer, from }) => {
          console.log("Received answer from:", from);
          const peer = peersRef.current[from];
          if (peer) {
            peer.setRemoteDescription(new RTCSessionDescription(answer)).catch((error) => {
              console.error("Error setting remote description:", error);
            });
          }
        });

        socketConnection.on("ice-candidate", ({ candidate, from }) => {
          console.log("Received ICE candidate from:", from);
          const peer = peersRef.current[from];
          if (peer) {
            peer.addIceCandidate(new RTCIceCandidate(candidate)).catch((error) => {
              console.error("Error adding ICE candidate:", error);
            });
          }
        });

        // Handle user leaving
        socketConnection.on("user-left", (userId) => {
          console.log("User left:", userId);
          handlePeerDisconnect(userId);
        });

      } catch (error) {
        console.error("Error initializing room:", error);
      }
    };

    const handlePeerDisconnect = (userId) => {
      const peer = peersRef.current[userId];
      if (peer) {
        peer.close();
        delete peersRef.current[userId];
      }
      setRemoteStreams((prev) => {
        const newStreams = { ...prev };
        delete newStreams[userId];
        return newStreams;
      });
    };

    initializeRoom();

    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      Object.values(peersRef.current).forEach((peer) => peer.close());
      peersRef.current = {};
      setRemoteStreams({});
    };
  }, [roomId]);

  // Determine layout based on participant count and pinned video
  const remoteStreamsArray = Object.values(remoteStreams);
  const totalStreams = (stream ? 1 : 0) + remoteStreamsArray.length;
  const hasPinned = pinnedStream !== null;

  // If pinned, main video is pinned, otherwise first stream or local stream
  const currentMainStream = mainStream || (remoteStreamsArray.length > 0 ? remoteStreamsArray[0] : stream);

  // Filter out main stream from grid if we have multiple participants
  const gridStreams = totalStreams > 1 ?
    (hasPinned ?
      [stream, ...remoteStreamsArray].filter(s => s && s !== pinnedStream) :
      [stream, ...remoteStreamsArray].filter(s => s && s !== currentMainStream)
    ) : [];

  return (
    <div className="room-container">
      {!hasJoinedCall ? (
        <div className="waiting-room">
          <h2>Waiting for host approval...</h2>
          <p>You've requested to join the meeting. Please wait for the host to accept your request.</p>
        </div>
      ) : (
        <>
          <div className="video-layout">
            {/* Main video area */}
            {totalStreams > 0 && (
              <div className="main-video-area">
                {currentMainStream && (
                  <VideoBox
                    stream={currentMainStream}
                    name={currentMainStream === stream ? name : `Participant ${Object.keys(remoteStreams).find(key => remoteStreams[key] === currentMainStream) || 'Unknown'}`}
                    isMain={true}
                    isPinned={pinnedStream === currentMainStream}
                    onPin={() => handlePinVideo(currentMainStream)}
                    onClick={() => handleVideoClick(currentMainStream)}
                    isLocal={currentMainStream === stream}
                  />
                )}
              </div>
            )}

            {/* Grid area for other videos */}
            {gridStreams.length > 0 && (
              <div className="video-grid">
                {gridStreams.map((gridStream, index) => (
                  <VideoBox
                    key={index}
                    stream={gridStream}
                    name={gridStream === stream ? name : `Participant ${Object.keys(remoteStreams).find(key => remoteStreams[key] === gridStream) || 'Unknown'}`}
                    isMain={false}
                    isPinned={pinnedStream === gridStream}
                    onPin={() => handlePinVideo(gridStream)}
                    onClick={() => handleVideoClick(gridStream)}
                    isLocal={gridStream === stream}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
      <Controls
        stream={stream}
        socket={socket}
        roomId={roomId}
        setStream={setStream}
        onToggleChat={() => setShowChat(!showChat)}
        onToggleParticipants={() => setShowParticipants(!showParticipants)}
        onToggleRoomInfo={() => setShowRoomInfo(!showRoomInfo)}
        onToggleVideoEffects={() => setShowVideoEffects(!showVideoEffects)}
        isScreenSharing={isScreenSharing}
        onToggleScreenShare={handleToggleScreenShare}
      />

      {/* Side panels */}
      {showChat && (
        <div className="side-panel chat-panel">
          <Chat socket={socket} roomId={roomId} onClose={() => setShowChat(false)} />
        </div>
      )}

      {showParticipants && (
        <div className="side-panel participants-panel">
          <Participants
            socket={socket}
            roomId={roomId}
            onClose={() => setShowParticipants(false)}
            isHost={isHost}
            waitingParticipants={waitingParticipants}
            setWaitingParticipants={setWaitingParticipants}
          />
        </div>
      )}

      {showRoomInfo && (
        <div className="side-panel room-info-panel">
          <RoomInfo roomId={roomId} onClose={() => setShowRoomInfo(false)} />
        </div>
      )}

      {showVideoEffects && (
        <div className="side-panel video-effects-panel">
          <VideoEffects
            stream={stream}
            onClose={() => setShowVideoEffects(false)}
            onEffectChange={handleVideoEffectChange}
          />
        </div>
      )}
    </div>
  );
}

export default Room;
