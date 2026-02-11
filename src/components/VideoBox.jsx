import { useEffect, useRef, useState } from "react";

function VideoBox({ stream, name, isMain = false, isPinned = false, onPin, onClick, isLocal = false, connectionQuality = 'good', isSpeaking = false, audioLevel = 0 }) {
  const videoRef = useRef();
  const [hasVideo, setHasVideo] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (stream) {
      videoRef.current.srcObject = stream;
      const videoTrack = stream.getVideoTracks()[0];
      setHasVideo(videoTrack && videoTrack.enabled);
    }
  }, [stream]);

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  };

  const getRandomColor = (name) => {
    const colors = ['#1a73e8', '#ea4335', '#34a853', '#fbbc04', '#ff6d01', '#46bdc6', '#9c27b0', '#e91e63'];
    const index = name ? name.split('').reduce((a, b) => a + b.charCodeAt(0), 0) % colors.length : 0;
    return colors[index];
  };

  const getConnectionQualityIcon = (quality) => {
    switch (quality) {
      case 'excellent': return '🟢';
      case 'good': return '🟡';
      case 'poor': return '🔴';
      default: return '⚪';
    }
  };

  const renderAudioVisualizer = () => {
    if (!isSpeaking || audioLevel === 0) return null;

    const bars = [];
    const numBars = 5;
    for (let i = 0; i < numBars; i++) {
      const height = Math.max(2, audioLevel * 20 * (1 - i * 0.2));
      bars.push(
        <div
          key={i}
          className="audio-bar"
          style={{ height: `${height}px` }}
        />
      );
    }
    return <div className="audio-visualizer">{bars}</div>;
  };

  return (
    <div
      className={`video-wrapper ${isMain ? 'main-video' : ''} ${isPinned ? 'pinned' : ''} ${isMinimized ? 'minimized' : ''} ${isMaximized ? 'maximized' : ''} ${isSpeaking ? 'speaking' : ''}`}
      onClick={onClick}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          muted={isLocal}
          playsInline
        />
      ) : (
        <div
          className="avatar-placeholder"
          style={{ backgroundColor: getRandomColor(name) }}
        >
          <span className="avatar-initials">{getInitials(name)}</span>
        </div>
      )}

      {name && (
        <div className="name-overlay">
          {name}
          {isLocal && <span className="local-indicator">(You)</span>}
        </div>
      )}

      {!isLocal && connectionQuality && (
        <div className="connection-indicator" title={`Connection: ${connectionQuality}`}>
          {getConnectionQualityIcon(connectionQuality)}
        </div>
      )}

      {renderAudioVisualizer()}

      {!isLocal && onPin && (
        <button
          className="pin-button"
          onClick={(e) => {
            e.stopPropagation();
            onPin();
          }}
          title={isPinned ? "Unpin video" : "Pin video"}
        >
          {isPinned ? '📌' : '📍'}
        </button>
      )}

      <button
        className="minimize-button"
        onClick={(e) => {
          e.stopPropagation();
          setIsMinimized(!isMinimized);
          setIsMaximized(false);
        }}
        title={isMinimized ? "Restore video" : "Minimize video"}
      >
        {isMinimized ? '🔄' : '➖'}
      </button>

      <button
        className="maximize-button"
        onClick={(e) => {
          e.stopPropagation();
          setIsMaximized(!isMaximized);
          setIsMinimized(false);
        }}
        title={isMaximized ? "Exit full screen" : "Full screen"}
      >
        {isMaximized ? '⛶' : '⛶'}
      </button>

      {isPinned && (
        <div className="pinned-indicator">
          📌 Pinned
        </div>
      )}
    </div>
  );
}

export default VideoBox;
