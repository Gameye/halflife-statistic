@skip
Feature: get player death order in the danger zone game mode

    Scenario Outline: 
        Given I play a game of csgo
        And I store logs in <logfile>
        When I process the logs
        Then player <player> had <money> money
        And player <player> had <footsteps> footsteps
        And player <player> had <healthshots> healthshots
        And player <player> had <crates> crates
        And the game has ended

    Examples:
        | logfile         | player          | money | footsteps | healthshots | crates |
        | danger-zone.log | Smashmint       | 2450  | 967       | 1           | 8      |
        | danger-zone.log | Micrux ¬ GAMEYE | 3400  | 862       | 0           | 10     |