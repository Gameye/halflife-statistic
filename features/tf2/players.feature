@skip
Feature: As an API user I want to know which players 

    Scenario Outline:
        Given I play a game of tf2
        And I store logs in <logfile>
        When I process the logs
        Then the players <players> were active in the game

    Examples:
        | logfile                          | players                          |
        | tf2-6v6test-control-point-v3.log | Smashmint, denise                | 
        | tf2-6v6test-payload-v3.log       | Smashmint, denise, elmerbulthuis | 
