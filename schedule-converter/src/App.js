import './App.css';
import { useState } from 'react';

function App() {
  const [permNumber, setPermNumber] = useState('');
  const [data, setData] = useState([]);

  const handleSearch = () => {
    fetch('/database.json')
      .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();  // Changed to text() to see raw response
      })
      .then(text => {
        console.log('Raw response:', text);
        // const json = JSON.parse(text);
        // const filteredData = json.filter(item => {
        //   return String(item.perm) === permNumber;
        // });
        // setData(filteredData);
        // console.log('Filtered data:', filteredData);
      })
      .catch(error => {
        console.error('Error details:', error);
      });
  };

  return (
    <div className="App">
      <div className="card">
        <h1 className="h1">Schedule to Google Calendar</h1>
        <button className="button"
          onClick={() => console.log("google oauth button clicked")}
        >
          Sign in with Google
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
