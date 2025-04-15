// Function to get Google Auth token using @react-oauth/google
export const getGoogleAuthToken = async () => {
  // This assumes you're using the GoogleOAuthProvider and have a token available
  const token = localStorage.getItem("googleAccessToken");
  return token;
};

// Function to list calendar events
export const listCalendarEvents = async (timeMin, timeMax) => {
  try {
    const token = await getGoogleAuthToken();
    if (!token) throw new Error("Not authenticated with Google");

    // Initialize the calendar API if not already initialized
    if (!window.gapi.client.calendar) {
      await window.gapi.client.init({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        ],
      });
    }

    console.log("Token", token);

    // Set the auth token for the request
    window.gapi.client.setToken({ access_token: token });

    // Make the API request
    const response = await window.gapi.client.calendar.events.list({
      calendarId: "primary",
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.result.items;
  } catch (error) {
    // console.error('Error fetching calendar events:', error);
    return [];
  }
};

// Function to create a calendar event
export const createCalendarEvent = async (event) => {
  try {
    const token = await getGoogleAuthToken();
    if (!token) throw new Error("Not authenticated with Google");

    // Set the auth token for the request
    window.gapi.client.setToken({ access_token: token });

    const response = await window.gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    return response.result;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return null;
  }
};

// Function to convert task to Google Calendar event format
export const taskToGoogleEvent = (task) => {
  if (!task || !task.deadline) return null;

  const deadline = new Date(task.deadline);
  const endTime = new Date(deadline);
  endTime.setHours(endTime.getHours() + 1); // Default 1 hour duration

  return {
    summary: task.title,
    description: task.description || "",
    start: {
      dateTime: deadline.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
};
