const express = require("express");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 8000;

app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("Hello World DAT490 ✅");
});

app.listen(port, () => console.log(`Starting tutorial server on port ${port}!`));