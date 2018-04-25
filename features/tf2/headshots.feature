@skip
Feature: As an API user I want to know the number of headshots per player

    Scenario Outline:
        Given I play a game of tf2
        And I store logs in <logfile>
        When I process the logs
        Then player <player> had <headshots> headshots
    
    Examples:
        | logfile                          | player          | headshots |
        | tf2-6v6test-payload-v4.log       | Smashmint       | 1         |
        | tf2-6v6test-payload-v4.log       | Micrux ¬ GAMEYE | 0         |
        | tf2-6v6test-control-point-v2.log | Smashmint       | 1         |