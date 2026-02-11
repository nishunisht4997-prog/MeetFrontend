import { useState, useEffect } from "react";
import "../styles/roomInfo.css";

function RoomInfo({ roomId, onClose }) {
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setMeetingDuration(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="room-info">
      <div className="room-info-header">
        <div className="header-content">
          <h3>Meeting details</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="room-info-content">
        <div className="meeting-info-section">
          <div className="info-row">
            <div className="info-label">Meeting code</div>
            <div className="info-value">
              <span className="meeting-code">{roomId}</span>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(roomId)}
                title="Copy meeting code"
              >
                {copySuccess ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="info-row">
            <div className="info-label">Meeting duration</div>
            <div className="info-value">
              <span className="duration">{formatDuration(meetingDuration)}</span>
            </div>
          </div>

          <div className="info-row">
            <div className="info-label">Joining info</div>
            <div className="info-value">
              <span className="joining-info">
                Video call accessible by link
              </span>
            </div>
          </div>
        </div>

        <div className="meeting-link-section">
          <h4>Meeting link</h4>
          <div className="link-container">
            <span className="meeting-link">
              {`${window.location.origin}/join/${roomId}`}
            </span>
            <button
              className="copy-link-btn"
              onClick={() => copyToClipboard(`${window.location.origin}/join/${roomId}`)}
              title="Copy meeting link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="security-notice">
          <div className="security-icon">🔒</div>
          <div className="security-text">
            <p>Anyone with the meeting link can join</p>
            <p className="security-subtitle">
              This meeting is protected by standard Google Meet security settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomInfo;
