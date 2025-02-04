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
          addEvent(studentData[quarter]);
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

  const createEventFromCourse = (course) => {
    console.log(course.courseTitle);
    const time = course.timeLocations[0];
    const year = parseInt(course.quarter.slice(0, 4));
    const quarterMap = { 'W': 0, 'S': 3, 'M': 6, 'F': 9 }; // Map quarters to months
    const month = quarterMap[course.quarter.slice(-1)];
    const [startHour, startMinute] = time.beginTime.split(':').map(Number);
    const [endHour, endMinute] = time.endTime.split(':').map(Number);
  
    // Map days of the week to Google Calendar format (Mon = MO, Tue = TU, ...)
    const dayMap = {
      'M': 'MO',
      'T': 'TU',
      'W': 'WE',
      'R': 'TH',
      'F': 'FR'
    };
  
    const daysOfWeek = time.days.split(' ').map(day => dayMap[day]);
  
    return {
      summary: course.courseTitle,
      recurrence: [
        `RRULE:FREQ=WEEKLY;COUNT=30;BYDAY=${daysOfWeek.join(',')}`
      ],
      start: {
        dateTime: new Date(year, month, 1, startHour, startMinute).toISOString(),
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: new Date(year, month, 1, endHour, endMinute).toISOString(),
        timeZone: "America/Los_Angeles",
      }
    };
  };
  

  const addEvent = async (courses) => {
    for (const course of courses) {
      const eventData = createEventFromCourse(course);
      console.log("Creating event:", eventData);
  
      try {
        const { result } = await apiCalendar.createEvent(eventData);
        console.log("Event created successfully:", result);
      } catch (error) {
        console.error("Error creating event:", error);
      }
    }
  };
  

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