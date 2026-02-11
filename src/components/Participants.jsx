import { useState, useEffect } from "react";
import "../styles/participants.css";

function Participants({ socket, roomId, onClose }) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (socket) {
      // Mock participants data - in real app this would come from socket
      setParticipants([
        { id: 1, name: "You", isHost: true, isMuted: false, hasVideo: true, isHandRaised: false },
        { id: 2, name: "John Doe", isHost: false, isMuted: true, hasVideo: false, isHandRaised: true },
        { id: 3, name: "Jane Smith", isHost: false, isMuted: false, hasVideo: true, isHandRaised: false },
      ]);
    }
  }, [socket]);

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  };

  const getRandomColor = (name) => {
    const colors = ['#1a73e8', '#ea4335', '#34a853', '#fbbc04', '#ff6d01', '#46bdc6', '#9c27b0', '#e91e63'];
    const index = name ? name.split('').reduce((a, b) => a + b.charCodeAt(0), 0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="participants">
      <div className="participants-header">
        <div className="header-content">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="header-icon">
            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63C19.68 7.55 18.92 7 18.09 7c-.84 0-1.6.55-1.87 1.37L13.5 11H16v6h4zM4 12c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm10-8c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-6h2.5l-2.54-7.63C3.68 3.55 2.92 3 2.09 3-.84 3-1.6 3.55-1.87 4.37L-5.5 11H-3v6H-4z"/>
          </svg>
          <h3>People</h3>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <span className="participant-count">{participants.length}</span>
      </div>

      <div className="participants-list">
        {participants.map((participant) => (
          <div key={participant.id} className="participant-item">
            <div
              className="participant-avatar"
              style={{ backgroundColor: getRandomColor(participant.name) }}
            >
              {getInitials(participant.name)}
            </div>

            <div className="participant-info">
              <span className="participant-name">
                {participant.name}
                {participant.id === 1 && <span className="you-indicator">(You)</span>}
              </span>
              {participant.isHost && <span className="host-badge">Meeting host</span>}
            </div>

            <div className="participant-status">
              {participant.isHandRaised && (
                <span className="hand-raised-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 7h-2v10h2V7zm-9 6c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3s-3 1.34-3 3v6c0 1.66 1.34 3 3 3z"/>
                  </svg>
                </span>
              )}
              {participant.isMuted && (
                <span className="muted-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01L9.01 7c0-.55.45-1 1-1V5c0-1.66-1.34-3-3-3-.62 0-1.19.19-1.67.5L7.01 7.01 4.27 3z"/>
                    <path d="M12 1c-2.76 0-5 2.24-5 5v7c0 1.66 1.34 3 3 3 .49 0 .97-.09 1.42-.24l1.42 1.42c-.88.38-1.84.62-2.84.62-2.76 0-5-2.24-5-5H5c0 1.66 1.34 3 3 3s3-1.34 3-3V5c0-.62-.11-1.21-.29-1.75L12 3.98V1z"/>
                  </svg>
                </span>
              )}
              {!participant.hasVideo && (
                <span className="no-video-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5z"/>
                    <path d="M3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/>
                  </svg>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="participants-footer">
        <p className="footer-text">
          People in this call can see your name and profile photo
        </p>
      </div>
    </div>
  );
}

export default Participants;
