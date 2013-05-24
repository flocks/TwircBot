http = require('http');
var irc = require('irc');
var Twitter = require('./TwitterApi.js');
var async = require('async');

require('./utils.js');


var twitter = new Twitter();
var config = {
  "server" : "irc.freenode.org",
  "username" : "FlocksBot",
  "channel" : "#brillance2"
};
var client = new irc.Client('irc.freenode.org', 'FlocksBot', {
    channels: ['#brillance2'],
    port : 6667,
    showErrors : true,
    autoConnect : false,
    floodProtection : true
});




  var TWEETOS = new Array();
  var HASHTAGS = new Array();

  var TWEETS_USED = {};
  var HASHTAGS_USED = {};

client.connect(0, function() {
  client.addListener('error', function(message) {
    console.log('error: ', message);
  });
  


  client.addListener('message', function (from,to, message) {
    if (message.contains("hashtag")) {
       var messages = message.split('hashtag ');
       var hashtag = messages[1];
       twitter.getHashTag(hashtag, 5, function(res) {
         client.say(config.channel, "Tweets I found about :"+ hashtag);
         for(var k in res['results']) {
          client.say(config.channel, res['results'][k]['text']);
         }
       });

    }

    if (message.contains("add")) {
       var messages = message.split('add ');
       var entity = messages[1];

       if (entity.contains('@')) {
            TWEETOS.push(entity);
       }
       else if (entity.contains('#')) {
            HASHTAGS.push(entity);
       }
       else {
          client.say(config.channel, "Error, may be you meant #"+entity +" or @"+entity );
       }
    }


  });
});

function checkTimeline() {
  console.log(TWEETS_USED);
  async.forEach(TWEETOS, function(tweeto, callback) {
     twitter.getTimeline(tweeto, function(res) {
         
          if (typeof res[0] != "undefined" ) {

          
            if (typeof TWEETS_USED[res[0]['id']] != "undefined") {
              client.say(config.channel, "Tweet by "+tweeto+" : ");
              client.say(config.channel, res[0]['text']);
            }
            else {
           // we save the id of the tweets
              TWEETS_USED[res[0]['id']] = true;
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
        
        if (typeof res['result'] != "undefined" && typeof res['result'][0] != "undefined") {
          if (typeof HASHTAGS_USED[res['result'][0]['id']] != "undefined") {
            client.say(config.channel, "About :"+ hashtag);
            client.say(config.channel, res['results'][0]['text']);
         }
         else {
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



