var http = require('http');

function TwitterApi() {
	this.url = "search.twitter.com";
};

TwitterApi.prototype.getHashTag = function(hashtag,nb_tweet, callback) {
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
