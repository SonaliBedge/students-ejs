const express = require("express");
// const bodyParser = require("body-parser");
require("express-async-errors");

const app = express();
// Serve static files from the public directory
app.use(express.static("public"));

const cookieParser = require("cookie-parser");
const csrf = require("host-csrf"); //csrf-1
app.use(express.urlencoded({ extended: true }));
require("dotenv").config(); // to load the .env file into the process.env object
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const url = process.env.MONGO_URI;

const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};
let csrf_development_mode = true;

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  csrf_development_mode = false; //csrf
  sessionParms.cookie.secure = true; // serve secure cookies
}

// app.use(bodyParser.json());
app.use(session(sessionParms));
const passport = require("passport");
const passportInit = require("./passport/passportInit");

passportInit();
app.use(passport.initialize());
app.use(passport.session());

//csrf
const csrf_options = {
  protected_operations: ["POST"],
  protected_content_types: ["application/json"],
  development_mode: csrf_development_mode,
  cookieParser: cookieParser,
  cookieSecret: process.env.COOKIE_SECRET,
};

const csrf_middleware = csrf(csrf_options);

app.use(require("connect-flash")());

app.use(require("./middleware/storeLocals"));
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/sessions", require("./routes/sessionRoutes"));

app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

app.use(cookieParser("www"));
const students = require("./routes/students");
const auth = require("./middleware/auth");
const secretWordRouter = require("./routes/secretWord");

app.use((req, res, next) => {
  res.locals._csrf = req.cookies.csrfToken;
  next();
});
app.use("/secretWord", auth, csrf_middleware, secretWordRouter);
app.use("/students", auth, students);
// app.use("/students", students)
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await require("./db/connect")(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
