const http = require('http');
const got = require('got');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
    return;
  }

  const code = req.url.split('?code=')[1];
  if (!code) {
    res.writeHead(302, { Location: 'https://github.com/github-ui-hooks' });
    res.end();
    return;
  }

  let accessObject = await got.post('https://github.com/login/oauth/access_token', {
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json'
    },
    body: {
      client_id: 'd244c146ec260d1966f7',
      client_secret: process.env.CLIENT_SECRET,
      code: code
    },
    json: true
  });

  if (accessObject.body && accessObject.body.error) {
    res.statusCode = 400;
    res.end(JSON.stringify(accessObject.body));
    return;
  } else {
    res.writeHead(301, { Location: `https://github.com/github-ui-hooks/github-ui-hooks/wiki/success#${accessObject.body.access_token}` });
    res.end();
    return;
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
