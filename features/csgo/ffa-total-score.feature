Feature: As an API user I want to know the game scores per player that is calculated and logged by OkLetsPlay's addon.

Addon line in logs: "[OkLetsPlay] [round-end-scores] Slawter<3><STEAM_1:0:18095987> 66"

    Scenario Outline:
        Given I play a game of csgo
        And I store logs in <logfile>
        When I process the logs
        Then player <player> had score of
   
    Examples:
        | logfile                                | player        | Score | 
        | slawter_v_gameye_match1.log            | slawter       | 16    | 
        | slawter_v_gameye_match1.log            | gameye        | 4     | 
        | slawter_v_gameye_match2.log            | slawter       | 66    | 
        | slawter_v_gameye_match2.log            | gameye        | 0     |
