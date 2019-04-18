// const http = require('http');

// const server = http.createServer((request, response) => {
    // response.writeHead(200, {"Content-Type": "text/plain"});
    // response.end("Hello World!");
// });

// const port = process.env.PORT || 1337;
// server.listen(port);

// console.log("Server running at http://localhost:%d", port);



const penthouse = require('penthouse')
const puppeteer = require('puppeteer') // installed by penthouse
const http = require('http');
const critical = require('critical');
const { promisify } = require('util')
const express = require('express');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const getBrowser = () => puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io' });

const app = express();

function testa()
{
	console.log("begin testa");
}

function criticalReader(res) {
	  console.log("begin reading");
	  try {
		  var criticalresult = critical.generate({
			src: 'http://www.tyack.com.au',
			minify: true,
			inline: false,
			extract: false,
			timeout: 30000,
			penthouse: {
			  url: 'https://www.tyackhealth.com.au',
			  cssString: 'body { color: red }',
			  puppeteer: {
				getBrowser: getBrowser
			  }
			},
			width: 1300,
			height: 900
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
    // const browser = await getBrowser();
	// console.log(typeof browser)
    // const page = await browser.newPage();

    // await page.goto('http://www.example.com/');
    // const screenshot = await page.screenshot();

    // return res.end(screenshot, 'binary');
	//console.log("critical reader " + criticalReader);
	//console.log("critical reader 2" + exports.criticalReader);
	criticalReader(res);
    return;
});

const port = process.env.PORT || 1337;

app.listen(port);
console.log("Server running at http://localhost:%d", port);
