const express = require('express');
const ms = require('ms');
const app = express();
const port = 3000;
const fetch = require("node-fetch");
let url = "";
let requests = 0;
let response = null; 
app.use((req, res, next) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];
    const domain = hostname.replace(`${subdomain}.`, '');
    req.subdomain = subdomain;
    req.domain = domain;
    url = `https://${subdomain}.${domain}/`;

    next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at ${url}`));

setInterval(async () => {
     if(url.trim().length === 0 ) return;
     try {
         response = await fetch(url, { method: 'HEAD' });
         requests += 1;
          console.log(`Request done with status ${response.status} ${requests}`);
     } catch (error) {
         if (error.response) {
             requests += 1;
             console.log(`Response status: ${error.response.status}${requests}`);
         }
     } finally {
         response = null; 
     }
}, ms("30m"));

