import './App.css';
import { useState, useEffect } from 'react';
import ApiCalendar from 'react-google-calendar-api';

function App() {
  const [permNumber, setPermNumber] = useState('');
  const [quarter, setQuarter] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    // If there is no stored theme, match system theme
    if (storedTheme == null) {
      const isDark = window.matchMedia("(prefers-color-scheme:dark)").matches
      return isDark
    }
    return storedTheme === 'dark';
  });

  const config = {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    scope: "https://www.googleapis.com/auth/calendar",
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ]
  };

  const apiCalendar = new ApiCalendar(config);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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
    apiCalendar.listEvents({}).then(({ result }) => {
      console.log(result.items);
    });
  };

  const createEventFromCourse = (course) => {
    const time = course.timeLocations[0];
    const year = parseInt(course.quarter.slice(0, 4));
    const quarterMap = { 'W': 0, 'S': 3, 'M': 6, 'F': 9 };
    const month = quarterMap[course.quarter.slice(-1)];
    const [startHour, startMinute] = time.beginTime.split(':').map(Number);
    const [endHour, endMinute] = time.endTime.split(':').map(Number);
    const dayMap = { 'M': 'MO', 'T': 'TU', 'W': 'WE', 'R': 'TH', 'F': 'FR' };
    const time_len = time.days.split(' ').length;
    return {
      summary: course.courseTitle,
      recurrence: [
        `RRULE:FREQ=WEEKLY;COUNT=${time_len * 10};BYDAY=${time.days.split(' ').map(day => dayMap[day]).join(',')}`
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
      apiCalendar.createEvent(createEventFromCourse(course)).then(({ result }) => {
        console.log(result);
      });
    }
  };

  const generateICS = async () => {
    try {
      const response = await apiCalendar.listEvents();
      const events = response.result.items || [];

      const escapeText = (text) => {
        if (!text) return '';
        return text
          .replace(/[\\;,]/g, (match) => '\\' + match)
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/[^\x20-\x7E]/g, '')
          .replace(/"/g, '\'');
      };

      const foldLine = (line) => {
        if (line.length <= 75) return line;
        const parts = [];
        let currentLine = '';

        const chars = [...line];

        for (const char of chars) {
          if ((currentLine + char).length > 74) {
            parts.push(currentLine);
            currentLine = ' ' + char;
          } else {
            currentLine += char;
          }
        }
        if (currentLine) parts.push(currentLine);

        return parts.join('\r\n');
      };

      const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const organizerDomain = window.location.hostname || 'yourdomain.com';

      let icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Your Organization//Your App//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        `X-WR-CALNAME:${escapeText('My Calendar')}`,
        `X-WR-CALDESC:${escapeText('Exported Calendar')}`,
        'X-WR-TIMEZONE:UTC',
        'BEGIN:VTIMEZONE',
        'TZID:UTC',
        'BEGIN:STANDARD',
        'DTSTART:19700101T000000Z',
        'TZOFFSETFROM:+0000',
        'TZOFFSETTO:+0000',
        'END:STANDARD',
        'END:VTIMEZONE'
      ].join('\r\n');

      events.forEach(event => {
        if (!event.start || !event.end) return;

        const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@${organizerDomain}`;

        const isAllDay = Boolean(event.start.date);

        let start, end;

        if (isAllDay) {
          start = event.start.date.replace(/-/g, '');
          const endDate = new Date(event.end.date);
          endDate.setDate(endDate.getDate() + 1);
          end = endDate.toISOString().split('T')[0].replace(/-/g, '');
        } else {
          start = new Date(event.start.dateTime)
            .toISOString()
            .replace(/[-:]/g, '')
            .split('.')[0] + 'Z';
          end = new Date(event.end.dateTime)
            .toISOString()
            .replace(/[-:]/g, '')
            .split('.')[0] + 'Z';
        }

        const eventLines = [
          '',
          'BEGIN:VEVENT',
          `UID:${uid}`,
          `DTSTAMP:${timestamp}`,
          isAllDay ? `DTSTART;VALUE=DATE:${start}` : `DTSTART:${start}`,
          isAllDay ? `DTEND;VALUE=DATE:${end}` : `DTEND:${end}`,
          `SUMMARY:${escapeText(event.summary || 'Untitled Event')}`,
          'CLASS:PUBLIC',
          'SEQUENCE:0',
          `CREATED:${timestamp}`,
          `LAST-MODIFIED:${timestamp}`
        ];

        if (event.description?.trim()) {
          eventLines.push(`DESCRIPTION:${escapeText(event.description)}`);
        }

        if (event.location?.trim()) {
          eventLines.push(`LOCATION:${escapeText(event.location)}`);
        }

        if (event.status) {
          const validStatuses = ['CONFIRMED', 'TENTATIVE', 'CANCELLED'];
          const status = event.status.toUpperCase();
          if (validStatuses.includes(status)) {
            eventLines.push(`STATUS:${status}`);
          }
        }

        if (event.organizer?.email) {
          const organizerName = escapeText(event.organizer.displayName || event.organizer.email);
          eventLines.push(`ORGANIZER;CN=${organizerName}:mailto:${event.organizer.email}`);
        }

        if (event.attendees?.length) {
          event.attendees.forEach(attendee => {
            if (!attendee.email) return;

            const params = [];
            if (attendee.displayName) {
              params.push(`CN=${escapeText(attendee.displayName)}`);
            }

            const role = attendee.organizer ? 'CHAIR' : 'REQ-PARTICIPANT';
            params.push(`ROLE=${role}`);

            const partstat = attendee.responseStatus === 'accepted' ? 'ACCEPTED' :
              attendee.responseStatus === 'declined' ? 'DECLINED' :
                attendee.responseStatus === 'tentative' ? 'TENTATIVE' :
                  'NEEDS-ACTION';
            params.push(`PARTSTAT=${partstat}`);

            eventLines.push(
              `ATTENDEE;${params.join(';')}:mailto:${attendee.email}`
            );
          });
        }

        eventLines.push('END:VEVENT');

        icsContent += '\r\n' + eventLines.map(line => foldLine(line)).join('\r\n');
      });

      icsContent += '\r\nEND:VCALENDAR';

      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const blob = new Blob([bom, icsContent], {
        type: 'text/calendar;charset=utf-8'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'calendar_events.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting ICS:', error);
      throw error;
    }
  };
  return (
    // Apply the dark-mode class conditionally to your main container
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      {/* New custom switch positioned above the card */}
      <div className="switch-container" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <label className="theme-switch">
          <input
            type="checkbox"
            className="theme-switch__checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(prev => !prev)}
          />
          <div className="theme-switch__container">
            <div className="theme-switch__clouds"></div>
            <div className="theme-switch__stars-container">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor"></path>
              </svg>
            </div>
            <div className="theme-switch__circle-container">
              <div className="theme-switch__sun-moon-container">
                <div className="theme-switch__moon">
                  <div className="theme-switch__spot"></div>
                  <div className="theme-switch__spot"></div>
                  <div className="theme-switch__spot"></div>
                </div>
              </div>
            </div>
          </div>
        </label>
      </div>

      <div className="card">
        <h1 className="h1">Schedule to Google Calendar</h1>
        <button className="button" onClick={() => apiCalendar.handleAuthClick()}>
          Sign in with Google
        </button>
        <button className="button" onClick={() => apiCalendar.handleSignoutClick()}>
          Sign out
        </button>
        <button className="button" onClick={listEvents}>
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
              placeholder="Quarter (YYYYQ)"
              value={quarter}
              onChange={(e) => setQuarter(e.target.value)}
            />
            <button className="button" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        <button className="button" onClick={addEvent}>
          Convert Schedule to Google Calendar
        </button>
        <div>
          <button className="button" onClick={generateICS}>Export as ICS</button>
        </div>
      </div>
    </div>
  );
}

export default App;