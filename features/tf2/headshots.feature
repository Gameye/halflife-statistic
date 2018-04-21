@skip
Feature: As an API user I want to know the number of headshots per player
    Scenario Outline:
        Given I have been playing a game of tf2
        When collect a log with the contents of <logfile>
        Then player <player> had <headshots> headshots
    
    Examples:
        | logfile                          | player          | headshots |
        | tf2-6v6test-koth.log             | Smashmint       | 1         |
        | tf2-6v6test-koth.log             | Micrux ¬ GAMEYE | 0         |
        | tf2-6v6test-control-point-v2.log | Smashmint       | 1         |