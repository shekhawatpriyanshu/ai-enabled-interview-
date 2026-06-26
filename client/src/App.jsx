import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import StartInterview from "./pages/interviews/StartInterview";
import MyInterviews from "./pages/interviews/MyInterviews";
import InterviewDetails from "./pages/interviews/InterviewDetails";
import FeedbackScreen from "./pages/interviews/FeedbackScreen";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResumeAnalyzer from "./pages/resume/ResumeAnalyzer";
import ResumeReport from "./pages/resume/ResumeReport";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import Profile from "./pages/profiles/Profile";
import CreateProfile from "./pages/profiles/CreateProfile";
import EditProfile from "./pages/profiles/EditProfile";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
   <Route
  path="/interviews/start"
  element={
    <ProtectedRoute>
      <StartInterview />
    </ProtectedRoute>
  }
/>

<Route
  path="/interviews"
  element={
    <ProtectedRoute>
      <MyInterviews />
    </ProtectedRoute>
  }
/>

<Route
  path="/interviews/:id"
  element={
    <ProtectedRoute>
      <InterviewDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/resume-analyzer"
  element={
    <ProtectedRoute>
      <ResumeAnalyzer />
    </ProtectedRoute>
  }
/>

<Route
  path="/resume-report/:id"
  element={
    <ProtectedRoute>
      <ResumeReport />
    </ProtectedRoute>
  }
/>
<Route
  path="/interviews/feedback/:id"
  element={
    <ProtectedRoute>
      <FeedbackScreen />
    </ProtectedRoute>
  }
/>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/create"
          element={
            <ProtectedRoute>
              <CreateProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;