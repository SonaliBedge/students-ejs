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
let url = process.env.MONGO_URI;
if (process.env.NODE_ENV == "test") {
  url = process.env.MONGO_URI_TEST;
}

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

// Flash messages middleware
// app.use(flash());

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

app.use((req, res, next) => {
  if (req.path == "/multiply") {
    res.set("Content-Type", "application/json");
  } else {
    res.set("Content-Type", "text/html");
  }
  next();
});

app.get("/multiply", (req, res) => {
  const result = req.query.first * req.query.second;
  if (result.isNaN) {
    result = "NaN";
  } else if (result == null) {
    result = "null";
  }
  res.json({ result: result });
});
app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

app.use(cookieParser("www"));
const students = require("./routes/students");
const teachers = require("./routes/teachers");
const books = require("./routes/books");
const subjects = require("./routes/subjects");

const auth = require("./middleware/auth");
const secretWordRouter = require("./routes/secretWord");

app.use((req, res, next) => {
  let token = csrf.token(req, res);
  // res.cookie("csrf-token", token, csrf_options.cookieParser)
  res.locals._csrf = token;
  // res.locals._csrf = req.cookies.csrfToken;
  next();
});

app.get("/", csrf_middleware, (req, res) => {
  res.render("index");
});
// app.use(csrf_middleware);
app.use("/sessions", require("./routes/sessionRoutes"), csrf_middleware);

app.use("/secretWord", auth, csrf_middleware, secretWordRouter);
app.use("/students", auth, students);
app.use("/teachers", auth, teachers);
app.use("/books", auth, books);
app.use("/subjects", auth, subjects);
app.use("/", require("./routes/sessionRoutes"));
// app.use("/privacy")

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

// const start = async () => {
//   try {
//     let mongoURL = process.env.MONGO_URI
//     if (process.env.NODE_ENV == "test") {
//       mongoURL = process.env.MONGO_URI_TEST
//     }
//     console.log(mongoURL);
//     await require("./db/connect")(mongoURL);
//     // await require("./db/connect")(process.env.MONGO_URI);
//     app.listen(port, () =>
//       console.log(`Server is listening on port ${port}...`)
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// start();

const start = () => {
  try {
    require("./db/connect")(url);
    return app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

const server = start();

module.exports = { app, server };
