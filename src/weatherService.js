const axios = require("axios");
const Joi = require("@hapi/joi");

const API_KEY = process.env.API_KEY;

async function fetchWeatherData(location) {
  const response = await axios.get(`https://api.weatherbit.io/v2.0/current?city=${location}&key=${API_KEY}`);
  console.log(response.data.data[0]); // Add this line to print the response data
  const validationSchema = Joi.object({
    app_temp: Joi.number().required(),
  }).unknown(true); // Add .unknown(true) to ignore other attributes
  const validationResult = validationSchema.validate(response.data.data[0]);
  if (validationResult.error) {
    throw new Error(validationResult.error.details[0].message);
  }
  return validationResult.value.app_temp;
}


function calculateAverageTemperature(temperatures) {
  const sum = temperatures.reduce((a, b) => a + b, 0);
  return sum / temperatures.length;
}

module.exports = {
  fetchWeatherData,
  calculateAverageTemperature,
};
