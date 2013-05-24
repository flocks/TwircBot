var http = require('http');

function TwitterApi() {
	this.url = "search.twitter.com";
};

TwitterApi.prototype.getHashTag = function(hashtag, callback) {
	var options = {
		host : this.url,
		port : 80,
		path : '/search.json?q='+hashtag,
		dataType : 'jsonp',
		method : 'GET'
	};


	this.request(options, function(result) {
		return callback(result);
	});


};

TwitterApi.prototype.getTimeline = function(username, callback) {
	var options = {
		host : "api.twitter.com",
		port : 80,
		path : '/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name='+username.substring(1)+'&count=1', // we get rid of the @
		dataType:'jsonp',
		method : 'GET'
	};

	this.request(options, function(result) {
		return callback(result);
	});
};

TwitterApi.prototype.request = function(options, callback) {
	http.get(options, function(res) {
		res.setEncoding('utf8');
		var body = '';

		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			if (res.statusCode == 200) {
				return callback(JSON.parse(body));
			}
			else {
				return callback({
					valid : false
				});
			}
		});
	});
};
module.exports = TwitterApi;
