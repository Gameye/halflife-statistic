Feature: Get team score from log-files

    Scenario Outline: control points mode
        Given I play a game of tf2
        And I store logs in <logfile>
        When I process the first <line> log lines
        And team <team 1> has a score of <score 1>
        And team <team 2> has a score of <score 2>

    Examples:
        | logfile                          | line | team 1 | team 2 | score 1 | score 2 |
        | tf2-6v6test-control-point-v2.log | 479  | Blue   | Red    | 0       | 0       |
        | tf2-6v6test-control-point-v2.log | 1205 | Blue   | Red    | 1       | 0       |
        | tf2-6v6test-control-point-v2.log | 1248 | Blue   | Red    | 2       | 0       |
        | tf2-6v6test-control-point-v2.log | 1273 | Blue   | Red    | 3       | 0       |
        | tf2-6v6test-control-point-v2.log | 1298 | Blue   | Red    | 4       | 0       |
        | tf2-6v6test-control-point-v3.log | 301  | Blue   | Red    | 0       | 0       |
        | tf2-6v6test-control-point-v3.log | 316  | Blue   | Red    | 1       | 0       |
        | tf2-6v6test-control-point-v3.log | 331  | Blue   | Red    | 2       | 0       |
