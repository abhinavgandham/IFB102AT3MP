// Importing express
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 8888;

// -------Defining the route - req = Request Object, res = Response Object---------
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
