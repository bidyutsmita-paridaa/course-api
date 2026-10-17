import { useState } from "react";
import "./App.css";

const API = "http://localhost:8080/api";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  async function handleAuth(event) {
    event.preventDefault();
    setMessage("");

    try {
      const endpoint = isRegister ? "auth/register" : "auth/login";

      const response = await fetch(`${API}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || "Authentication failed.");
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
    }
  }

  async function loadCourses(authToken = token) {
    try {
      const response = await fetch(`${API}/courses`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        throw new Error("Could not load courses. Please log in again.");
      }

      setCourses(await response.json());
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setCourses([]);
    setUsername("");
    setPassword("");
    setMessage("You have logged out.");
  }

  if (!token) {
    return (
      <div className="app">
        <header className="header">
          <h1>Course Dashboard</h1>
          <p>Your learning, organized.</p>
        </header>

        <main className="auth-card">
          <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
          <p>{isRegister ? "Register to get started." : "Log in to view your courses."}</p>

          <form onSubmit={handleAuth}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isRegister ? "new-password" : "current-password"}
            />

            <button type="submit">
              {isRegister ? "Register" : "Log In"}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <button
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

  return (
    <div className="app">
      <header className="header">
        <h1>Course Dashboard</h1>
        <p>Your learning, organized.</p>
        <button className="logout-button" onClick={logout}>Log Out</button>
      </header>

      <main className="container">
        <h2>My Courses</h2>
        <button onClick={() => loadCourses()}>Refresh Courses</button>

        {message && <p className="message">{message}</p>}

        {courses.length === 0 && <p>No courses found yet.</p>}

        <div className="course-grid">
          {courses.map((course) => (
            <article className="course-card" key={course.id}>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <span>Course ID: {course.id}</span>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;