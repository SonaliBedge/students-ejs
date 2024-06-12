const { multiply } = require("../utils/multiply");
const { expect } = require("chai");
// import { multiply } from "../utils/multiply.js";
// impor/t  expect  from "chai";

describe("multiply", () => {
  it("should give 7*6 is 42", (done) => {
    expect(multiply(7, 6)).to.equal(42);
    done();
  });
  it("should give 7*6 is 42", (done) => {
    expect(multiply(7, 6)).to.equal(97);
    done();
  });
});
