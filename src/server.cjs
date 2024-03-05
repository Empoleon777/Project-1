const http = require('http');
const { parse } = require('url');
const querystring = require('querystring');
const htmlHandler = require('./htmlResponses.cjs');
const jsonHandler = require('./jsonResponses.cjs');
const imageHandler = require('./imageResponses.cjs');
const jsHandler = require('./jsResponses.cjs');

let apiDataLoaded = false;

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = querystring.parse(bodyString);
    handler(request, response, bodyParams);
  });
};

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/saveTeam') {
    parseBody(request, response, jsonHandler.addTeam);
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (!apiDataLoaded) {
    htmlHandler.getLoadingScreen(request, response);
    return;
  }

  if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  }
  else if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  }
  else if (parsedUrl.pathname === '/UltraBall.png') {
    imageHandler.getUltraBall(request, response);
  }
  else if (parsedUrl.pathname === '/getTeams') {
    jsonHandler.getTeams(request, response);
  }
  else if (parsedUrl.pathname === '/teamjs.mjs') {
    jsHandler.getTeamJSFile(request, response);
  }
  else if (parsedUrl.pathname === '/loading.mjs') {
    jsHandler.getLoaderFile(request, response);
  }
  else if (parsedUrl.pathname === '/apiDataLoaded') {
    parseBody(request, response, (bodyParams) => {
      apiDataLoaded = bodyParams.loaded === true;
      console.log('API data loaded:', apiDataLoaded);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end();
    });
  }
  else {
    jsonHandler.notFound(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});

(async () => {
  try {
    const { loadAllData } = await import('../client/teamjs.mjs');
    await loadAllData();
    apiDataLoaded = true;
    console.log('API data loaded successfully.');
  } catch (error) {
    console.error('Failed to load API data:', error);
  }
})();