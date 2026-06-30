import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
// analytics 
// Analytics Pages
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";
import Achievements from "./pages/analytics/Achievements";
import Badges from "./pages/analytics/Badges";
import Rewards from "./pages/analytics/Rewards";

// Analytics Context
import AnalyticsProvider from "./context/AnalyticsContext";
// Community Pages
import CommunityHome from "./pages/community/CommunityHome";
import DiscussionsPage from "./pages/community/DiscussionPage";
import DiscussionDetails from "./pages/community/DiscussionDetails";
import CreateDiscussion from "./pages/community/CreateDiscussion";
import StudyGroupsPage from "./pages/community/StudyGroupPage";
import GroupDetails from "./pages/community/GroupDetails";
import CreateGroup from "./pages/community/CreateGroup";
import { CommunityProvider } from "./context/CommunityContext";
// Contests Pages
import ContestList from "./pages/contests/ContextList";
import ContestDetails from "./pages/contests/ContestDetails";
import JoinContest from "./pages/contests/JoinContest";
import MyContests from "./pages/contests/MyContests";
import Leaderboard from "./pages/contests/LeaderboardPage";
import { ContestProvider } from "./context/ContestContext";
// Dashboard
import Dashboard from "./pages/Dashboard";
// Mock Tests
import TestsPage from "./pages/tests/TestPage";
import TestDetails from "./pages/tests/TestDetails";
import MySubmissions from "./pages/tests/MySubmission";
// Question Bank
import Topics from "./pages/QuestionBank/Topics";
import Companies from "./pages/QuestionBank/Companies";
import Questions from "./pages/QuestionBank/Questions";
import QuestionDetails from "./pages/QuestionBank/QuestionDetails";

// Interview Pages
import StartInterview from "./pages/interviews/StartInterview";
import MyInterviews from "./pages/interviews/MyInterviews";
import InterviewDetails from "./pages/interviews/InterviewDetails";
import FeedbackScreen from "./pages/interviews/FeedbackScreen";

// Resume Pages
import ResumeAnalyzer from "./pages/resume/ResumeAnalyzer";
import ResumeReport from "./pages/resume/ResumeReport";

// Coding Pages
import CodingProblems from "./pages/coding/CodingProblems";
import ProblemDetails from "./pages/coding/ProblemDetails";
import SubmissionHistory from "./pages/coding/SubmissionHistory";

// Profile Pages
import Profile from "./pages/profiles/Profile";
import CreateProfile from "./pages/profiles/CreateProfile";
import EditProfile from "./pages/profiles/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Interview */}
        <Route
          path="/interviews"
          element={
            <ProtectedRoute>
              <MyInterviews />
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
          path="/interviews/:id"
          element={
            <ProtectedRoute>
              <InterviewDetails />
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

        {/* Coding */}
        <Route
          path="/coding"
          element={
            <ProtectedRoute>
              <CodingProblems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coding/:id"
          element={
            <ProtectedRoute>
              <ProblemDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coding/submissions"
          element={
            <ProtectedRoute>
              <SubmissionHistory />
            </ProtectedRoute>
          }
        />

        {/* Resume */}
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

        {/* Profile */}
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

        {/* Mock Tests */}
        <Route
          path="/tests"
          element={
            <ProtectedRoute>
              <TestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tests/:id"
          element={
            <ProtectedRoute>
              <TestDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tests/submissions"
          element={
            <ProtectedRoute>
              <MySubmissions />
            </ProtectedRoute>
          }
        />

        {/* Question Bank */}

        <Route
          path="/question-bank/topics"
          element={
            <ProtectedRoute>
              <Topics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/question-bank/companies"
          element={
            <ProtectedRoute>
              <Companies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/question-bank/questions"
          element={
            <ProtectedRoute>
              <Questions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/question-bank/questions/:id"
          element={
            <ProtectedRoute>
              <QuestionDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions"
          element={
            <ProtectedRoute>
              <Questions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions/:id"
          element={
            <ProtectedRoute>
              <QuestionDetails />
            </ProtectedRoute>
          }
        />
        {/* ========================= COMMUNITY ========================= */}

        <Route
          element={
            <CommunityProvider>
              <Outlet />
            </CommunityProvider>
          }
        >
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <CommunityHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/community/discussions"
            element={
              <ProtectedRoute>
                <DiscussionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/community/discussions/:id"
            element={
              <ProtectedRoute>
                <DiscussionDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/community/create-discussion"
            element={
              <ProtectedRoute>
                <CreateDiscussion />
              </ProtectedRoute>
            }
          />

          <Route
            path="/community/groups"
            element={
              <ProtectedRoute>
                <StudyGroupsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/community/groups/:id"
            element={
              <ProtectedRoute>
                <GroupDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/community/create-group"
            element={
              <ProtectedRoute>
                <CreateGroup />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ========================= CONTESTS ========================= */}
        <Route
          element={
            <ContestProvider>
              <Outlet />
            </ContestProvider>
          }
        >
          <Route
            path="/contests"
            element={
              <ProtectedRoute>
                <ContestList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contests/:id"
            element={
              <ProtectedRoute>
                <ContestDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contests/join/:id"
            element={
              <ProtectedRoute>
                <JoinContest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contests/my"
            element={
              <ProtectedRoute>
                <MyContests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contests/:id/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* ========================= ANALYTICS ========================= */}

<Route
  element={
    <AnalyticsProvider>
      <Outlet />
    </AnalyticsProvider>
  }
>
  <Route
    path="/analytics"
    element={
      <ProtectedRoute>
        <AnalyticsDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/achievements"
    element={
      <ProtectedRoute>
        <Achievements />
      </ProtectedRoute>
    }
  />

  <Route
    path="/badges"
    element={
      <ProtectedRoute>
        <Badges />
      </ProtectedRoute>
    }
  />

  <Route
    path="/rewards"
    element={
      <ProtectedRoute>
        <Rewards />
      </ProtectedRoute>
    }
  />
</Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;