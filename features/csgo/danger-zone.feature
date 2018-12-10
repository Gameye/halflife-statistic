@skip
Feature: get player death order in the danger zone game mode

    Scenario Outline: 
        Given I play a game of csgo
        And the game mode is danger zone
        And I store logs in <logfile>
        When I process the logs
        Then player <player> finished <place> place
        And the game has ended

    Examples:
        | logfile         | player          | place |
        | danger-zone.log | Smashmint       | 0     |
        | danger-zone.log | Micrux ¬ GAMEYE | 1     |