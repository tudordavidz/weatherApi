const fs = require("fs");


function logErrorToFile(error) {
  const errorMessage = `${new Date().toISOString()} - ${error.message}\n`;

  return new Promise((resolve, reject) => {
    new Promise((resolve, reject) => {
      fs.writeFile("errors.log", errorMessage, { flag: "a" }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}


module.exports = {
  logErrorToFile,
};