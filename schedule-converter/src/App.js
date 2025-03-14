import "./App.css";
import { useState, useEffect } from "react";
import ApiCalendar from "react-google-calendar-api";

// Quarter options for UCSB course search
const quarterOptions = [
  { label: "Spring 2025", value: "20252" },
  { label: "Winter 2025", value: "20251" },
  { label: "Fall 2024", value: "20244" },
  { label: "Summer 2024", value: "20243" },
  { label: "Spring 2024", value: "20242" },
  { label: "Winter 2024", value: "20241" },
  { label: "Fall 2023", value: "20234" },
];

const options = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10','11'];
const colors_light = ['', '#A4BDFC', '#7AE7BF', '#DBADFF', '#FF887C', '#FBD75B', '#FFB878', '#46D6DB', '#E1E1E1', '#5484ED', '#51B749', '#DC2127'];
// const colors_dark = [];

function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme == null) {
      return window.matchMedia("(prefers-color-scheme:dark)").matches;
    }
    return storedTheme === "dark";
  });

  // UCSB Course Search States
  const [courseSearchQuarter, setCourseSearchQuarter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  // Instead of storing just courses, we now store an object { course, section } per selection.
  const [selectedCourses, setSelectedCourses] = useState([]);
  // For tracking hover state (by courseId)
  // const [hoveredCourseId, setHoveredCourseId] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [reminderStates, setReminderStates] = useState({});
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Google Calendar API configuration
  const config = {
    clientId: "501417308414-jbudfd3caf806utp9c3t1ohl97sab491.apps.googleusercontent.com",
    apiKey: "AIzaSyD-0ML67IBYKOTtWXhnGRZfA-rJJYq2hGw",
    scope: "https://www.googleapis.com/auth/calendar",
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ],
  };
  const apiCalendar = new ApiCalendar(config);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    setIsSignedIn(apiCalendar.sign);
  }, [apiCalendar.sign]);

  useEffect(() => {
    setSelectedCourseId(null);
  }, [courseFilter]);

  const handleAuthClick = () => {
    apiCalendar.handleAuthClick().then(() => {
      setIsSignedIn(apiCalendar.sign);
    }).catch(() => {
      setIsSignedIn(false);
    });
  };

  const handleSignoutClick = () => {
    apiCalendar.handleSignoutClick();
    setIsSignedIn(false);
  };

  // UCSB API key for course search
  const apiKey = "3JXdEElm20bMv3cL5huEvZEB0W6opCo2"; // Replace with actual UCSB API Key

  const fetchQuarterStartDate = async (quarter) => {
    const url = `https://api.ucsb.edu/academics/quartercalendar/v1/quarters?quarter=${quarter}`;
    console.log(`Fetching quarter start date from URL: ${url}`);
    const response = await fetch(url, {
      headers: { "ucsb-api-key": apiKey },
    });
    if (!response.ok) {
      console.error(`API error: ${response.status} - ${response.statusText}`);
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Response:', data);
    
    // The API returns an array of quarters, find the matching quarter
    const quarterData = data.find(q => q.quarter === quarter);
    if (!quarterData) {
      throw new Error(`Quarter ${quarter} not found in response`);
    }
    
    console.log(`Fetched quarter start date: ${quarterData.firstDayOfClasses}`);
    return quarterData.firstDayOfClasses;
  };


  const fetchCourses = async () => {
    if (!courseSearchQuarter) {
      setError("Please select a valid quarter.");
      return;
    }
    setLoading(true);
    setError("");
    setCourses([]);
    setFilteredCourses([]);
    setHasSearched(true);
    try {
      const pageSize = 500;
      const firstPageUrl = `https://api.ucsb.edu/academics/curriculums/v1/classes/search?quarter=${courseSearchQuarter}&pageSize=${pageSize}&pageNumber=1`;
      const firstResponse = await fetch(firstPageUrl, {
        headers: { "ucsb-api-key": apiKey },
      });
      if (!firstResponse.ok)
        throw new Error(`API error: ${firstResponse.status}`);
      const firstData = await firstResponse.json();
      const firstClasses = firstData.classes || [];
      setCourses(firstClasses);
      const total = firstData.total || firstClasses.length;
      const totalPages = Math.ceil(total / pageSize);
      if (totalPages > 1) {
        const pagePromises = [];
        for (let p = 2; p <= totalPages; p++) {
          const pageUrl = `https://api.ucsb.edu/academics/curriculums/v1/classes/search?quarter=${courseSearchQuarter}&pageSize=${pageSize}&pageNumber=${p}`;
          const promise = fetch(pageUrl, {
            headers: { "ucsb-api-key": apiKey },
          })
            .then((res) => {
              if (!res.ok)
                throw new Error(`API error on page ${p}: ${res.status}`);
              return res.json();
            })
            .then((pageData) => {
              const pageClasses = pageData.classes || [];
              setCourses((prevCourses) => [...prevCourses, ...pageClasses]);
            });
          pagePromises.push(promise);
        }
        await Promise.all(pagePromises);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses when the selected quarter changes
  useEffect(() => {
    if (courseSearchQuarter) {
      fetchCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSearchQuarter]);

  // Filter courses based on courseFilter input
  useEffect(() => {
    if (courseFilter.trim() === "") {
      setFilteredCourses([]);
      return;
    }
    const normalizeCourseId = (courseId) =>
      courseId.replace(/\s+/g, "").toLowerCase();
    const normalizedFilter = courseFilter.replace(/\s+/g, "").toLowerCase();

    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(courseFilter.toLowerCase()) ||
        normalizeCourseId(course.courseId).includes(normalizedFilter)
    );

    const sortedFiltered = [...filtered].sort((a, b) => {
      const numA = parseInt(a.courseId.match(/\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.courseId.match(/\d+/)?.[0] || "0", 10);
      return numA - numB;
    });

    setFilteredCourses(sortedFiltered);
  }, [courseFilter, courses]);

  // When selecting a section from the sublist, update the selection for that course.
  const handleSectionSelect = (course, section) => {
    setSelectedCourses((prev) => {
        const existing = prev.find(item => item.course.courseId === course.courseId);
        if (existing) {
            // Check if this section is already selected
            const sectionExists = existing.sections.some(s => s.section === section.section);
            if (sectionExists) {
                // Deselect the section
                const updatedSections = existing.sections.filter(s => s.section !== section.section);
                // If no sections remain, remove the course entry
                if(updatedSections.length === 0) {
                    return prev.filter(item => item.course.courseId !== course.courseId);
                }
                return prev.map(item =>
                    item.course.courseId === course.courseId ? { course, sections: updatedSections } : item
                );
            } else {
                // Add the new section
                return prev.map(item =>
                    item.course.courseId === course.courseId ? { course, sections: [...item.sections, section] } : item
                );
            }
        } else {
            // Add new course with this section
            return [...prev, { course, sections: [section] }];
        }
    });
};

  // Check if a course is selected and return the selected section (if any)
  const getSelectedSection = (course) => {
    return selectedCourses.find(
      (item) => item.course.courseId === course.courseId
    );
  };

  const getSelectedSections = (course) => {
    const found = selectedCourses.find(item => item.course.courseId === course.courseId);
    return found ? found.sections : [];
};

  // Create event using the selected course and its chosen section.
  
  const createEventFromSelectedCourse = (selected, quarterStartDate) => {
    console.log(selected);
    const { course, section } = selected;
  
    if (!section.timeLocations || section.timeLocations.length === 0) {
      throw new Error("No time location found for the section.");
    }
  
    const time = section.timeLocations[0];
    const startDate = new Date(quarterStartDate);
    const [startHour, startMinute] = time.beginTime.split(":").map(Number);
    const [endHour, endMinute] = time.endTime.split(":").map(Number);
    const dayMap = { M: "MO", T: "TU", W: "WE", R: "TH", F: "FR" };
    const days = time.days.split(" ").filter(Boolean);
    const color_Id = selected.color;

    // Find the first class date after the quarter start
    let uniqueStartDate = new Date(startDate);
    let found = false;
  
    for (let i = 0; i < 7; i++) { // Search within the first week
      const tempDate = new Date(startDate);
      tempDate.setDate(startDate.getDate() + i);
      const dayLetter = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][tempDate.getDay()];
      
      if (days.map(d => dayMap[d]).includes(dayLetter)) {
        uniqueStartDate = tempDate;
        found = true;
        break;
      }
    }
  
    if (!found) {
      throw new Error("No valid class start date found after the quarter start.");
    }
  
    // Convert date and time to proper ISO string with timezone adjustments
    const formatDateTime = (date, hour, minute) => {
      date.setHours(hour, minute, 0, 0);
      return new Date(
        date.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
      ).toISOString();
    };
  
    const reminderMinutes = reminderStates[course.courseId] || 10;
    const d = new Date(quarterStartDate);
    const diff = d.getTimezoneOffset();
    console.log(diff/60);
    // const reminderMinutes = reminderStates[course.courseId] || 10;
    return {
      summary: `${course.title} - Section ${section.section || ""}`,
      recurrence: [`RRULE:FREQ=WEEKLY;COUNT=${days.length * 10};BYDAY=${days.map(day => dayMap[day]).join(',')}`],
      start: {
        dateTime: formatDateTime(new Date(uniqueStartDate), startHour, startMinute),
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: formatDateTime(new Date(uniqueStartDate), endHour, endMinute),
        timeZone: "America/Los_Angeles",
      },
      colorId: color_Id,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: reminderMinutes },
        ],
      },
    };
  };
  
  

  const addEvent = async (selectedCourses) => {
    console.log(`Selected quarter: ${courseSearchQuarter}`);
    const quarterStartDate = await fetchQuarterStartDate(courseSearchQuarter);
    // For each course, create an event for each selected section
    selectedCourses.forEach(selected => {
        selected.sections.forEach(section => {
            // Pass the single section along with its course and color info to createEventFromSelectedCourse
            apiCalendar
                .createEvent(createEventFromSelectedCourse({ course: selected.course, section, color: selected.color }, quarterStartDate))
                .then(({ result }) => {
                    console.log(result);
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    });
};

  // Helper function to render summary info from a section (used in both main row and submenu)
  const renderSectionInfo = (section) => {
    if (!section) return "TBA";
    const instructorList =
      section.instructors?.map((inst) => inst.instructor).join(", ") || "TBA";
    const timeLoc = section.timeLocations?.[0];
    const timeInfo = timeLoc
      ? `${timeLoc.days} ${timeLoc.beginTime}-${timeLoc.endTime}`
      : "TBA";
    const locationInfo = timeLoc
      ? `${timeLoc.building} ${timeLoc.room}`
      : "TBA";
    return `${instructorList} | ${timeInfo} | ${locationInfo}`;
  };

  const deleteCourse = async (selectedCourses, courseId) => {
    const updatedCourses = selectedCourses.filter(
      (selected) => selected.course.courseId !== courseId
    );
    setSelectedCourses(updatedCourses);
    console.log("Deleted course: " + courseId);
  };

  function onColorChange(courseId, i) {
    setCheckboxStates((prev) => ({
      ...prev,
      [courseId]: i === prev[courseId] ? null : i,
    }));
    setSelectedCourses((prev) =>
      prev.map((selected) =>
        selected.course.courseId === courseId
          ? { ...selected, color: i }
          : selected
      )
    );
  }
  
  return (
    // Apply the dark-mode class conditionally to your main container
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      {/* New custom switch positioned above the card */}
      {/* <h1 className="h1"style={{ position: "absolute", top: "1rem", left: "2rem" }}>Schedule to Google Calendar</h1> */}
      <div
        className="switch-container"
        style={{ position: "absolute", top: "1rem", right: "2rem" }}
      >
        <label className="theme-switch">
          <input
            type="checkbox"
            className="theme-switch__checkbox"
            checked={darkMode}
            onChange={() => setDarkMode((prev) => !prev)}
          />
          <div className="theme-switch__container">
            <div className="theme-switch__clouds"></div>
            <div className="theme-switch__stars-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 144 55"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z"
                  fill="currentColor"
                ></path>
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

      {/* Schedule to Google Calendar Card */}
      <div style={{ display: "flex" }}>
      {/* Left Card */}
      <div className="card" style={{ flex: "1", marginRight: "1rem", height: "100vh", position: "fixed", left: 0, top: 0, padding: "1rem", boxSizing: "border-box", width: "25rem" }}>
        <h1>Schedule to Google Calendar</h1>
        {isSignedIn ? (
          <button className="button" onClick={handleSignoutClick}>
            Sign out
          </button>
        ) : (
          <button className="button" onClick={handleAuthClick}>
            Sign in with Google
          </button>
        )}
        <div style={{ marginTop: "1rem", position: "relative" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {/* "Select Quarter" */}
            <select
              value={courseSearchQuarter}
              onChange={(e) => setCourseSearchQuarter(e.target.value)}
              className="input"
            >
              <option value="">Select Quarter</option>
              {quarterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* "Filter Courses" */}
            <input
              type="text"
              className="input"
              placeholder="Filter Courses"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            />
          </div>
          {/* Error Message */}
          {error && (
            <div style={{ marginTop: "0.5rem", color: "red" }}>{error}</div>
          )}
          {/* No courses found message (only displays after search is complete) */}
          {!loading && hasSearched && courses.length === 0 && (
            <div style={{ marginTop: "0.5rem" }}>No courses found.</div>
          )}
          {/* Dropdown showing only the top 6 filtered courses */}
          {courseFilter && filteredCourses.length > 0 && (
            <div
              className={`dropdown ${darkMode ? "dark-mode" : ""}`}
            >
              {filteredCourses.map((course) => {
                // FLAG - Removed slice
                // Get default section info (using the first section)
                const defaultSection =
                  (course.classSections && course.classSections[0]) || {};
                // Check if a section is already selected for this course
                const selected = getSelectedSection(course);
                const isSelected = !!selected;
                return (
                  <div
                    key={course.courseId}
                    onClick={() =>
                      setSelectedCourseId(selectedCourseId === course.courseId ? null : course.courseId)
                    }
                    style={{
                      padding: "0.5rem",
                      cursor: "pointer",
                      backgroundColor: selectedCourseId === course.courseId ? (darkMode ? "#FEBC11" : "#e0e0e0") : (darkMode ? "#333" : "#fff"),
                      position: "relative",
                      color: darkMode ? "#f3f3f3" : "#000",
                    }}
                  >
                    {/* Main row shows course title, id and summary info from default section */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedCourseId === course.courseId}
                        readOnly
                        style={{ marginRight: "0.5rem" }}
                      />
                      <span>
                        {course.title} ({course.courseId})
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", marginLeft: "1.75rem" }}>
                      {renderSectionInfo(defaultSection)}
                      {isSelected && selected && selected.section && (
                        <em>
                          {" "}
                          (Selected: Section {selected.section.section})
                        </em>
                      )}
                    </div>
                    {/* Submenu: show list of sections on hover */}
                    {selectedCourseId === course.courseId &&
                      course.classSections &&
                      course.classSections.length > 0 && (
                        <div
                          className="submenu"
                          style={{
                            position: "fixed",
                            top: 200,
                            left: 400,
                            width: "300px", // wider container
                            maxHeight: "300px", // set max-height for scrollable content
                            overflowY: "auto", // enable vertical scrolling
                            background: darkMode ? "#333" : "#f9f9f9",
                            border: "1px solid #ccc",
                            padding: "0.5rem",
                            zIndex: 100,
                            color: darkMode ? "#f3f3f3" : "#000",
                          }}
                        >
                          {course.classSections.map((section) => {
                            // Use the first timeLocation from this section for details
                            const timeLoc = section.timeLocations?.[0] || {};
                            const instructors =
                              section.instructors
                                ?.map((inst) => inst.instructor)
                                .join(", ") || "TBA";
                            const timeInfo = timeLoc.beginTime
                              ? `${timeLoc.days} ${timeLoc.beginTime}-${timeLoc.endTime}`
                              : "TBA";
                            const locationInfo =
                              timeLoc.building && timeLoc.room
                                ? `${timeLoc.building} ${timeLoc.room}`
                                : "TBA";
                            // Check if a section is selected for the course
                            const selectedSections = getSelectedSections(course);
                            const isSectionSelected = selectedSections.some(s => s.section === section.section);
                            return (
                              <div
                                key={section.enrollCode}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSectionSelect(course, section)
                                }}
                                style={{
                                  padding: "0.25rem 0.5rem",
                                  background: isSectionSelected
                                    ? (darkMode ? "#FEBC11" : "#d0d0d0")
                                    : "transparent",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  color: darkMode ? "#f3f3f3" : "#000",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSectionSelected}
                                  readOnly
                                  style={{ marginRight: "0.5rem" }}
                                />
                                <div>
                                  <strong>Section {section.section}:</strong>{" "}
                                  {instructors} | {timeInfo} | {locationInfo}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <button
          className="button"
          onClick={() => addEvent(selectedCourses)}
        >
          Convert Schedule to Google Calendar
        </button>
        </div>

        {/* Display selected courses with chosen section details */}
        <div style={{ flex: "2", marginLeft: "27rem", padding: "1rem", boxSizing: "border-box", width: "calc(100% - 27rem)" }}>
          {selectedCourses.length > 0 && (
            <div>
              <h2>Selected Courses:</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {selectedCourses.map(({ course, sections }) => (
                  <div key={course.courseId} className="card" style={{ padding: "1rem", boxSizing: "border-box", width: "calc(33.33% - 1rem)" }}>
                    <h3>{course.title} ({course.courseId})</h3>
                    {sections.map(section => {
                      const instructors = section.instructors?.map(inst => inst.instructor).join(", ") || "TBA";
                      const timeLoc = section.timeLocations?.[0] || {};
                      const timeInfo = timeLoc.beginTime ? `${timeLoc.days} ${timeLoc.beginTime}-${timeLoc.endTime}` : "TBA";
                      const locationInfo = (timeLoc.building && timeLoc.room) ? `${timeLoc.building} ${timeLoc.room}` : "TBA";
                      return (
                        <div key={section.enrollCode}>
                          <p>Section {section.section}</p>
                          <p>Instructors: {instructors}</p>
                          <p>Time: {timeInfo}</p>
                          <p>Location: {locationInfo}</p>
                        </div>
                      )
                    })}
                    <button className="button" onClick={() => deleteCourse(selectedCourses, course.courseId)}>
                      Delete Course
                    </button>
                    <p>Event Color: </p>
                    {options.map((o, i) => (
                      <div key={i} style={{ display: 'inline-block', padding: '2px', backgroundColor: colors_light[i] }}>
                        <input
                          type="checkbox"
                          checked={i === checkboxStates[course.courseId]}
                          onChange={() => onColorChange(course.courseId, i)}
                          style={{ accentColor: colors_light[i] }}
                        />
                      </div>
                    ))}
                    <p>Reminder Minutes: </p>
                    <input
                      type="number"
                      value={reminderStates[course.courseId] ?? "" }  // default is 10 minutes
                      min="0"
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setReminderStates((prev) => ({
                          ...prev,
                          [course.courseId]: newValue === "" ? "" : parseInt(newValue, 10),
                        }));
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          setReminderStates((prev) => ({
                            ...prev,
                            [course.courseId]: 10,
                          }));
                        }
                      }}
                      style={{ width: "50px" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default App;