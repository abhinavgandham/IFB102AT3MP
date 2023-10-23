// Importing express
const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const port = process.env.PORT || 3030;
const fs = require("fs");
const https = require("https");

// -------Defining the route - req = Request Object, res = Response Object-------
//  Serving the HTML file
app.use(express.static(__dirname));

// Defining the route to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Display console message when server is listening to port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
// In your server-side app.js
app.get("/api/access-token", (req, res) => {
  res.json({ accessToken: process.env.accessToken });
});

const postData = `refresh_token=XxLoxhopCkQAAAAAAAAAAei7uQRBqfH9Tj9mNVrVdlhhCYiOzVq7JEBfTeku1lqT&grant_type=refresh_token&client_id=0dc8hbklx489vn5&client_secret=h870pkmfatftvzg`;

const options = {
  hostname: "api.dropbox.com",
  path: "/oauth2/token",
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": postData.length,
  },
};

const req = https.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    // Parse the response JSON to get the access_token
    const response = JSON.parse(data);
    const accessToken = response.access_token;

    // Update the .env file
    fs.readFile(".env", "utf8", (err, envContents) => {
      if (err) {
        console.error(err);
      } else {
        const updatedEnv = envContents.replace(
          /(accessToken=)(.*)/,
          `accessToken=${accessToken}`
        );
        fs.writeFile(".env", updatedEnv, (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log("Access token updated successfully.");
          }
        });
      }
    });
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.write(postData);
req.end();
