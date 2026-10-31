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

  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseDuration, setCourseDuration] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDuration, setEditDuration] = useState("");

  // Login and Registration
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
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Authentication failed."
        );
      }

      if (isRegister) {
        setMessage("Registration successful! Please log in.");
        setIsRegister(false);
        setPassword("");
        return;
      }

      if (!data.token) {
        throw new Error("No token received.");
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

  // Load Courses
  async function loadCourses(authToken = token) {
    if (!authToken) return;

    setLoading(true);

    try {
      const response = await fetch(`${API}/courses`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        logout("Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error("Could not load courses.");
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

  // Add Course
  async function handleAddCourse(event) {
    event.preventDefault();
    setMessage("");

    if (!courseName.trim()) {
      setMessage("Please enter a course name.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: courseName,
          description: courseDescription,
          duration: courseDuration,
        }),
      });

      if (!response.ok) {
        throw new Error("Course could not be added.");
      }

      setCourseName("");
      setCourseDescription("");
      setCourseDuration("");
      setMessage("Course added successfully!");

      await loadCourses();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Start Editing
  function startEdit(course) {
    setEditingId(course.id);
    setEditName(course.name || "");
    setEditDescription(course.description || "");
    setEditDuration(course.duration || "");
    setMessage("");
  }

  // Cancel Editing
  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    setEditDuration("");
  }

  // Update Course
  async function handleUpdateCourse(event, id) {
    event.preventDefault();
    setMessage("");

    if (!editName.trim()) {
      setMessage("Please enter a course name.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          duration: editDuration,
        }),
      });

      if (!response.ok) {
        throw new Error("Course could not be updated.");
      }

      cancelEdit();
      setMessage("Course updated successfully!");

      await loadCourses();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Delete Course
  async function handleDeleteCourse(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Course could not be deleted.");
      }

      setMessage("Course deleted successfully!");
      await loadCourses();
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
    cancelEdit();
    setMessage(customMessage);
  }

  // Search Courses
  const filteredCourses = courses.filter((course) => {
    const search = searchTerm.toLowerCase();

    return (
      (course.name || "").toLowerCase().includes(search) ||
      (course.description || "").toLowerCase().includes(search) ||
      (course.duration || "").toLowerCase().includes(search)
    );
  });

  // Login Screen
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
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

  // Dashboard
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
            Refresh Courses
          </button>
        </section>

        {/* Add Course */}
        <section className="course-form">
          <h2>Add New Course</h2>

          <form onSubmit={handleAddCourse}>
            <label htmlFor="courseName">Course Name</label>
            <input
              id="courseName"
              type="text"
              placeholder="Enter course name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />

            <label htmlFor="courseDescription">Description</label>
            <textarea
              id="courseDescription"
              placeholder="Enter course description"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
            />

            <label htmlFor="courseDuration">Course Duration</label>
            <input
              id="courseDuration"
              type="text"
              placeholder="Example: 8 weeks"
              value={courseDuration}
              onChange={(e) => setCourseDuration(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              Add Course
            </button>
          </form>
        </section>

        {message && <p className="message">{message}</p>}

        {/* Search */}
        <section className="course-controls">
          <input
            type="search"
            className="search-input"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <span className="course-count">
            {filteredCourses.length} courses found
          </span>
        </section>

        {!loading && courses.length === 0 && (
          <div className="empty-state">
            <h3>No courses found yet</h3>
            <p>Add your first course above.</p>
          </div>
        )}

        {courses.length > 0 && filteredCourses.length === 0 && (
          <div className="empty-state">
            <h3>No matching courses</h3>
            <p>Try another search term.</p>
          </div>
        )}

        {/* Course List */}
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <article className="course-card" key={course.id}>
              {editingId === course.id ? (
                <form
                  onSubmit={(event) =>
                    handleUpdateCourse(event, course.id)
                  }
                >
                  <h3>Edit Course</h3>

                  <label>Course Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />

                  <label>Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />

                  <label>Course Duration</label>
                  <input
                    type="text"
                    placeholder="Example: 8 weeks"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                  />

                  <button type="submit" disabled={loading}>
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div className="course-icon">📚</div>

                  <h3>{course.name}</h3>

                  <p>
                    {course.description || "No description available."}
                  </p>

                  <p>
                    <strong>Duration:</strong>{" "}
                    {course.duration || "Not specified"}
                  </p>

                  <div className="course-card-footer">
                    <span>Course ID: {course.id}</span>
                    <span className="course-badge">Available</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => startEdit(course)}
                    disabled={loading}
                  >
                    Edit Course
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteCourse(course.id)}
                    disabled={loading}
                  >
                    Delete Course
                  </button>
                </>
              )}
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