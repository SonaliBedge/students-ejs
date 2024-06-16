import { app, server } from "../app.js";
import { expect, use } from "chai";
import chaiHttp from "chai-http";
const chai = use(chaiHttp);
import { factory, seed_db } from "../utils/seed_db.js";
import { fakerEN_US as faker } from "@faker-js/faker";
import User from "../models/User.js";

//test_multiply_api.mjs
describe("test multiply api", function () {
  after(() => {
    server.close();
  });
  it("should multiply two numbers", (done) => {
    // console.log("chai",chai.request)
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
    console.log("chai", chai.request);
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
        const textNoLineEnd = res.text.replaceAll("\n", "");
        const csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd);
        // console.log("csrfToken :", csrfToken);
        expect(csrfToken).to.not.be.null;
        this.csrfToken = csrfToken[1];
        expect(res).to.have.property("headers");
        expect(res.headers).to.have.property("set-cookie");
        // console.log("res: ", res);
        const cookies = res.headers["set-cookie"];
        // console.log("cookies : ", cookies);
        // console.log("cookies : ", cookies.csrfToken);
        const csrfCookie = cookies.find((element) =>
          element.startsWith("csrfToken")
        );
        // console.log("csrfCookie : ", csrfCookie);
        // expect(csrfCookie).to.not.be.undefined;
        // const cookieValue = /csrfToken=(.*?);\s/.exec(csrfCookie);
        // this.csrfCookie = cookieValue[1];
        done();
      });
  });

  it("should register the user", async () => {
    this.password = faker.internet.password();
    this.user = await factory.build("user", { password: this.password });
    const dataToPost = {
      name: this.user.name,
      email: this.user.email,
      password: this.password,
      password1: this.password,
      _csrf: this.csrfToken,
    };
    try {
      const request = chai.request
        .execute(app)
        .post("/sessions/register")
        .set("Cookie", `csrfToken=${this.csrfCookie}`)
        .set("content-type", "application/x-www-form-urlencoded")
        .send(dataToPost);
      const res = await request;
      console.log("got here");
      expect(res).to.have.status(200);
      expect(res).to.have.property("text");
      expect(res.text).to.include("Students List");
      newUser = await User.findOne({ email: this.user.email });
      expect(newUser).to.not.be.null;
      console.log(newUser);
    } catch (err) {
      console.log(err);
      expect.fail("Register request failed");
    }
  });
});

//test_logon.mjs

// it("should log the user on", async () => {
//     const dataToPost = {
//       email: this.user.email,
//       password: this.password,
//       _csrf: this.csrfToken,
//     };
//     try {
//       const request = chai
//         .request.execute(app)
//         .post("/sessions/logon")
//         .set("Cookie",this.csrfCookie)
//         .set("content-type", "application/x-www-form-urlencoded")
//         .redirects(0)
//         .send(dataToPost);
//       res = await request;
//       expect(res).to.have.status(302);
//       expect(res.headers.location).to.equal('/')
//       const cookies = res.headers["set-cookie"];
//       this.sessionCookie = cookies.find((element) =>
//       element.startsWith("connect.sid"),
//     );
//     expect(this.sessionCookie).to.not.be.undefined;
//     } catch (err) {
//       console.log(err);
//       expect.fail("Logon request failed");
//     }
//   });
//   it("should get the index page", (done)=>{
//     chai.request.execute(app).get("/")
//     .set('Cookie',this.sessionCookie)
//     .send()
//     .end((err,res)=>{
//         expect(err).to.equal(null)
//         expect(res).to.have.status(200)
//         expect(res).to.have.property("text")
//         expect(res.text).to.include(this.user.name)
//         done()
//     })
//   });
