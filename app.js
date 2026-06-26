const express = require("express");
const cors = require("cors");
const questionRoutes = require(
  "./routes/questionRoutes"
);

const path = require("path");


const test=require('./routes/testRoutes')
const resumeRoutes = require(
  "./routes/resumeRoutes"
);
const interviewRoutes =
  require("./routes/interviewRoutes");
const analyticsRoutes =
  require("./routes/analyticsRoutes");


  const codingRoutes = require("./routes/codingRoutes");
const contestRoutes = require("./routes/contestRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const communityRoutes =
  require("./routes/communityRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);
app.use(
  "/api/coding",
  codingRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);
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
  "/api/interviews",
  interviewRoutes
);


app.get("/", (req, res) => {
  res.send("Interview Platform API Running");
});

module.exports = app;