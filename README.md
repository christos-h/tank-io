#tank-io

This is an attempt at creating an online game using socket-io.

###Introduction:
The game will involve a 4 player arena. Each player controls a tank which he can move and shoot with. Shooting creates a projectile which will instantly kill whoever collides with the projectile.

Simple right?

The game has a few goals in mind:

* Improve on my appauling JS / HTML skills.	
* Use socket-io to create a low-latency game
* Very light-weight, don't use frameworks/game-engines as much as possible
* Be fun to play
* Actually finish it and deploy it on the cloud in a playable state

Nice-to-haves:
In order to monetize this game and make it have real-world appeal, we need to introduce fun game-play. So that means:
* Graphics which aren't complete shit
* Different types of projectile (perhaps homing, phat / thicc cannon)
* Ranking system. Good players should play with good players. There should also be a number 1 player.

Ranking system:
Much like Zook in The Social Network, we need a ranking algorithm. Also ranking implies some database to store user accounts. Hmmm... Mongodb? Could use SQL but literally cannot be bothered.


Yeah lets use mongo.

###Algorithm

See server/elo.js

###Profiles

* Local:
	* Web-Server port 8080
	* socket-io port 3000
	* url localhost
* Live
	* Web-Server port 80
	* socket-io port 3000
	* url 35.187.61.163

###MongoDB Install

sudo apt install -y mongodb

###todo

* Create deploy script (May be a bit more difficult, should probably be in .gitignore)
* Create install script

