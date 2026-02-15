import { useState } from "react";
import { createMeeting, joinMeeting } from "../api/meetingApi";

function Home({ setRoomId, setName, setIsHost }) {
  const [joinRoomId, setJoinRoomId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [error, setError] = useState("");
  const [createdRoomId, setCreatedRoomId] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enteredLink, setEnteredLink] = useState("");
  const [enteredId, setEnteredId] = useState("");

  const handleCreate = async () => {
    if (!participantName.trim()) {
      setError("Please enter your name before creating a meeting.");
      return;
    }
    setError("");
    setName(participantName);
    setIsHost(true);
    const room = await createMeeting();
    setCreatedRoomId(room);
    setIsModalOpen(true);
  };


  const handleJoin = async () => {
    if (!participantName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!joinRoomId.trim()) {
      setError("Please enter a Room ID to join.");
      return;
    }
    setError("");
    
    // Validate room exists before joining
    const result = await joinMeeting(joinRoomId, participantName);
    if (!result.success) {
      setError(result.message || "Meeting not found. Please check the meeting ID.");
      return;
    }
    
    setName(participantName);
    setRoomId(joinRoomId);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(createdRoomId);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${createdRoomId}`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const addToCalendar = () => {
    const startTime = new Date().toISOString().replace(/[:-]/g, '').replace(/\.\d{3}/, '');
    const endTime = new Date(Date.now() + 60 * 60 * 1000).toISOString().replace(/[:-]/g, '').replace(/\.\d{3}/, '');
    const title = encodeURIComponent('Video Meeting');
    const details = encodeURIComponent(`Join the meeting: ${window.location.origin}/join/${createdRoomId}`);
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}`;
    window.open(calendarUrl, '_blank');
  };

  const handleStartMeeting = () => {
    const roomToUse = enteredId.trim() || createdRoomId;
    setRoomId(roomToUse);
  };



  return (

    <div className="center">

      <div className="home-container">

        <h1>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '12px'}}>
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
          Video Meeting
        </h1>

        <p className="instructions">

          Welcome! Create a new meeting or join an existing one by entering the Room ID.

          Make sure to provide your name for a personalized experience.

        </p>

        <div className="input-group">

          <input

            type="text"

            placeholder="Enter Your Name"

            value={participantName}

            onChange={(e) => setParticipantName(e.target.value)}

            className="name-input"

          />

        </div>

        <button onClick={handleCreate} className="create-btn">

          ➕ Create New Meeting

        </button>

        <div className="join-section">

          <h2>Or Join Existing Meeting</h2>

          <div className="input-group">

            <input

              type="text"

              placeholder="Enter Room ID to Join"

              value={joinRoomId}

              onChange={(e) => setJoinRoomId(e.target.value)}

              className="room-input"

            />

            <button onClick={handleJoin} className="join-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
                <path d="M8 5v14l11-7z"/>
              </svg>
              Join Meeting
            </button>

          </div>

        </div>

        {error && <p className="error">{error}</p>}

      </div>

      {isModalOpen && (

        <div className="modal">

          <div className="modal-content">

            <h2>Meeting Created Successfully!</h2>

            <div className="meeting-details">

              <div className="detail-item">

                <label>Room ID:</label>

                <div className="detail-value">

                  <span>{createdRoomId}</span>

                  <button onClick={copyRoomId} className="copy-btn">

                    {copySuccess ? "✓" : "📋"}

                  </button>

                </div>

              </div>

              <div className="detail-item">

                <label>Meeting Link:</label>

                <div className="detail-value">

                  <span>{`${window.location.origin}/join/${createdRoomId}`}</span>

                  <button onClick={copyMeetingLink} className="copy-btn">

                    {copySuccess ? "✓" : "📋"}

                  </button>

                </div>

              </div>

              <div className="detail-item">

                <label>Schedule in Calendar:</label>

                <div className="detail-value">

                  <button onClick={addToCalendar} className="schedule-btn">

                    📅 Add to Calendar

                  </button>

                </div>

              </div>


            </div>

            <div className="input-group">

              <input

                type="text"

                placeholder="Enter Meeting Link (optional)"

                value={enteredLink}

                onChange={(e) => setEnteredLink(e.target.value)}

                className="link-input"

              />

              <input

                type="text"

                placeholder="Enter Room ID (optional)"

                value={enteredId}

                onChange={(e) => setEnteredId(e.target.value)}

                className="id-input"

              />

            </div>

            <button onClick={handleStartMeeting} className="start-meeting-btn">

              🎥 Start Meeting

            </button>


            <button onClick={() => { setIsModalOpen(false); setCreatedRoomId(""); }} className="back-btn">

              ← Back

            </button>

          </div>

        </div>

      )}

    </div>

  );



}
export default Home;

