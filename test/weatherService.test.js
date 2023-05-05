const chai = require("chai");
const axios = require("axios");
const sinon = require("sinon");
const { fetchWeatherData, calculateAverageTemperature } = require("../src/weatherService");

const expect = chai.expect;

describe("Weather Service", () => {
  let axiosGetStub;

  beforeEach(() => {
    axiosGetStub = sinon.stub(axios, "get");
  });

  afterEach(() => {
    axiosGetStub.restore();
  });

  it("should fetch weather data", async () => {
    const location = "Paris";
    const app_temp = 20;

    axiosGetStub.resolves({
      data: {
        data: [
          {
            app_temp,
          },
        ],
      },
    });

    const result = await fetchWeatherData(location);

    sinon.assert.calledOnce(axiosGetStub);
    expect(result).to.equal(app_temp);
  });

  it("should calculate average temperature correctly", () => {
    const temperatures = [10, 20, 30];
    const expectedAverage = 20;

    const result = calculateAverageTemperature(temperatures);

    expect(result).to.equal(expectedAverage);
  });
});
