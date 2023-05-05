const chai = require("chai");
const sinon = require("sinon");
const fs = require("fs");
const errorHandler = require("../src/errorHandler");

const expect = chai.expect;

describe("Error Handler", () => {
  let fsWriteStub;

  beforeEach(() => {
    fsWriteStub = sinon.stub(fs, "writeFile");
  });

  afterEach(() => {
    fsWriteStub.restore();
  });

  it("should log error to errors.log", function (done) {
    this.timeout(5000); // Set the timeout to 5 seconds
    const errorMessage = "Test error message";
    errorHandler.logErrorToFile(new Error(errorMessage));
    setTimeout(() => {
      const logContent = fs.readFileSync("errors.log", "utf8");
      expect(logContent).to.include(errorMessage);
      done();
    }, 2000);
  });
  
});
