@skip
Feature: Get team score from log-files

    Scenario Outline: control points mode
        Given I play a game of tf2
        And I store logs in <logfile>
        When I process the logs until line <line>
        And team <team 1> has a score of <score 1>
        And team <team 2> has a score of <score 2>

    Examples:
        | logfile                          | line | team 1 | team 2 | score 1 | score 2 |
        | tf2-6v6test-control-point-v3.log | 219  | Blue   | Red    | 0       | 0       |
        | tf2-6v6test-control-point-v3.log | 6228 | Blue   | Red    | 2       | 0       |
