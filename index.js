var Hapi = require('hapi');

var server = Hapi.createServer('0.0.0.0', parseInt(process.env.PORT, 10) || 3000);

server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
        directory: { path: './public', listing: false, index: true }
    }
});

server.route({
  method: 'POST'
, path: '/wolfram'
, config: {
    handler: function(req) {
		if (req.payload.searchTerm) {
			var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
		    var request = new XMLHttpRequest();
		    request.open("GET", "http://api.wolframalpha.com/v2/query?input=" + req.payload.searchTerm + "&appid=<WOLFRAM ALPHA APP ID>");
		    request.onreadystatechange = function() {
		        if(request.readyState == 4) {
		            req.reply(request.responseText);
		        }
		    }
		    console.log("asking wolfram alpha");
		    request.send();
		}
    }
  , validate: {
      payload: {
        searchTerm: Hapi.types.String().required()
      }
    }
  }
});

server.route({
  method: 'POST'
, path: '/translate'
, config: {
    handler: function(req) {
		if (req.payload.searchTerm) {
			var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
		    var request = new XMLHttpRequest();
		    request.open("GET", 
		    	"https://www.googleapis.com/language/translate/v2?key=AIzaSyBHI43zthycv0utaG80lKZh5P4wknisFNI&source=en&target=es&q=" 
		    	+ req.payload.searchTerm);
		    request.onreadystatechange = function() {
		        if(request.readyState == 4) {
		            req.reply(request.responseText);
		        }
		    }
		    console.log("POST translate");
		    request.send();
		}
    }
  , validate: {
      payload: {
        searchTerm: Hapi.types.String().required()
      }
    }
  }
});

server.start();
