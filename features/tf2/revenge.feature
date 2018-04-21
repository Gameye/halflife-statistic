@skip
Feature: As an API user I want to know the number of revenges per player
    Scenario Outline:
        Given I have been playing a game of tf2
        When collect a log with the contents of <logfile>
        Then player <player> had <revenges> revenges
    
    Examples:
        | logfile                    | player          | revenges |
        | tf2-6v6test-payload.log    | Smashmint       | 0        |
        | tf2-6v6test-payload-v2.log | Smashmint       | 0        |
        | tf2-6v6test-payload-v2.log | Micrux ¬ GAMEYE | 1        |
        | tf2-6v6test-payload-v2.log | elmerbulthuis   | 1        |