const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const checkTests = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected!");

  const Question = require("./models/question");
  const questions = await Question.find({});
  console.log(`Found ${questions.length} questions`);
  questions.slice(0, 5).forEach((q, i) => {
    console.log(`Question #${i+1}:`, q);
  });

  await mongoose.connection.close();
};

checkTests();
