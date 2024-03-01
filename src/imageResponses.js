const ultraBallURL = '../Images/UltraBall.png';
const fs = require('fs');

const getUltraBall = (request, response) => {
  fs.readFile(ultraBallURL, (err, data) => {
    if (err) {
      console.error(err);
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
    } else {
      const contentType = 'image/png'; // Change this to 'image/png' if your image is in PNG format
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(data);
    }
  });
};

module.exports = {
  getUltraBall,
};

// The Totem Lurantis is not hard.
