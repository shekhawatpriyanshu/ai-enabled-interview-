const fs = require("fs");
const path = require("path");
const Activity = require("../models/activity");

const activityLogger = (req, res, next) => {
  res.on('finish', () => {
    // Only log if the request was successful
    if (res.statusCode >= 200 && res.statusCode < 400) {
      const logMsg = `[ActivityLogger] Success! Method=${req.method}, URL=${req.originalUrl}, Has user? ${!!req.user}, Has socket? ${!!global.socketIo}\n`;
      fs.appendFileSync(path.join(__dirname, "../logs/activity.log"), logMsg);
      
      // Must have global.socketIo and a logged in user (or admin)
      if (req.user && global.socketIo) {
        let text = null;
        let icon = "⚡";
        
        const url = req.originalUrl;
        const method = req.method;
        const name = req.user.name || "A user";
        const role = req.user.role || "user";
        const prefix = role === 'admin' || role === 'super_admin' ? "Admin" : "User";

        // Map common routes to readable actions
        if (url.includes('/profile') && (method === 'PUT' || method === 'POST')) {
          text = `${prefix} ${name} updated their profile/experience`;
          icon = "📝";
        } else if (url.includes('/interviews/start') && method === 'POST') {
          text = `${prefix} ${name} started a new interview`;
          icon = "🎤";
        } else if ((url.includes('/coding/submit') || url.includes('/test/submit')) && method === 'POST') {
          text = `${prefix} ${name} submitted a test/code`;
          icon = "💻";
        } else if (url.includes('/community/group/create') && method === 'POST') {
          text = `${prefix} ${name} created a community group`;
          icon = "👥";
        } else if (url.includes('/community/discussion/create') && method === 'POST') {
          text = `${prefix} ${name} started a new discussion`;
          icon = "🗣️";
        } else if (url.includes('/community/group/message') && method === 'POST') {
          text = `${prefix} ${name} sent a message in a group`;
          icon = "💬";
        } else if (url.includes('/community/comment') && method === 'POST') {
          text = `${prefix} ${name} commented on a discussion`;
          icon = "💬";
        } else if (url.includes('/community') && method === 'POST') {
          text = `${prefix} ${name} interacted with the community`;
          icon = "👥";
        } else if (url.includes('/questions') && method === 'POST') {
          text = `${prefix} ${name} added a question`;
          icon = "❓";
        } else if (url.includes('/resumes/upload') && method === 'POST') {
          text = `${prefix} ${name} uploaded a resume`;
          icon = "📄";
        } else if (url.includes('/rewards') && (method === 'POST' || method === 'PUT')) {
          text = `${prefix} ${name} updated rewards`;
          icon = "🏆";
        } else if (url.includes('/contests') && method === 'POST') {
          text = `${prefix} ${name} participated in a contest`;
          icon = "🏅";
        } else if (method === 'POST') {
          text = `${prefix} ${name} added a new record`;
          icon = "➕";
        } else if (method === 'PUT' || method === 'PATCH') {
          text = `${prefix} ${name} updated a record`;
          icon = "🔄";
        } else if (method === 'DELETE') {
          text = `${prefix} ${name} deleted a record`;
          icon = "🗑️";
        }

        if (text) {
          console.log("[ActivityLogger] Emitting text:", text);
          
          // Save to database
          Activity.create({
            type: "Action",
            text,
            icon,
            user: req.user._id
          }).then((savedActivity) => {
            // Emit the saved activity over WebSockets
            global.socketIo.emit("new_activity", {
              type: savedActivity.type,
              text: savedActivity.text,
              createdAt: savedActivity.createdAt,
              icon: savedActivity.icon
            });
          }).catch(err => {
            console.error("[ActivityLogger] Error saving activity to DB", err);
          });
          
        } else {
          console.log("[ActivityLogger] No text mapped for this URL/method.");
        }
      }
    }
  });
  next();
};

module.exports = activityLogger;
