// import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import courses from "./course_database.json";

function App() {

  const [randomCourses, setRandomCourses] = useState([]);
  
  const getRandomIndexes = (count, max) => {
    const indexes = new Set();
    while (indexes.size < count) {
      const randomIndex = Math.floor(Math.random() * max);
      indexes.add(randomIndex);
    }
    return Array.from(indexes);
  };

  const getRandomCourses = () => {
    const indexes = getRandomIndexes(Math.floor(Math.random() * 3) + 3, courses.length);
    const selectedCourses = indexes.map((index) => courses[index]);
    setRandomCourses(selectedCourses);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Tests for the Fake DataBase!
        </p>
        <a
          className="App-link"
          href="https://github.com/ucsb-cs148-w25/pj01-scheduleconverter"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repo
        </a>
        <p></p>
        <input
          type="number"
          placeholder="Enter your perm number"
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={getRandomCourses}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Generate Random Courses from DataBase
        </button>
        {randomCourses.length > 0 && (
          <table
            style={{
              borderCollapse: "collapse",
              width: "80%",
              margin: "20px auto",
              backgroundColor: "#282c34",
              color: "#61dafb",
            }}
          >
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Course Name</th>
                <th style={tableHeaderStyle}>Professor</th>
                <th style={tableHeaderStyle}>Start Time</th>
                <th style={tableHeaderStyle}>End Time</th>
                <th style={tableHeaderStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {randomCourses.map((course) => (
                <tr key={course.id}>
                  <td style={tableCellStyle}>{course.name}</td>
                  <td style={tableCellStyle}>{course.professor}</td>
                  <td style={tableCellStyle}>{course.start}</td>
                  <td style={tableCellStyle}>{course.end}</td>
                  <td style={tableCellStyle}>{course.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </header>
    </div>
  );
}

const tableHeaderStyle = {
  padding: "10px",
  border: "1px solid #61dafb",
  fontWeight: "bold",
  textAlign: "center",
};

const tableCellStyle = {
  padding: "8px",
  border: "1px solid #61dafb",
  textAlign: "center",
};

export default App;
