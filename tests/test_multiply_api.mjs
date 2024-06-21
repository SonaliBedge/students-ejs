import { app, server } from "../app.js";
import { expect, use } from "chai";
import chaiHttp from "chai-http";
import { factory, seed_db, testUserPassword } from "../utils/seed_db.js";
import { fakerEN_US as faker } from "@faker-js/faker";
import User from "../models/User.js";
import Student from "../models/Student.js";
// const { seed_db, testUserPassword } = require('../util/seed_db');

const chai = use(chaiHttp);

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
        // const textNoLineEnd = res.text.replaceAll("\n", "");
        const textNoLineEnd = res.text;
        // const csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd);
        const csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd) || [
          null,
          "",
        ];
        // expect(csrfTokenMatch).to.not.be.null;
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

  it("should log the user on", async () => {
    const dataToPost = {
      email: this.user.email,
      password: this.password,
      _csrf: this.csrfToken,
    };
    // console.log(dataToPost)
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
// describe("tests for CRUD operations", function () {
//   let sessionCookie;

//   after(() => {
//     server.close();
//   });

//   before(async () => {
//     // Seed the database
//     let testUser = await seed_db();
//     // console.log(testUser.name);
//     // console.log(testUser.email);
//     // console.log(testUser.password);
//     // Logon to the application
//     const logonPage = await chai.request.execute(app).get("/sessions/logon");
//     const csrfToken = /_csrf" value="(.*?)"/.exec(logonPage.text)[1];
//     const logonResponse = await chai.request
//       .execute(app)
//       .post("/sessions/logon")
//       .set("content-type", "application/x-www-form-urlencoded")
//       .set("Cookie", `csrfToken=${csrfToken}`)
//       .send({     
//         name : testUser.name,   
//         email: testUser.email,
//         password : testUser.password,
//         // password: testUserPassword,
//         // password: this.user.Password,
//         // email: testUser.email,
//         // password: testUserPassword,
//         _csrf: csrfToken,
//       })
//       .redirects(0);
//       // console.log(csrfToken)
//       // console.log(testUserPassword)
//       // console.log(testUser)
//       // console.log("logonResponse:", logonPage.text)
//       const cookies = logonResponse.headers["set-cookie"];      
//       sessionCookie = cookies.find((element) =>
//         element.startsWith("connect.sid")
//       );
//       // console.log(sessionCookie)
//     // sessionCookie = logonResponse.headers["set-cookie"]
//       // .find((cookie) => cookie.startsWith("connect.sid"))
//       // .split(";")[0];
//       // console.log(sessionCookie)
//   });

//   it("should get the student list", async () => {
//     const response = await chai.request
//       .execute(app)
//       .get("/students")
//       .set("Cookie", sessionCookie)
//       .send();
//     expect(response).to.have.status(200);
//     // console.log(sessionCookie);
//     console.log("data==", response.text);
//     const pageParts = response.text.split("<li>");
//     // expect(pageParts).to.have.lengthOf(21);
//     expect(pageParts.length - 1).to.equal(20);
//   });
// });
//   it("should add a job entry", async () => {
//     const newStudent = factory.build("student");
//     const response = await chai.request.execute(app)
//       .post("/students")
//       .set("Cookie", sessionCookie)
//       .set("content-type", "application/x-www-form-urlencoded")
//       .send({
//         StudentName: newStudent.StudentName,
//         SchoolName: newStudent.SchoolName,
//         Grade: newStudent.Grade,
//         Subject: newStudent.Subject,
//         _csrf: csrfToken,
//       });
//     expect(response).to.have.status(200);
//     const addedStudent = await Student.findOne({
//       StudentName: newStudent.StudentName,
//       SchoolName: newStudent.SchoolName,
//       Grade: newStudent.Grade,
//       Subject: newStudent.Subject,
//     });
//     expect(addedStudent).to.not.be.null;
//   });
// });
