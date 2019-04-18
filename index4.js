const penthouse = require('penthouse')
const puppeteer = require('puppeteer') // installed by penthouse
const http = require('http');
const critical = require('critical');
const { promisify } = require('util')
const express = require('express');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const getBrowser = () => puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io' });
// const myGetBrowser = () => IS_PRODUCTION ?

// // // Connect to browserless so we don't run Chrome on the same hardware in production
// puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io' }) :


// const server = http.createServer((req, res) => {
  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'text/plain');
  // console.log("createServer");
  // criticalReader(res);
  // //console.log("wait ...done", result);
  // //res.send(result);
// });

const app = express();

app.get('/image', async (req, res) => {
    //const browser = await getBrowser();
	//console.log(typeof browser)
    //const page = await browser.newPage();

    //await page.goto('http://www.example.com/');
    //const screenshot = await page.screenshot();
	console.log("critical reader");
	criticalReader(res);
    return;
	//return res.end(screenshot, 'binary');
});

app.listen(8080);

// const port = process.env.PORT || 1337;
// server.listen(port);

// console.log("Server running at http://localhost:%d", port);

function criticalreader (res) {
	  console.log("begin reading");
	  try {
		  var criticalresult = critical.generate({
			src: 'http://www.tyack.com.au',
			minify: true,
			inline: false,
			extract: false,
			timeout: 30000,
			penthouse: {
			   puppeteer: {
				 getbrowser: connectme
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

// const penthouse = require('penthouse')
// const puppeteer = require('puppeteer') // installed by penthouse
// const IS_PRODUCTION = process.env.NODE_ENV === 'production';
// const myGetBrowser = () => IS_PRODUCTION ?

// // Connect to browserless so we don't run Chrome on the same hardware in production
// puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io' }) :

// // Run the browser locally while in development
// puppeteer.launch(
// {
  // ignoreHTTPSErrors: true,
  // args: ['--disable-setuid-sandbox', '--no-sandbox'],
  // // not required to specify here, but saves Penthouse some work if you will
  // // re-use the same viewport for most penthouse calls.
  // defaultViewport: {
    // width: 1300,
    // height: 900
  // }
// });

// penthouse({
  // url: 'https://www.tyackhealth.com.au',
  // //cssString: 'body { color: red }',
  // puppeteer: {
    // getBrowser: myGetBrowser()
  // }
// })
// .then(criticalCss => {
	// // use it
	// console.log('got critical css with nr chars:', criticalCss)
// })








// const express = require('express');
// const puppeteer = require('puppeteer');

// const app = express();

// app.get('/image', async (req, res) => {
    // // puppeteer.launch() => Chrome running locally (on the same hardware)
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();

    // await page.goto('http://www.example.com/');
    // const screenshot = await page.screenshot();

    // return res.end(screenshot, 'binary');
// });

// app.listen(8080, () => console.log('Listening on PORT: 8080'));





// const express = require('express');
// const puppeteer = require('puppeteer');
// const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// const app = express();

// const getBrowser = () => IS_PRODUCTION ?

    // // Connect to browserless so we don't run Chrome on the same hardware in production
    // puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io' }) :

    // // Run the browser locally while in development
    // puppeteer.launch();

	// app.get('/image', async (req, res) => {
		// const browser = await getBrowser();
		// const page = await browser.newPage();

		// await page.goto('http://www.example.com/');
		// const screenshot = await page.screenshot();

		// return res.end(screenshot, 'binary');
	// });

	// app.listen(8080);
	
	
	
	
	
	
	
	
	
	
	
	