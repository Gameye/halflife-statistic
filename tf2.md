# Team Fortress 2 Statistics

## Events and log lines

### Kill
Description: player made a kill
`L 04/19/2018 - 12:09:37: "Smashmint<4><[U:1:49496129]><Red>" killed "denise<3><[U:1:437819661]><Blue>" with "loch_n_load" (attacker_position "-806 -419 559") (victim_position "-1215 321 508")`

### Assist
Description: player assisted another player in making a kill  
`L 04/19/2018 - 12:26:38: "Smashmint<4><[U:1:49496129]><Red>" triggered "kill assist" against "elmerbulthuis<8><[U:1:426663176]><Blue>" (assister_position "1016 1014 297") (attacker_position "1161 1212 271") (victim_position "1287 1120 258")`

### Death
Description: player died, via a kill or sucide
`L 03/26/2018 - 13:21:05: "Smashmint<3><[U:1:49496129]><Blue>" killed "denise<4><[U:1:437819661]><Red>" with "bat" (attacker_position "1160 101 544") (victim_position "1112 53 544")`  
`L 04/16/2018 - 10:49:33: "denise<4><[U:1:437819661]><Red>" committed suicide with "world" (attacker_position "611 -351 -127")`

### Backstab
Description: player was killed with a backstab  
`L 04/17/2018 - 14:37:58: "Smashmint<3><[U:1:49496129]><Blue>" killed "Micrux ¬ GAMEYE<4><[U:1:62797578]><Red>" with "eternal_reward" (customkill "backstab") (attacker_position "-530 -92 296") (victim_position "-474 -92 296")`

### Defense
Description: player defended a controlpoint from a takeover  
`L 04/16/2018 - 14:40:08: "Smashmint<3><[U:1:49496129]><Red>" triggered "captureblocked" (cp "0") (cpname "#Badwater_cap_1") (position "-1182 -1570 0")`

### Destruction
Description: player destroyed an enemy object   
`L 04/16/2018 - 14:33:01: "Smashmint<3><[U:1:49496129]><Blue>" triggered "killedobject" (object "OBJ_DISPENSER") (weapon "back_scatter") (objectowner "Micrux ¬ GAMEYE<4><[U:1:62797578]><Red>") (attacker_position "-1011 -285 502")`

### Domination
Description: player killed another player 4 times in a row without being killed   
`L 04/16/2018 - 14:30:51: "Smashmint<3><[U:1:49496129]><Blue>" triggered "domination" against "Micrux ¬ GAMEYE<4><[U:1:62797578]><Red>"`

### Headshot
Description: player was killed with a headshot  
`L 04/19/2018 - 15:17:21: "Smashmint<3><[U:1:49496129]><Blue>" killed "denise<4><[U:1:437819661]><Red>" with "the_classic" (customkill "headshot") (attacker_position "-1432 737 -141") (victim_position "-1517 46 -376")`

### Ubercharge
Description: player launched an ubercharge  
`L 04/16/2018 - 14:43:17: "Micrux ¬ GAMEYE<4><[U:1:62797578]><Blue>" triggered "chargedeployed"`

### Revenge
Description: player got revenge by killig his nemesis   
`L 04/16/2018 - 14:31:27: "Micrux ¬ GAMEYE<4><[U:1:62797578]><Red>" triggered "revenge" against "Smashmint<3><[U:1:49496129]><Blue>"`

## Detecting the game mode

### Control Point
Description: all maps with the control point mode have the prefix "cp_"  
Log: `Loading game mode cp`

### King of the hill
Description: all maps with the king of the hill mode have the prefix "koth_"  
Log: `Loading game mode koth`

### Payload
Description: all maps with the control point mode have the prefix "pl_"  
Log: `Loading game mode payload`

### Payload Race
Description: all maps with the payload race mode have the prefix "plr"  
Log: `Loading game mode payloadrace`


### Stats that we currently can't process

- captures (payload) 

Every player gets 0.1 capture points for every second they push the cart. This does not have to be continuous, or even in the same life, but it does have to be unblocked. It doesn't matter what class you are, what your capture multiplier is, or how many other players are on the cart. Only once your amount of capture points reaches the next whole number does it count, so in essence you get 1 capture point every 10 seconds.

However, this is a mapper-defined value ("partial capture rate"); mapmakers can decide to raise or lower this rate, so some maps can have faster or slower rates of giving out capture points. On most official payload maps this value is 0.1 (hence 10 seconds being the conventional wisdom), but a few are different - for example, it's 0.02 on Upward, so there you have to push the cart for a full 50 seconds to get one capture point.

https://wiki.teamfortress.com/wiki/Scoreboard#Points
