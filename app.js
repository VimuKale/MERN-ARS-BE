require("dotenv").config();
const express = require("express");
require("./db/connection");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const { getFileStream } = require("./s3");
const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ganpati Bappa Morya!");
});

app.get("/images/:key", (req, res) => {
  // console.log("hii");
  const key = req.params.key;
  const readStream = getFileStream(key);
  readStream.pipe(res);
});

//LOGIN USER(S)
const loginRouter = require("./routes/login");
app.use("/auth", loginRouter);

// USER ROUTER
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

// SHELTER ROUTER
const shelterRouter = require("./routes/shelters");
app.use("/shelters", shelterRouter);

// ADMIN ROUTER
const adminRouter = require("./routes/admins");
app.use("/admins", adminRouter);

// RESCUE REQUEST ROUTER
const rescueRequestRouter = require("./routes/rescuerequest");
app.use("/rr", rescueRequestRouter);

// RESCUE VAN ROUTER
const rescueVanRouter = require("./routes/rescuevan");
app.use("/rv", rescueVanRouter);

// GALLERY ROUTER
const galleryRouter = require("./routes/gallery");
app.use("/gallery", galleryRouter);

app.listen(PORT, () => {
  console.log(`Server Listening On Port: ${PORT}`);
});
