import { app, server } from "../app.js";
import { expect, use } from "chai";
import chaiHttp from "chai-http";
import { factory, seed_db, testUserPassword } from "../utils/seed_db.js";
import { fakerEN_US as faker } from "@faker-js/faker";
import User from "../models/User.js";
import Student from "../models/Student.js";
// import puppeteer from "puppeteer"

const chai = use(chaiHttp);

// puppeteer.runTests();
// const browser = await puppeteer.launch();
// const page = await browser.newPage();

// await page.goto('http://localhost:3000');

//test_multiply_api.mjs
describe("test multiply api", function () {
  after(() => {
    server.close();
  });
  it("should multiply two numbers", (done) => {
    chai.request
      .execute(app)
      .get("/multiply")
      .query({ first: 7, second: 6 })
      .send()
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.have.property("body");
        expect(res.body).to.have.property("result");
        expect(res.body.result).to.equal(42);
        done();
      });
  });
});

//test_ui.mjs

describe("test getting a page", function () {
  after(() => {
    server.close();
  });
  it("should get the index page", (done) => {
    chai.request
      .execute(app)
      .get("/")
      .send()
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.have.property("text");
        expect(res.text).to.include("Click this link");
        done();
      });
  });
});

//test_register.mjs
describe("tests for registration and logon", function () {
  after(() => {
    server.close();
  });

  it("should get the registration page", (done) => {
    chai.request
      .execute(app)
      .get("/sessions/register")
      .send()
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.have.property("text");
        expect(res.text).to.include("Enter your name");
        const textNoLineEnd = res.text;
        const csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd) || [
          null,
          "",
        ];
        expect(csrfToken).to.not.be.null;
        this.csrfToken = csrfToken[1];
        expect(res).to.have.property("headers");
        expect(res.headers).to.have.property("set-cookie");
        const cookies = res.headers["set-cookie"];
        const csrfCookie = cookies.find((element) =>
          element.startsWith("csrfToken")
        );
        expect(csrfCookie).to.not.be.undefined;
        const cookieValue = /csrfToken=(.*?);\s/.exec(csrfCookie);
        this.csrfCookie = cookieValue[1];
        done();
      });
  });

  it("should register the user", async () => {
    try {
      this.password = faker.internet.password();
      this.user = await factory.build("user", { password: this.password });
      const dataToPost = {
        name: this.user.name,
        email: this.user.email,
        password: this.password,
        password1: this.password,
        _csrf: this.csrfToken,
      };

      const request = chai.request
        .execute(app)
        .post("/sessions/register")
        .set("Cookie", `csrfToken=${this.csrfCookie}`)
        .set("content-type", "application/x-www-form-urlencoded")
        .send(dataToPost);
      const res = await request;
      expect(res).to.have.status(200);
      expect(res).to.have.property("text");
      expect(res.text).to.include("Students List");
      const newUser = await User.findOne({ email: this.user.email });
      expect(newUser).to.not.be.null;
    } catch (err) {
      console.log(err);
      expect.fail("Register request failed");
    }
  });

  it("should fail register the same email twice", async () => {
    try {
      this.password = faker.internet.password();
      this.user = await factory.build("user", { password: this.password });
      const dataToPost = {
        name: this.user.name,
        email: this.user.email,
        password: this.password,
        password1: this.password,
        _csrf: this.csrfToken,
      };
  
       // Check if user already exists
    const existingUser = await User.findOne({ email: this.user.email });
    if (existingUser) {
      // User already exists, set flash message and return error response
      req.flash("error", "That email address is already registered.");
      return res.status(400).render("register", { errors: req.flash("error") });
    }
  
      const request = chai.request
        .execute(app)
        .post("/sessions/register")
        .set("Cookie", `csrfToken=${this.csrfCookie}`)
        .set("content-type", "application/x-www-form-urlencoded")
        .send(dataToPost);
      const res = await request;
      expect(res).to.have.status(200);
      expect(res).to.have.property("text");
      expect(res.text).to.include("Students List");
      const newUser = await User.findOne({ email: this.user.email });
      expect(newUser).to.not.be.null;
    } catch (err) {
      console.log(err);
      expect.fail("Register request failed");
    }
  });
  

  it("should log the user on", async () => {
    const dataToPost = {
      email: this.user.email,
      password: this.password,
      _csrf: this.csrfToken,
    };
    try {
      const request = chai.request
        .execute(app)
        .post("/sessions/logon")
        .set(
          "Cookie",
          `csrfToken=${this.csrfCookie}` + ";" + this.sessionCookie
        )
        .set("content-type", "application/x-www-form-urlencoded")
        .redirects(0)
        .send(dataToPost);
      let res = await request;
      expect(res).to.have.status(302);
      expect(res.headers.location).to.equal("/");
      const cookies = res.headers["set-cookie"];
      this.sessionCookie = cookies.find((element) =>
        element.startsWith("connect.sid")
      );
      expect(this.sessionCookie).to.not.be.undefined;
    } catch (err) {
      console.log(err);
      expect.fail("Logon request failed");
    }
  });
  it("should get the index page", (done) => {
    chai.request
      .execute(app)
      .get("/")
      .set("Cookie", this.sessionCookie)
      .send()
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.have.property("text");
        expect(res.text).to.include(this.user.name);
        done();
      });
  });
});

//crud_operations.js

describe("tests for CRUD operations", function () {
  after(() => {
    server.close();
  });
  before(async () => {
    const testUser = await seed_db();
    const logonPage = await chai.request.execute(app).get("/sessions/logon"); // Logon to the application
    const csrfToken = /_csrf" value="(.*?)"/.exec(logonPage.text)[1];

    const dataToPost = {
      email: testUser.email,
      password: testUserPassword,
      _csrf: csrfToken,
    };
    try {
      const request = chai.request
        .execute(app)
        .post("/sessions/logon")
        .set(
          "Cookie",
          `csrfToken=${this.csrfCookie}` + ";" + this.sessionCookie
        )
        .set("content-type", "application/x-www-form-urlencoded")
        .redirects(0)
        .send(dataToPost);
      let res = await request;
      expect(res).to.have.status(302);
      expect(res.headers.location).to.equal("/");
      const cookies = res.headers["set-cookie"];
      this.sessionCookie = cookies.find((element) =>
        element.startsWith("connect.sid")
      );
      expect(this.sessionCookie).to.not.be.undefined;
    } catch (err) {
      console.log(err);
      expect.fail("Logon request failed");
    }
  });
  it("should get the student list", (done) => {
    chai.request
      .execute(app)
      .get("/students")
      .set("Cookie", this.sessionCookie)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
        const pageParts = res.text.split("<tr>");
        expect(pageParts).to.have.lengthOf(21);
        done();
      });
  });

  it("should add a student entry", async () => {
    this.student = await factory.build("student");
    const logonPage = await chai.request.execute(app).get("/sessions/logon"); // Logon to the application
    const csrfPage = await chai.request.execute(app).get("/students/new");
    this.csrfToken = /_csrf" value="(.*?)"/.exec(logonPage.text)[1];
    
    const dataToPost = {
      StudentName: this.student.StudentName,
      StudentAge: this.student.StudentAge,
      SchoolName: this.student.SchoolName,
      Grade: this.student.Grade,
      Subject: this.student.Subject,
      IsImmunizationAvailable: this.student.IsImmunizationAvailable,
      _csrf: this.csrfToken,
    };
    const request = await chai.request
      .execute(app)
      .post("/students")
      .set("Cookie", `csrfToken=${this.csrfCookie}` + ";" + this.sessionCookie)
      .set("content-type", "application/x-www-form-urlencoded")
      .redirects(0)
      .send(dataToPost);
    
    expect(request).to.have.status(302);

    const addedStudent = await Student.findOne({
      StudentName: this.student.StudentName,
      StudentAge: this.student.StudentAge,
      SchoolName: this.student.SchoolName,
      Grade: this.student.Grade,
      Subject: this.student.Subject,
      IsImmunizationAvailable: this.student.IsImmunizationAvailable,
    });
    // console.log(addedStudent)
    expect(addedStudent).to.not.be.null;
  });
});
