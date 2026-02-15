
export const createMeeting = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/create-meeting`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return data.roomId;
};

export const joinMeeting = async (roomId, name) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/join-meeting`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId, name }),
    }
  );

  const data = await response.json();
  return data;
};
