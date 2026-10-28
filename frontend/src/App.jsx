import { useState } from "react";
import "./App.css";

const API = "http://localhost:8080/api";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Login and registration
  async function handleAuth(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const endpoint = isRegister
        ? "auth/register"
        : "auth/login";

      const response = await fetch(`${API}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Authentication failed. Check your credentials."
        );
      }

      if (isRegister) {
        setMessage("Registration successful! Please log in.");
        setIsRegister(false);
        setPassword("");
        return;
      }

      if (!data.token) {
        throw new Error("Login succeeded, but no token was returned.");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setMessage("Login successful!");

      await loadCourses(data.token);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Load courses from Spring Boot
  async function loadCourses(authToken = token) {
    if (!authToken) {
      setMessage("Please log in to view your courses.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/courses`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        logout("Your session may have expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error("Could not load courses. Please try again.");
      }

      const data = await response.json();
      setCourses(data);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Logout
  function logout(customMessage = "You have logged out.") {
    localStorage.removeItem("token");
    setToken("");
    setCourses([]);
    setUsername("");
    setPassword("");
    setSearchTerm("");
    setMessage(customMessage);
  }

  // Search courses by name or description
  const filteredCourses = courses.filter((course) => {
    const search = searchTerm.toLowerCase();

    return (
      (course.name || "").toLowerCase().includes(search) ||
      (course.description || "").toLowerCase().includes(search)
    );
  });

  // Login and registration screen
  if (!token) {
    return (
      <div className="app">
        <header className="header">
          <h1>Course Dashboard</h1>
          <p>Your learning, organized.</p>
        </header>

        <main className="auth-card">
          <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>

          <p>
            {isRegister
              ? "Register to get started."
              : "Log in to view your courses."}
          </p>

          <form onSubmit={handleAuth}>
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />

            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                isRegister ? "new-password" : "current-password"
              }
              required
            />

            <button type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : isRegister
                  ? "Register"
                  : "Log In"}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <button
            type="button"
            className="switch-button"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
            }}
          >
            {isRegister
              ? "Already have an account? Log in"
              : "New here? Create an account"}
          </button>
        </main>
      </div>
    );
  }

  // Course dashboard
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Course Dashboard</h1>
            <p>Your learning, organized.</p>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={() => logout()}
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="container">
        <section className="dashboard-heading">
          <div>
            <h2>My Courses</h2>
            <p>Explore and manage your learning.</p>
          </div>

          <button
            type="button"
            onClick={() => loadCourses()}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh Courses"}
          </button>
        </section>

        <section className="course-controls">
          <input
            type="search"
            className="search-input"
            placeholder="Search by course name or description..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search courses"
          />

          <span className="course-count">
            {filteredCourses.length}{" "}
            {filteredCourses.length === 1 ? "course" : "courses"} found
          </span>
        </section>

        {message && <p className="message">{message}</p>}

        {!loading && courses.length === 0 && !message && (
          <div className="empty-state">
            <h3>No courses found yet</h3>
            <p>Add a course through your backend API, then refresh.</p>
          </div>
        )}

        {courses.length > 0 && filteredCourses.length === 0 && (
          <div className="empty-state">
            <h3>No matching courses</h3>
            <p>Try another search term.</p>
          </div>
        )}

        <div className="course-grid">
          {filteredCourses.map((course) => (
            <article className="course-card" key={course.id}>
              <div className="course-icon">📚</div>

              <h3>{course.name}</h3>

              <p>
                {course.description || "No description available."}
              </p>

              <div className="course-card-footer">
                <span>Course ID: {course.id}</span>
                <span className="course-badge">Available</span>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>Course Dashboard · Full Stack Java Capstone</p>
      </footer>
    </div>
  );
}

export default App;