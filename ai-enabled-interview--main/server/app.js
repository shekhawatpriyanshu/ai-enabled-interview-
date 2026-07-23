const requestLogger = require("./middlewares/requestLogger");
const errorHandler = require("./middlewares/errorHandler");
const compression = require("compression");
const helmet=require('helmet')
const adminAchievementRoutes = require("./admin/routes/adminAchievementRoutes");
const adminRewardRoutes = require("./admin/routes/adminRewardRoutes");
const adminBadgeRoutes = require("./admin/routes/adminBadgeRoutes");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const questionRoutes = require(
  "./routes/questionRoutes"
);
const adminAuthRoutes = require("./admin/routes/adminAuthRoutes");
const userManagementRoutes=require('./admin/routes/userManagementRoutes')
const path = require("path");
const adminCommunityRoutes = require(
 "./admin/routes/adminCommunityRoutes"
);
// coding admin
const codingAdminRoutes =
require("./admin//routes/codingAdminRoutes");
const adminQuestionRoutes = require("./admin/routes/questionAdminRoutes");
const adminTestRoutes=require('./admin/routes/adminTestRoutes')
const test=require('./routes/testRoutes')
const resumeRoutes = require(
  "./routes/resumeRoutes"
);
const adminAnalyticsRoutes =
require("./admin/routes/adminAnalyticsRoutes");
const adminContestRoutes = require("./admin/routes/contestAdminRoutes");
const interviewRoutes =
require("./routes/interviewRoutes");
const analyticsRoutes =
  require("./routes/analyticsRoutes");

  
  const codingUserRoutes = require("./routes/codingRoutes");
 
 
 const contestRoutes = require("./routes/contestRoutes");
 const userRoutes = require("./routes/userRoutes");
 const authRoutes = require("./routes/authRoutes");
 const communityRoutes =
 require("./routes/communityRoutes");
 
 const adminInterviewRoutes = require("./admin/routes/interviewRoutes");
 
 const app = express();
 app.use(helmet());
 app.use(compression());
 app.use(
   cors({
     origin: [
       "http://localhost:5173",
       "http://localhost:3000",
       "http://127.0.0.1:5173",
       "https://ai-enabled-interview-1.onrender.com",
       "https://ai-enabled-interview.onrender.com"
     ],
     credentials: true,
   })
 );
 app.use(cookieParser());
 app.use(express.json());
 app.use(
   "/uploads",
   express.static(
    path.join(__dirname, "uploads")
  )
);
app.use(
  "/api/coding",
  codingUserRoutes
);
app.use("/api/admin/questions", adminQuestionRoutes);


app.use(
  "/api/admin/coding",
  codingAdminRoutes
);
// admin middlewares used here 
app.use("/api/admin/auth", adminAuthRoutes);
app.use('/api/admin/users',userManagementRoutes)
app.use("/api/admin/interviews", adminInterviewRoutes);


app.use(
  "/api/admin/achievement",
  adminAchievementRoutes
);
app.use(requestLogger);

app.use(
  "/api/admin/rewards",
  adminRewardRoutes
);

app.use(
  "/api/admin/badges",
  adminBadgeRoutes
);

app.use(
 "/api/admin/community",
 adminCommunityRoutes
);
app.use(
  "/api/analytics",
  analyticsRoutes
);


app.use(
"/api/admin/analytics",
adminAnalyticsRoutes
);
app.use('/api/admin/tests',adminTestRoutes)
app.use("/api/users", userRoutes);
app.use('/api/auth',authRoutes)
app.use(
  "/api/community",
  communityRoutes
);
app.use(
  "/api/questions",
  questionRoutes
);
app.use('/api/contests',contestRoutes)
app.use("/api/test",test)
app.use(
  "/api/resumes",
  resumeRoutes
);


app.use(
  "/api/admin/contests",
  adminContestRoutes
);
app.use(
  "/api/interviews",
  interviewRoutes
);


app.get("/", (req, res) => {
  res.send("LeetChef API Running");
});

app.use(errorHandler);

module.exports = app;