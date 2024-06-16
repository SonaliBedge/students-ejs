

// const chai = require('chai');
// const chaiHttp = require('chai-http'); 
// async function test() {
//     const { expect } = await import('chai');
//   }
const { app, server } = require('../app');
describe('test multiply api', function () {
  let expect, chaiHttp;
  before(async () => {
    const chai = await import('chai');
    expect = chai.expect;
    chaiHttp = await import('chai-http');
    chai.use(chaiHttp.default);
  });

  after(() => {
    server.close();
  });

  it('should multiply two numbers', (done) => {
    this.timeout(10000);
    chai.request(app)
      .get('/multiply')
      .query({first: 7, second: 6})
      .send()
      .end((err,res)=> {
        expect(err).to.equal(null)          
        expect(res).to.have.status(200)
        expect(res).to.have.property('body')
        expect(res.body).to.have.property('result')
        expect(res.body.result).to.equal(42)
        done()
      })
  })
})

// const chaiHttp = require('chai-http');
// const { app, server } = require('../app');

// describe('test multiply api', function () {
//   let expect;
//   before(async () => {
//     const chai = await import('chai');
//     expect = chai.expect;
//     chai.use(chaiHttp);
//   });

//   after(() => {
//     server.close();
//   });

//   it('should multiply two numbers', (done) => {
//     chai.request(app)
//       .get('/multiply')
//       .query({first: 7, second: 6})
//       .send()
//       .end((err,res)=> {
//         expect(err).to.equal(null)          
//         expect(res).to.have.status(200)
//         expect(res).to.have.property('body')
//         expect(res.body).to.have.property('result')
//         expect(res.body.result).to.equal(42)
//         done()
//       })
//   })
// })

// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const { app, server } = require('../app');
// const expect = chai.expect;

// chai.use(chaiHttp);

// describe('test multiply api', function () {
//   after(() => {
//     server.close();
//   });
//   it('should multiply two numbers', (done) => {
//     chai.request(app)
//       .get('/multiply')
//       .query({first: 7, second: 6})
//       .send()
//       .end((err,res)=> {
//         expect(err).to.equal(null)          
//         expect(res).to.have.status(200)
//         expect(res).to.have.property('body')
//         expect(res.body).to.have.property('result')
//         expect(res.body.result).to.equal(42)
//         done()
//       })
//   })
// })

// const chai = require("chai");
// chai.use(require("chai-http"));
// const { app, server } = require("../app");
// const expect = chai.expect
// import { use, expect } from 'chai'
// import chaiHttp from 'chai-http'
// import {app, server } from '../app.js'
// const chai = use(chaiHttp)

// describe("test multiply api", function () {
//     after(() => {
//       server.close();
//     });
//     it("should multiply two numbers", (done) => {
//       chai.request(app)
//         .get("/multiply")
//         .query({first: 7, second: 6})
//         .send()
//         .end(async (err,res)=> {
//           const { expect } = await import('chai');
//           expect(err).to.equal(null)          
//           expect(res).to.have.status(200)
//           expect(res).to.have.property("body")
//           expect(res.body).to.have.property("result")
//           expect(res.body.result).to.equal(42)
//           done()
//         })
//     })
//   })
  

// describe("test multiply api", function () {
//     after(() => {
//       server.close();
//     });
//     it("should multiply two numbers", (done) => {
//       chai.request(app)
//         .get("/multiply")
//         .query({first: 7, second: 6})
//         .send()
//         .end(async (err,res)=> {
//           const { expect } = await import('chai');
//           expect(err).to.equal(null)          
//           expect(res).to.have.status(200)
//           expect(res).to.have.property("body")
//           expect(res.body).to.have.property("result")
//           expect(res.body.result).to.equal(42)
//           done()
//         })
//     })
//   })
  

// describe("test multiply api", function () {
//     after(() => {
//       server.close();
//     });
//     it("should multiply two numbers", (done) => {
//           chai.request(app).get("/multiply")
//           .query({first: 7, second: 6})
//           .send()
//           .end((err,res)=> {
//           expect(err).to.equal(null)          
//           expect(res).to.have.status(200)
//           expect(res).to.have.property("body")
//           expect(res.body).to.have.property("result")
//           expect(res.body.result).to.equal(42)
//           done()
//         })
//     })
// })