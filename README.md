TwircBot
==========

TwircBot is a <u>lightweight</u> IRC Bot which simply connect to a irc server, join a channel and give you news from Twitter.
It is written in NodeJS thanks to the awesome lib node-irc and to the twitter API.

It allows you to bind Twitter user's timeline and hashtag to your favorite IRC Channel.

<h3>Commands</h3>
`````javascript
hashtag Obama
`````
gives you the 5 latest tweet about Obama.
`````javascript
add #Obama
`````

add the hashtag #Obama to the list of hashtag the bot is in charge to watch. Each minut, check if there is a new tweet.
`````javascript
add @Obama
`````
add the tweets of the username @Obama to the list of personn to watch.

Installation 
`````javascript
git clone https://github.com/flocks/hashTagBot.git
npm install
node app.js 
`````
