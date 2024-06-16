// const chai = require("chai");
// chai.use(require("chai-http"));

// const expect = chai.expect;
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// import chai from 'chai';
// import chaiHttp from 'chai-http';
// const { app, server } = require("../app");
// chai.use(chaiHttp);
// const expect = chai.expect;

describe("test getting a page", function () {
  let expect;
  before(async () => {
    const chai = await import("chai");
    const chaiHttp = await import("chai-http");
    chai.use(chaiHttp.default);
    global.expect = chai.expect;
  });

  after(() => {
    server.close();
  });

  it("should get the index page", (done) => {
    chai
      .request(app)
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
