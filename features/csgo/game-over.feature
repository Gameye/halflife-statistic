@skip
Feature: Get game over event from log-files

    Scenario Outline: 
        Given I play a game of csgo
        And I store logs in <logfile>
        When I process the first <line> log lines
        Then the game has ended
    Examples:
        | logfile                | line | 
        | csgo-1on1-workshop.log | 1863 | 
        | csgo-1on1-default.log  | 1222 |