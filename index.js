const penthouse = require('penthouse')
const puppeteer = require('puppeteer') // installed by penthouse
const http = require('http');
const critical = require('critical');
const { promisify } = require('util')
const express = require('express');

let IS_PRODUCTION = process.env.NODE_ENV === 'production';

let getBrowser = () => puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io', ignoreHTTPSErrors: true, args: ['--disable-setuid-sandbox', '--no-sandbox']
	//,defaultViewport: {width: 1800, height: 1200} 
});

if(!IS_PRODUCTION)
{
	console.log("local environment launching");
	getBrowser = () => puppeteer.launch({
	  ignoreHTTPSErrors: true,
	  args: ['--disable-setuid-sandbox', '--no-sandbox'],
	  // not required to specify here, but saves Penthouse some work if you will
	  // re-use the same viewport for most penthouse calls.
	  //defaultViewport: {width: 1800, height: 1200} 
	});
}

const app = express();

function criticalReader(res, url, width, height) {
	  
	  let decodedUrl = decodeURIComponent(url);
	  
	  console.log("Looking up URL " + decodedUrl);
	  
	  res.set('Content-Type', 'application/json');
	  res.type('application/json');
	  
	  try {
		  var criticalresult = critical.generate({
			src: decodedUrl,
			minify: true,
			inline: false,
			extract: false,
			timeout: 30000,
			penthouse: {
			  url: decodedUrl,
			  cssString: '',
			  puppeteer: {
				getBrowser: getBrowser
			  }
			},
			width: width,
			height: height
		}).then(function (result) {
			console.log("promise resolved");			
			res.status(200);
			res.send({ result: result });
			res.end();
		}).catch(function (err) {
			 console.log("promise rejected");
			 res.status(500);
			 res.json({ error: err }).end();
		}); 
			
		console.log("completed");
	  } catch (err) {
		res.status(500);
		res.json({ error: err }).end();
	  }
}

app.get('/critical/:url/:width/:height', async (req, res) => {
	criticalReader(res, req.params.url, req.params.width, req.params.height);
    return;
});

const port = process.env.PORT || 1337;

app.listen(port);
console.log("Server running at http://localhost:%d", port);
