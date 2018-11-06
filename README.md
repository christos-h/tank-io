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

###Algorithm (In Java because that's what I found):

    static float Probability(float loser, float winner) { return 1.0f * 1.0f / (1 + 1.0f * (float)(Math.pow(10, 1.0f * (loser - winner) / 400))); } 

    // Function to calculate Elo rating 
    // K is a constant. 
    // d determines whether Player A wins 
    // or Player B.  
    static void EloRating(float Ra, float Rb, int k, boolean d) 
    {  
      
        // To calculate the Winning 
        // Probability of Player B 
        float Pb = Probability(Ra, Rb); 
      
        // To calculate the Winning 
        // Probability of Player A 
        float Pa = Probability(Rb, Ra); 
      
         
        if (d) {
            // Case -1 When Player A wins 
             // Updating the Elo Ratings 
            Ra += k * (1 - Pa); 
            Rb +=  k * (0 - Pb); 
        }  
        else {
            // Case -2 When Player B wins 
            // Updating the Elo Ratings 
            Ra += k * (0 - Pa); 
            Rb += k * (1 - Pb); 
        }               
    } 
