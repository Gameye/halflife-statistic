@skip
Feature: Get team score from log-files

    Scenario Outline: king-of-the-hill mode
        Given I play a game of tf2
        And I store logs in <logfile>
        When I process the first <line> log lines
        And team <team 1> has a score of <score 1>
        And team <team 2> has a score of <score 2>

    Examples:
        | logfile              | line | team 1 | team 2 | score 1 | score 2 | 
        | tf2-6v6test-koth.log | 316  | Blue   | Red    | 0       | 0       | 
        | tf2-6v6test-koth.log | 325  | Blue   | Red    | 1       | 0       | 
        | tf2-6v6test-koth.log | 331  | Blue   | Red    | 2       | 0       | 
