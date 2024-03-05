const fs = require('fs').promises; // Import the promises-based version of fs

const respond = (request, response, content, type) => {
    response.writeHead(200, { 'Content-Type': type });
    response.write(content);
    response.end();
};

const getTeamJSFile = async (request, response) => {
    try {
        const teamjs = await fs.readFile(`${__dirname}/../client/teamjs.mjs`, 'utf-8');
        respond(request, response, teamjs, 'application/javascript');
    } catch (error) {
        console.error('Error reading teamjs.mjs:', error);
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.write('Internal Server Error');
        response.end();
    }
};

const getLoaderFile = async (request, response) => {
    try {
        const loading = await fs.readFile(`${__dirname}/../client/loading.mjs`, 'utf-8');
        respond(request, response, loading, 'application/javascript');
    } catch (error) {
        console.error('Error reading loading.mjs:', error);
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.write('Internal Server Error');
        response.end();
    }
};

module.exports.getTeamJSFile = getTeamJSFile;
module.exports.getLoaderFile = getLoaderFile;