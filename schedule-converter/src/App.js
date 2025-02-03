import './App.css';
import { useState, ReactNode, SyntheticEvent } from 'react'; // eslint-disable-line no-unused-vars
import ApiCalendar from 'react-google-calendar-api';

function App() {
  const [permNumber, setPermNumber] = useState('');
  const [quarter, setQuarter] = useState('');
  const config = {
    "clientId": process.env.REACT_APP_GOOGLE_CLIENT_ID,
    "apiKey": process.env.REACT_APP_GOOGLE_API_KEY,
    "scope": "https://www.googleapis.com/auth/calendar",
    "discoveryDocs": [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ]
  }

  const apiCalendar = new ApiCalendar(config)
  // const [data, setData] = useState([]);

  const handleSearch = () => {
    fetch('/database.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        const studentData = json[permNumber];
        if (studentData && studentData[quarter]) {
          console.log('Found schedule:', studentData[quarter]);
          // setData(studentData[quarter]);
        } else {
          console.log('No data found for perm number:', permNumber, 'and quarter:', quarter);
        }
      })
      .catch(error => {
        console.error('Error details:', error);
      });
  };

  const listEvents = () => {
    apiCalendar.listEvents({
    }).then(({ result }) => {
      console.log(result.items);
    });
  }
  const new_event = {
    summary: "Google I/O 2015",
    location: "800 Howard St., San Francisco, CA 94103",
    description: "A chance to hear more about Google's developer products.",
    start: {
      dateTime: new Date(2025, 1, 3, 9, 0, 0, 7).toISOString(),
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: new Date(2025, 1, 3, 12, 0, 0, 7).toISOString(),
      timeZone: "America/Los_Angeles",
    },
    attendees: [
      { email: "lpage@example.com" },
      { email: "sbrin@example.com" },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };
  const addEvent = () => {
    apiCalendar.createEvent(new_event).then(({ result }) => {
      console.log(result);
    });
  }

  return (
    <div className="App">
      <div className="card">
        <h1 className="h1">Schedule to Google Calendar</h1>
        <button className="button"
          onClick={() => apiCalendar.handleAuthClick()}
        >
          Sign in with Google
        </button>
        <button
          className="button"
          onClick={() => apiCalendar.handleSignoutClick()}
        >
          Sign out
        </button>
        <button
          className="button"
          onClick={listEvents}
        >
          Test GCAL
        </button>

        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="permNumber" style={{ display: "block", marginBottom: "0.5rem" }}>
            Enter Perm Number:
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              className="perm-input"
              id="permNumber"
              type="text"
              placeholder="Perm Number"
              value={permNumber}
              onChange={(e) => setPermNumber(e.target.value)}
            />
            <input
              className="quarter-input"
              id="quarter"
              type="text"
              placeholder="Quarter"
              value={quarter}
              onChange={(e) => setQuarter(e.target.value)}
            />
            <button
              className="button"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        <button
          className="button"
          onClick={addEvent}
        >
          Convert Schedule to Google Calendar
        </button>
      </div>
    </div>
  );
}

export default App;
