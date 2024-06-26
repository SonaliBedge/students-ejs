import  multiply  from "../utils/multiply.js";
import { expect, use } from "chai";
describe('testing multiply', () => {
  it('should give 7*6 is 42', (done) => {
    expect(multiply(7,6)).to.equal(42)
    done()
  })
  // it('should give 7*6 is 42', (done) => {
  //   expect(multiply(7,6)).to.equal(97)
  //   done()
  // })
})

