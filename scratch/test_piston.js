const axios = require('axios');

async function test() {
  try {
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: "javascript",
        version: "18.15.0",
        files: [
          {
            name: "main",
            content: "console.log('hello world');",
          },
        ],
        stdin: "",
      }
    );
    console.log("SUCCESS:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);
  }
}

test();
