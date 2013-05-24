http = require('http');
var irc = require('irc');
var Twitter = require('./TwitterApi.js');
require('./utils.js');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

var twitter = new Twitter();
var client = new irc.Client('irc.freenode.org', 'FlocksBot', {
    channels: ['#brillance'],
});


client.say("#brillance", "Hey je suis un robot");
client.addListener('error', function(message) {
    console.log('error: ', message);
});
	

client.addListener('message', function (from,to, message) {
    if (message.contains("hashtag")) {
    	 var messages = message.split('hashtag ');
    	 var hashtag = messages[1];
    	 twitter.getHashTag(hashtag, 5, function(res) {
    	 	 client.say("#brillance", "Tweets I found about :"+ hashtag);
    	 	 for(var k in res['results']) {
    	 	 	client.say("#brillance", res['results'][k]['text']);
    	 	 }
    	 });

   	}

});



