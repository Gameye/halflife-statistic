@skip
Feature: As an API user I want to know which team a player is currently in

    Scenario Outline:
        Given I have been playing a game of tf2
        When collect a log with the contents of <logfile>
        And team <team 1> consists of <players 1> as the players
        And team <team 2> consists of <players 2> as the players

    Examples:
        | logfile                        | team 1 | team 2 | players 1               | players 2     | 
        | tf2-6v6test-control-points.log | Blue   | Red    | Smashmint               | denise        |
        | tf2-6v6test-payload.log        | Blue   | Red    | denise                  | Smashmint     |
        | tf2-6v6test-payload-v2.log     | Blue   | Red    | denise, Micrux ¬ GAMEYE | Smashmint     | 
        | tf2-6v6test-payload-v3.log     | Blue   | Red    | denise, Smashmint       | elmerbulthuis |
