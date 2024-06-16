
describe('testing multiply API', () => {
  it('should give 7*6 is 42', async () => {
    const { multiply } = await import('../utils/multiply.js');
    const { expect } = await import('chai');
    expect(multiply(7,6)).to.equal(42);
  });
  it('should give 7*6 is not 42', async () => {
    const { multiply } = await import('../utils/multiply.js');
    const { expect } = await import('chai');
    expect(multiply(7,6)).to.not.equal(42);
  });
});

// import { expect } from 'chai';
// import { multiply } from '../utils/multiply.js';

// describe('testing multiply', () => {
//   it('should give 7*6 is 42', (done) => {
//     expect(multiply(7,6)).to.equal(42)
//     done()
//   })
//   it('should give 7*6 is 42', (done) => {
//     expect(multiply(7,6)).to.equal(97)
//     done()
//   })
// })

// const multiply = require('../utils/multiply');
// import { expect } from 'chai';
// const expect = require('chai').expect
// async function test() {
//     const { expect } = await import('chai');
//   }

// describe('testing multiply API', () => {
//     it('should give 7*6 is 42', async () => {
//       // const { multiply } = await import('../utils/multiply.js');
//       const { expect } = await import('chai');
//       expect(multiply(7,6)).to.equal(42);
//     });
//     it('should give 7*6 is not 42', async () => {
//       // const { multiply } = await import('../utils/multiply.js');
//       const { expect } = await import('chai');
//       expect(multiply(7,6)).to.equal(42);
//     });
//   });
// import { expect } from "chai";
// import { multiply } from "../utils/multiply.js";

// describe("testing multiply", () => {
//   it("should give 7*6 is 42", (done) => {
//     expect(multiply(7, 6)).to.equal(42);
//     done();
//   });
//   it("should give 7*6 is 42", (done) => {
//     expect(multiply(7, 6)).to.equal(97);
//     done();
//   });
// });

// // require = require('esm')(module);
// // import chai from 'chai';
// // const { expect } = chai;

// const multiply = require('../utils/multiply')  //CommonJS module
// // const expect = require('chai').expect

// // import multiply from "../utils/multiply"; //ES6 module
// // const { use, expect } = await import("chai");

// // const multiply = (a, b) => {
// //   console.log(a);
// //   let product = a * b;
// //   console.log(product);
// //   return product;
// // };
// // const chai = require('chai');
// // const expect = chai.expect;

// async function test() {
//   const { expect } = await import('chai');
// }
// describe('testing multiply API', () => {
//   it('should give 7*6 is 42', async () => {
//     const { multiply } = await import('../utils/multiply.js');
//     const { expect } = await import('chai');
//     expect(multiply(7,6)).to.equal(42);
//   });
//   it('should give 7*6 is not 42', async () => {
//     const { multiply } = await import('../utils/multiply.js');
//     const { expect } = await import('chai');
//     expect(multiply(7,6)).to.equal(42);
//   });
// });
// console.log(typeof multiply); // Check the type of multiply after import
// console.log(multiply);
// // console.log("hello");
// // describe("testing multiply", () => {
// //   it("should give 7*6 is 42", () => {
// //     expect(multiply(7, 6)).to.equal(42);
// //     // done()
// //   });
// //   it("should give 7*6 is 42", () => {
// //     expect(multiply(7, 6)).to.equal(42);
// //     // done()
// //   });
// // });

// // describe('testing multiply', () => {
// //   it('should give 7*6 is 42', (done) => {
// //     expect(multiply(7,6)).to.equal(42)
// //     done()
// //   })
// //   it('should give 7*6 is 42', (done) => {
// //     expect(multiply(7,6)).to.equal(97)
// //     done()
// //   })
// // })

// async function test() {
//   const { expect } = await import('chai');
// }


