import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));

// Analytics Pages
const AnalyticsDashboard = lazy(() => import("./pages/analytics/AnalyticsDashboard"));
const Achievements = lazy(() => import("./pages/analytics/Achievements"));
const Badges = lazy(() => import("./pages/analytics/Badges"));
const Rewards = lazy(() => import("./pages/analytics/Rewards"));

// Analytics Context
import AnalyticsProvider from "./context/AnalyticsContext";

// Community Pages
const CommunityHome = lazy(() => import("./pages/community/CommunityHome"));
const DiscussionsPage = lazy(() => import("./pages/community/DiscussionPage"));
const DiscussionDetails = lazy(() => import("./pages/community/DiscussionDetails"));
const CreateDiscussion = lazy(() => import("./pages/community/CreateDiscussion"));
const StudyGroupsPage = lazy(() => import("./pages/community/StudyGroupPage"));
const GroupDetails = lazy(() => import("./pages/community/GroupDetails"));
const CreateGroup = lazy(() => import("./pages/community/CreateGroup"));
import { CommunityProvider } from "./context/CommunityContext";

// Contests Pages
const ContestList = lazy(() => import("./pages/contests/ContextList"));
const ContestDetails = lazy(() => import("./pages/contests/ContestDetails"));
const JoinContest = lazy(() => import("./pages/contests/JoinContest"));
const MyContests = lazy(() => import("./pages/contests/MyContests"));
const Leaderboard = lazy(() => import("./pages/contests/LeaderboardPage"));
import { ContestProvider } from "./context/ContestContext";

// Dashboard
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Mock Tests
const TestsPage = lazy(() => import("./pages/tests/TestPage"));
const TestDetails = lazy(() => import("./pages/tests/TestDetails"));
const TestOverview = lazy(() => import("./pages/tests/TestOverview"));
const MySubmissions = lazy(() => import("./pages/tests/MySubmission"));

// Question Bank
const Topics = lazy(() => import("./pages/QuestionBank/Topics"));
const Companies = lazy(() => import("./pages/QuestionBank/Companies"));
const Questions = lazy(() => import("./pages/QuestionBank/Questions"));
const QuestionDetails = lazy(() => import("./pages/QuestionBank/QuestionDetails"));

// Interview Pages
const StartInterview = lazy(() => import("./pages/interviews/StartInterview"));
const MyInterviews = lazy(() => import("./pages/interviews/MyInterviews"));
const InterviewDetails = lazy(() => import("./pages/interviews/InterviewDetails"));
const FeedbackScreen = lazy(() => import("./pages/interviews/FeedbackScreen"));

// Resume Pages
const ResumeAnalyzer = lazy(() => import("./pages/resume/ResumeAnalyzer"));
const ResumeReport = lazy(() => import("./pages/resume/ResumeReport"));

// Coding Pages
const CodingProblems = lazy(() => import("./pages/coding/CodingProblems"));
const ProblemDetails = lazy(() => import("./pages/coding/ProblemDetails"));
const SubmissionHistory = lazy(() => import("./pages/coding/SubmissionHistory"));

// Profile Pages
const Profile = lazy(() => import("./pages/profiles/Profile"));
const CreateProfile = lazy(() => import("./pages/profiles/CreateProfile"));
const EditProfile = lazy(() => import("./pages/profiles/EditProfile"));

// Auth (Admin)
const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./admin/pages/Dashboard"));
const Users = lazy(() => import("./admin/pages/users/Users"));
const UserDetails = lazy(() => import("./admin/pages/users/UserDetails"));
const EditUser = lazy(() => import("./admin/pages/users/EditUser"));
const Interviews = lazy(() => import("./admin/pages/interview/Interviews"));
const CodingList = lazy(() => import("./admin/pages/coding/codingList"));
const AddCoding = lazy(() => import("./admin/pages/coding/AddCoding"));
const EditCoding = lazy(() => import("./admin/pages/coding/EditCoding"));
const CodingDetails = lazy(() => import("./admin/pages/coding/CodingDetails"));

const QuestionList = lazy(() => import("./admin/pages/questionBank/QuestionList"));
const AddQuestion = lazy(() => import("./admin/pages/questionBank/AddQuestion"));
const EditQuestion = lazy(() => import("./admin/pages/questionBank/EditQuestion"));
const AdminQuestionDetails = lazy(() => import("./admin/pages/questionBank/QuestionDetails"));
const TopicManagement = lazy(() => import("./admin/pages/questionBank/TopicManagement"));
const CompanyManagement = lazy(() => import("./admin/pages/questionBank/CompanyManagement"));

// Admin Mock Test Pages
const MockTestList = lazy(() => import("./admin/pages/mockTest/MockTestList"));
const AddMockTest = lazy(() => import("./admin/pages/mockTest/AddMockTest"));
const EditMockTest = lazy(() => import("./admin/pages/mockTest/EditMockTest"));
const MockTestDetails = lazy(() => import("./admin/pages/mockTest/MockTestDetails"));

// Admin Achievement Pages
const AchievementList = lazy(() => import("./admin/pages/achievement/AchievementList"));
const AddAchievement = lazy(() => import("./admin/pages/achievement/AddAchievement"));
const EditAchievement = lazy(() => import("./admin/pages/achievement/EditAchievement"));
const AchievementDetails = lazy(() => import("./admin/pages/achievement/AchievementDetails"));

// Admin Reward Pages
const RewardDashboard = lazy(() => import("./admin/pages/reward/RewardDashboard"));
const RewardList = lazy(() => import("./admin/pages/reward/RewardList"));
const RewardDetails = lazy(() => import("./admin/pages/reward/RewardDetails"));
const GiveReward = lazy(() => import("./admin/pages/reward/GiveRewards"));

// Admin Badge Pages
const BadgeManagement = lazy(() => import("./admin/pages/badge/BadgeManagement"));

// Admin Contest Pages
const AdminContestList = lazy(() => import("./admin/pages/contest/ContestList"));
const AddContest = lazy(() => import("./admin/pages/contest/AddContest"));
const EditContest = lazy(() => import("./admin/pages/contest/EditContest"));
const AdminContestDetails = lazy(() => import("./admin/pages/contest/ContestDetails"));
const ContestLeaderboard = lazy(() => import("./admin/pages/contest/ContestLeaderboard"));
const ContestParticipants = lazy(() => import("./admin/pages/contest/ContestParticipation"));

// Admin Community Pages
const AdminCommunityDashboard = lazy(() => import("./admin/pages/community/CommunityDashboard"));
const AdminDiscussionList = lazy(() => import("./admin/pages/community/DiscussionList"));
const AdminDiscussionDetails = lazy(() => import("./admin/pages/community/DiscussionDetails"));
const AdminCommentList = lazy(() => import("./admin/pages/community/CommentList"));
const AdminGroupList = lazy(() => import("./admin/pages/community/GroupList"));
const AdminGroupDetails = lazy(() => import("./admin/pages/community/GroupDetails"));
const AdminEditGroup = lazy(() => import("./admin/pages/community/EditGroup"));
const AdminMessageList = lazy(() => import("./admin/pages/community/MessageList"));
const AdminAnalytics = lazy(() => import("./admin/pages/community/Analytics"));

// Admin Analytics
const AdminAnalyticsDashboard = lazy(() => import("./admin/pages/analytics/AnalyticsDashboard"));
const AdminUserAnalytics = lazy(() => import("./admin/pages/analytics/UserAnalytics"));
const AdminInterviewAnalytics = lazy(() => import("./admin/pages/analytics/InterviewAnalytics"));
const AdminCodingAnalytics = lazy(() => import("./admin/pages/analytics/CodingAnalytics"));
const AdminResumeAnalytics = lazy(() => import("./admin/pages/analytics/ResumeAnalytics"));

import AdminLayout from "./admin/layout/Adminlayout";
import AdminRoute from "./admin/routes/AdminRoute";
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";


const PageLoader = () => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#0b0f19",
    color: "#38bdf8",
    fontFamily: "sans-serif"
  }}>
    <div style={{
      width: "48px",
      height: "48px",
      border: "3px solid rgba(56, 189, 248, 0.1)",
      borderTop: "3px solid #38bdf8",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "16px"
    }} />
    <span style={{ fontSize: "14px", fontWeight: 500, letterSpacing: "0.05em", opacity: 0.8 }}>Loading...</span>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

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
              <TestOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tests/:id/attempt"
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
    <Route
      path="/admin/login"
      element={<AdminLogin />}
    />

    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }
    >
      <Route
        index
        element={<AdminDashboard />}
      />
      <Route
        path="users"
        element={<Users />}
      />
      <Route
        path="users/:id"
        element={<UserDetails />}
      />
      <Route
        path="users/edit/:id"
        element={<EditUser />}
      />
      <Route
        path="interviews"
        element={<Interviews />}
      />
      <Route
        path="coding"
        element={<CodingList />}
      />
      <Route
        path="coding/add"
        element={<AddCoding />}
      />
      <Route
        path="coding/edit/:id"
        element={<EditCoding />}
      />
      <Route
        path="coding/:id"
        element={<CodingDetails />}
      />
      <Route
        path="questions"
        element={<QuestionList />}
      />
      <Route
        path="questions/add"
        element={<AddQuestion />}
      />
      <Route
        path="questions/edit/:id"
        element={<EditQuestion />}
      />
      <Route
        path="questions/view/:id"
        element={<AdminQuestionDetails />}
      />
      <Route
        path="questions/topics"
        element={<TopicManagement />}
      />
      <Route
        path="questions/companies"
        element={<CompanyManagement />}
      />
      <Route
        path="mock-tests"
        element={<MockTestList />}
      />
      <Route
        path="mock-tests/add"
        element={<AddMockTest />}
      />
      <Route
        path="mock-tests/edit/:id"
        element={<EditMockTest />}
      />
      <Route
        path="mock-tests/:id"
        element={<MockTestDetails />}
      />
      <Route
        path="contests"
        element={<AdminContestList />}
      />
      <Route
        path="contests/add"
        element={<AddContest />}
      />
      <Route
        path="contests/edit/:id"
        element={<EditContest />}
      />
      <Route
        path="contests/:id"
        element={<AdminContestDetails />}
      />
      <Route
        path="contests/:id/participants"
        element={<ContestParticipants />}
      />
      <Route
        path="contests/:id/leaderboard"
        element={<ContestLeaderboard />}
      />

      {/* Achievements Management */}
      <Route
        path="achievement"
        element={<AchievementList />}
      />
      <Route
        path="achievement/add"
        element={<AddAchievement />}
      />
      <Route
        path="achievement/edit/:id"
        element={<EditAchievement />}
      />
      <Route
        path="achievement/:id"
        element={<AchievementDetails />}
      />

      {/* Rewards Management */}
      <Route
        path="rewards"
        element={<RewardList />}
      />
      <Route
        path="rewards/dashboard"
        element={<RewardDashboard />}
      />
      <Route
        path="rewards/give"
        element={<GiveReward />}
      />
      <Route
        path="rewards/:id"
        element={<RewardDetails />}
      />

      <Route
        path="badges"
        element={<BadgeManagement />}
      />

      {/* Community Management */}
      <Route
        path="community"
        element={<AdminCommunityDashboard />}
      />
      <Route
        path="community/discussions"
        element={<AdminDiscussionList />}
      />
      <Route
        path="community/discussion/:id"
        element={<AdminDiscussionDetails />}
      />
      <Route
        path="community/comments"
        element={<AdminCommentList />}
      />
      <Route
        path="community/groups"
        element={<AdminGroupList />}
      />
      <Route
        path="community/group/:id"
        element={<AdminGroupDetails />}
      />
      <Route
        path="community/group/edit/:id"
        element={<AdminEditGroup />}
      />
      <Route
        path="community/messages"
        element={<AdminMessageList />}
      />
      <Route
        path="community/analytics"
        element={<AdminAnalytics />}
      />

      {/* Admin Analytics */}
      <Route
        path="analytics"
        element={<AdminAnalyticsDashboard />}
      />
      <Route
        path="analytics/users"
        element={<AdminUserAnalytics />}
      />
      <Route
        path="analytics/interviews"
        element={<AdminInterviewAnalytics />}
      />
      <Route
        path="analytics/coding"
        element={<AdminCodingAnalytics />}
      />
      <Route
        path="analytics/resume"
        element={<AdminResumeAnalytics />}
      />
      <Route
        path="analytics/resumes"
        element={<AdminResumeAnalytics />}
      />
    </Route>

      </Routes>
        </Suspense>
    </BrowserRouter>
  </AdminAuthProvider>
  );
}

export default App;