import './App.css';
import { useState, ReactNode, SyntheticEvent } from 'react'; // eslint-disable-line no-unused-vars
import ApiCalendar from 'react-google-calendar-api';

function App() {
  const [permNumber, setPermNumber] = useState('');
  const [quarter, setQuarter] = useState('');
  const config = {
    "clientId": "<CLIENT ID>",
    "apiKey": "<API KEY>>",
    "scope": "https://www.googleapis.com/auth/calendar",
    "discoveryDocs": [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
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
          onClick={() => console.log("convert schedule clicked")}
        >
          Convert Schedule to Google Calendar
        </button>
      </div>
    </div>
  );
}

export default App;
