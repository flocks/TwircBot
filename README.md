TwircBot
==========

TwircBot is a <u>lightweight</u> IRC Bot which simply connects to a irc server, join a channel and give you news from Twitter.
It is written in NodeJS thanks to the awesome lib node-irc and to the twitter API.

It allows you to bind Twitter users's timeline and hashtags to your favorite IRC Channel.

<h3>Commands</h3>
`````javascript
hashtag Obama
`````
gives you the 5 latest tweets about Obama.
`````javascript
add #Obama
`````
 
`````javascript
add the hashtag #Obama to the list of hashtag the bot is in charge to watch.
add @Obama
`````
add the tweets of the username @Obama to the list of persons to watch.

Each minut, the bot checks if there are new tweets.

Installation 
`````javascript
git clone https://github.com/flocks/hashTagBot.git
npm install // install devDependencies from package.json
node app.js 
`````
