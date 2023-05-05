require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const redis = require("redis");
const { fetchWeatherData, calculateAverageTemperature } = require("./weatherService");
const { logErrorToFile } = require("./errorHandler");

const LOCATIONS = ["London", "Paris", "Madrid"];
const INTERVAL = parseInt(process.env.INTERVAL, 10);

const redisClient = redis.createClient(process.env.REDIS_URL);

const app = express();
const port = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Weather API",
      version: "1.0.0",
    },
  },
  apis: ["./src/index.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /stats:
 *   get:
 *     description: Get average temperature for a specific location or all locations
 *     parameters:
 *       - name: location
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Average temperature
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 location:
 *                   type: string
 *                 avgTemperature:
 *                   type: number
 */
app.get("/stats", async (req, res) => {
  const requestedLocation = req.query.location;
  let avgTemperature;

  try {
    if (requestedLocation) {
      if (!LOCATIONS.includes(requestedLocation)) {
        return res.status(400).json({ error: "Invalid location" });
      }
      const temperatures = await getTemperaturesFromCache(redisClient, requestedLocation);
      console.log(`Temperatures for ${requestedLocation}:`, temperatures); // Add this line
      avgTemperature = calculateAverageTemperature(temperatures);
    } else {
      const allTemperatures = await Promise.all(LOCATIONS.map(location => getTemperaturesFromCache(redisClient, location)));
      console.log("All temperatures:", allTemperatures); // Add this line
      const flatTemperatures = allTemperatures.flat();
      avgTemperature = calculateAverageTemperature(flatTemperatures);
    }

    res.status(200).json({ location: requestedLocation || "all", avgTemperature });
  } catch (error) {
    logErrorToFile(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


  app.listen(port, () => {
    console.log(`Weather API listening at http://localhost:${port}`);
  });
  
  async function getTemperaturesFromCache(redisClient, location) {
    return new Promise((resolve, reject) => {
      redisClient.lrange(location, 0, -1, (err, temperatures) => {
        if (err) {
          return reject(err);
        }
        resolve(temperatures.map(parseFloat));
      });
    });
  }
  
  function updateWeatherData() {
    LOCATIONS.forEach(async (location) => {
      try {
        const temperature = await fetchWeatherData(location);
        redisClient.lpush(location, temperature);
        redisClient.ltrim(location, 0, 4);
      } catch (error) {
        logErrorToFile(error);
      }
    });
  }
  
  setInterval(updateWeatherData, INTERVAL);
  updateWeatherData();
  
  module.exports = app;