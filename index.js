const penthouse = require('penthouse')
const puppeteer = require('puppeteer') // installed by penthouse
const http = require('http');
const critical = require('critical');
const { promisify } = require('util')
const express = require('express');

let IS_PRODUCTION = process.env.NODE_ENV === 'production';

let getBrowser = () => puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io', ignoreHTTPSErrors: true, args: ['--disable-setuid-sandbox', '--no-sandbox'],defaultViewport: {width: 1300, height: 1500} });

// if(!IS_PRODUCTION)
// {
	// console.log("local environment launching");
	// getBrowser = () => puppeteer.launch({
	  // ignoreHTTPSErrors: true,
	  // args: ['--disable-setuid-sandbox', '--no-sandbox'],
	  // // not required to specify here, but saves Penthouse some work if you will
	  // // re-use the same viewport for most penthouse calls.
	  // defaultViewport: {
		// width: 1300,
		// height: 900
	  // }
	// });
// }

const app = express();

function criticalReader(res) {
	  try {
		  var criticalresult = critical.generate({
			src: 'https://www.example.com/',
			minify: true,
			inline: false,
			extract: false,
			timeout: 30000,
			penthouse: {
			  url: 'https://www.example.com/',
			  cssstring: '',
			  puppeteer: {
				getbrowser: getBrowser
			  }
			},
			width: 1300,
			height: 1500
		}).then(function (result) {
			console.log("promise resolved");
			console.log("criticalresult -> " + typeof result);
			res.end(result+'\n');
		}).catch(function () {
			 console.log("promise rejected");
		}); 
			
		console.log("completed");
	  } catch (err) {
		console.log(" my  ----- error " + err);
	  }
}

app.get('/image', async (req, res) => {
	criticalReader(res);
    return;
});

const port = process.env.PORT || 1337;

app.listen(port);
console.log("Server running at http://localhost:%d", port);
