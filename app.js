http = require('http');
var irc = require('irc');
var Twitter = require('./TwitterApi.js');
var async = require('async');

require('./utils.js');


var twitter = new Twitter();
var config = {
  "server" : "irc.freenode.org",
  "username" : "TwircBot",
  "channel" : "#brillance",
  "nickname" : "TwircBot"
};
var client = new irc.Client(config.server, config.nickname, {
    channels: [config.channel],
    port : 6667,
    showErrors : true,
    autoConnect : false,
    floodProtection : true
});

  var TWEETOS = new Array();
  TWEETOS.push("@frenchweb");
  TWEETOS.push("@TechCrunch");
  TWEETOS.push("@spacenick");
  TWEETOS.push("@pressecitron");

  var HASHTAGS = new Array();

  var TWEETS_USED = {};
  var HASHTAGS_USED = {};

client.connect(0, function() {
  client.addListener('error', function(message) {
    console.log('error: ', message);
  });
  


  client.addListener('message', function (from,to, message) {
    if (typeof message != 'undefined') {


      if (message.contains("hashtag")) {
        var messages = message.split('hashtag ');
        var hashtag = messages[1];
        twitter.getHashTag(hashtag,function(res) {
          client.say(config.channel, "Tweets I found about :"+ hashtag);
          for(var k in res['results']) {
            client.say(config.channel, res['results'][k]['text']);
          }
        });

    }

      else if (message.contains("add")) {
        var messages = message.split('add ');
        var entity = messages[1];

        if (entity.contains('@')) {
	         TWEETOS.push(entity);
		       client.say(config.channel, entity +" added to the list");
        }
       else if (entity.contains('#')) {
		      HASHTAGS.push(entity);
		      client.say(config.channel, entity +" added to the list");
       }
       else {
          client.say(config.channel, "Error, may be you meant #"+entity +" or @"+entity );
       }
    }
    else if (message.contains("remove")) {
       var messages = message.split('remove ');
       var entity = messages[1];

       if (entity.contains('@')) {
          removeUsername(entity);
       }
       else if (entity.contains('#')) {
          removeHashTag(entity);
       }
       
        client.say(config.channel, "Okay "+from +" :"+entity + " removed from the list")
      }
      else if (message.contains("!list")) {
          client.say(config.channel, "Hashtags list :");
          for(var i = 0; i < HASHTAGS.length; i++) {
             client.say(config.channel, '-' + HASHTAGS[i]);
          }
          client.say(config.channel, "Tweetos list :");
          for(i =0; i < TWEETOS.length; i++) {
              client.say(config.channel, '-' + TWEETOS[i]);
          }
      }
      else if (message.contains("!help")) {
        client.say(config.channel, "- add @username");
        client.say(config.channel, "- add #hashTag");
        client.say(config.channel, "- remove @username");
        client.say(config.channel, "- remove #hashtag");
        client.say(config.channel, "- !list");

      }
    }
  });
});

function checkTimeline() {
  async.forEach(TWEETOS, function(tweeto, callback) {
     twitter.getTimeline(tweeto, function(res) {
         
          if (typeof res[0] != "undefined" ) {

          
	    if (typeof TWEETS_USED[res[0]['id']] == "undefined") {
	      client.say(config.channel, "By "+ tweeto + " "+res[0]['text']);
              TWEETS_USED[res[0]['id']] = true;
	      // we save the id of the tweets
            }

         }

         callback();
       });
  }, function(err) {
     if (err) {
      console.log(err);
     }
  });
}

function removeHashTag(hash) {
  HASHTAGS.remove(hash);
}

function removeUsername(username) {
  TWEETOS.remove(username);
}

function checkHashTag() {
  async.forEach(HASHTAGS, function(hashtag, callback) {
     twitter.getHashTag(hashtag, function(res) {
	if (typeof res['results'] != "undefined" && typeof res['results'][0] != "undefined") {
	  if (typeof HASHTAGS_USED[res['results'][0]['id']] == "undefined") {
            client.say(config.channel, "About :"+ hashtag);
            client.say(config.channel, res['results'][0]['text']);
            HASHTAGS_USED[res['results'][0]['id']] = true;
         }

        }
         callback();
       });
  }, function(err) {
     if (err) {
      console.log(err);
     }
  });
}

setInterval(function() {
  checkHashTag();
  checkTimeline();
}, 60000);



