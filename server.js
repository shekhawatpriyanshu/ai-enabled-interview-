const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const connectDB = require("./config/db");

console.log("JWT_SECRET =", process.env.JWT_SECRET);
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
});