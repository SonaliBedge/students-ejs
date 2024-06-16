// const add = require("../utils/add");
// let expect = require("chai").expect;

import  add  from "../utils/add.js";
import { expect, use } from "chai";
// const add=(a, b)=> {
//   return a + b;
// }
describe("testing adding", function () {
  it("should give 7+6 is 13", (done) => {
    expect(add(7, 6)).to.equal(13);
    done();
  });
});
