import './App.css';

function App() {
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
              onChange={(e) => console.log("perm:" + e.target.value)}
            />
            <button
              className="button"
              onClick={() => console.log("search")}
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
