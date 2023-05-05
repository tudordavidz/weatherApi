const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/index");

const { expect } = chai;

chai.use(chaiHttp);

describe("Integration Tests", () => {
  it("GET /stats - should return average temperature for all locations", (done) => {
    chai
      .request(server)
      .get("/stats")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("location", "all");
        expect(res.body).to.have.property("avgTemperature");
        done();
      });
  });

  it("GET /stats?location=InvalidLocation - should return a 400 error", (done) => {
    chai
      .request(server)
      .get("/stats")
      .query({ location: "InvalidLocation" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error");
        expect(res.body.error).to.equal("Invalid location");
        done();
      });
  });
  
  it("GET /stats - should return average temperature for all locations", (done) => {
    chai
      .request(server) 
      .get("/stats")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("location", "all");
        expect(res.body).to.have.property("avgTemperature");
        done();
      });
  });
  
  
  
  
  
  
});
