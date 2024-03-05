const fs = require('fs');

const teamjs = fs.readFileSync(`${__dirname}/../client/teamjs.js`);
const loading = fs.readFileSync(`${__dirname}/../client/loading.js`);

const respond = (request, response, content, type) => {
    response.writeHead(200, { 'Content-Type': type });
    response.write(content);
    response.end();
};

const getTeamJSFile = (request, response) => {
    respond(request, response, teamjs, 'application/javascript');
};

const getLoaderFile = (request, response) => {
    respond(request, response, loading, 'application/javascript');
};

module.exports.getTeamJSFile = getTeamJSFile;
module.exports.getLoaderFile = getLoaderFile;