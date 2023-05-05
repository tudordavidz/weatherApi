# weatherApi

#Terminal

npm install ==> node_modules

npm test ==> run unit and coverage tests

node src/index.js ==> start project

api:

http://localhost:3000/stats ==>
{
    "location": "all",
    "avgTemperature": 14.906666666666668
}

http://localhost:3000/stats?location=Paris ==>
{
    "location": "Paris",
    "avgTemperature": 14.4
}

http://localhost:3000/api-docs/ ==> swagger UI
