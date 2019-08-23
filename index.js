// References:  1) https://stackoverflow.com/questions/20089582/how-to-get-a-url-parameter-in-express
// 				2) https://www.browserless.io/
//				3) https://github.com/pocketjoso/penthouse/blob/master/examples/custom-browser.js
//				4) https://meyerweb.com/eric/tools/dencoder/
//				5) https://www.tutorialspoint.com/nodejs/nodejs_response_object.htm
//				6) 


const penthouse = require('penthouse')
const puppeteer = require('puppeteer') // installed by penthouse
const http = require('http');
const critical = require('critical');
const { promisify } = require('util');
const express = require('express');
var bodyParser = require("body-parser");
const CleanCss = require('clean-css');
const config = require('./Critical.json');

let IS_PRODUCTION = process.env.NODE_ENV === 'production';

let getBrowser = () => puppeteer.connect({ browserWSEndpoint: config.browserWSEndpoint, ignoreHTTPSErrors: config.ignoreHTTPSErrors, args: ['--disable-setuid-sandbox', '--no-sandbox']
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
app.use((req, res, next) => {

  // -----------------------------------------------------------------------
  // authentication middleware

  const auth = {login: config.apiUsername, password: config.apiPassword} // change this

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')

  // Verify login and password are set and correct
  if (login && password && login === auth.login && password === auth.password) {
    // Access granted...
    return next()
  }

  // Access denied...
  res.set('WWW-Authenticate', 'Basic realm="401"') // change this
  res.status(401).send('Authentication required.') // custom message

  // -----------------------------------------------------------------------

})

function criticalReader(res, url) {
	  
	  let decodedUrl = decodeURIComponent(url);
	  
	  console.log("Looking up URL " + decodedUrl);
	  
	  res.set('Content-Type', 'application/json');
		res.type('application/json');
		var progress = "1";
	  try {
		  var criticalresult = critical.generate({
			src: decodedUrl,
			minify: true,
			inline: false,
			extract: true,
			timeout: config.timeout,
			penthouse: {
			  url: decodedUrl,
			  cssString: '',
			  puppeteer: {
				getBrowser: getBrowser
			  }
			},
			width: config.width,
			height: config.height
		}).then(function (result) {
			progress = "2";
			let cleanedUpCcss = new CleanCss({ compress: true }).minify(result).styles;
      progress = "3";
			var resSwitched = switchFontPaths(cleanedUpCcss);
      progress = "4";
      var res2 = removeDuplicates(resSwitched);
      progress = "5";
      var res3 = switchFontFaceNames(res2);
      progress = "6";
      
			res.json({ result: res3 }).end();
      progress = "7";
		
    }).catch(function (err) {
			 res.status(500);
			 res.json({ error: "inside error: "+progress + " - " +err }).end();
		}); 
			
		console.log("completed");
	  } catch (err) {
			res.status(500);
			res.json({ error: "outside error: "+progress + " - " +err }).end();
	  }
}

app.get(config.api, async (req, res) => {
    config.width = req.query.width;
    config.height = req.query.height;
	  criticalReader(res, req.query.url);
    return;
});

app.post(config.apiWithFontMap, async (req, res) => {
	config.fontmap = req.body.fontmap;
  config.removeduplicates = req.body.removeduplicates;
  config.fontFaceSwitch = req.body.fontFaceSwitch;
  config.width = req.body.width;
  config.height = req.body.height;
	criticalReader(res, req.body.url);
	return;
});

const port = process.env.PORT || 1337;

app.listen(port);
console.log("Server running on port %d", port);

var switchFontPaths = function replaceAll(input) {
    var output2 = input;
    
    if(!config.fontmap)
      return output2;
      
    config.fontmap.forEach(function (fontReplacement) {
        console.log("fontReplacement.find -- " + fontReplacement.find + " -> " + fontReplacement.replace);
        output2 = findReplace(output2, fontReplacement.find, fontReplacement.replace);
    });
    return output2;
};

var switchFontFaceNames = function replaceAll(input) {
    var output3 = input;
    
    if(!config.fontFaceSwitch)
      return output3;
      
    config.fontFaceSwitch.forEach(function (fontFaceSwitch) {
        console.log("fontFaceSwitch.find -- " + fontFaceSwitch.find + " -> " + fontFaceSwitch.replace);
        output3 = findReplace(output3, fontFaceSwitch.find, fontFaceSwitch.replace);
    });
    return output3;
};

var removeDuplicates = function removeDups(input) {
    var output2 = input;
    
        
    if(!config.removeduplicates)
      return output2;
      
    
    config.removeduplicates.forEach(function (fontReplacement) {
        console.log("fontReplacement.find -- " + fontReplacement.find);
        output2 = findReplace(output2, fontReplacement.find, "");
        output2 += fontReplacement.find;
    });
    return output2;
};

var findReplace = function (str, find, replaceToken) {
	return str.replace(new RegExp(escapeRegExp(find), 'gi'), replaceToken);
};

var escapeRegExp = function(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
