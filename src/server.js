const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const imageHandler = require('./imageResponses.js');
const jsHandler = require('./jsResponses.js');
let apiDataLoaded = false;

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const { loadAllData } = require('../client/teamjs.js');

// const urlStruct = {
//   GET: {
//     '/': htmlHandler.getIndex,
//     '/style.css': htmlHandler.getCSS,
//     '/getUsers': jsonHandler.success,
//     '/addUsers': jsonHandler.success,
//     notFound: jsonHandler.notFound,
//   },
//   HEAD: {
//     '/getUsers': jsonHandler.getUsersMeta,
//     notFound: jsonHandler.notFoundMeta,
//   },
// };

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
    const bodyParams = query.parse(bodyString);
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
  else if (parsedUrl.pathname === '/teamjs.js') {
    jsHandler.getTeamJSFile(request, response);
  }
  else if (parsedUrl.pathname === '/loading.js') {
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
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }

  //   if (!urlStruct[request.method]) {
  //       return urlStruct.HEAD.notFound(request, response);
  //   }

  //   if (urlStruct[request.method][parsedUrl.pathname]) {
  //       return urlStruct[request.method][parsedUrl.pathname](request, response);
  //   }

  //   return urlStruct[request.method].notFound(request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});