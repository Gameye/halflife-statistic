Feature: Get team score from log-files

    Scenario Outline: control points mode
        Given I play a game of tf2
        And I store logs in <logfile>
        When I process the first <line> log lines
        And team <team 1> has a score of <score 1>
        And team <team 2> has a score of <score 2>

    Examples:
        | logfile                                 | line | team 1 | team 2 | score 1 | score 2 |
        | tf2-6v6test-control-point-v2.log        | 479  | Blue   | Red    | 0       | 0       |
        | tf2-6v6test-control-point-v2.log        | 1208 | Blue   | Red    | 1       | 0       |
        | tf2-6v6test-control-point-v2.log        | 1251 | Blue   | Red    | 2       | 0       |
        | tf2-6v6test-control-point-v2.log        | 1276 | Blue   | Red    | 3       | 0       |
        | tf2-6v6test-control-point-v2.log        | 1302 | Blue   | Red    | 4       | 0       |
        | tf2-6v6test-control-point-v3.log        | 304  | Blue   | Red    | 0       | 0       |
        | tf2-6v6test-control-point-v3.log        | 320  | Blue   | Red    | 1       | 0       |
        | tf2-6v6test-control-point-v3.log        | 335  | Blue   | Red    | 2       | 0       |
        | tf2-test6v6-control-point-stalemate.log | 289  | Blue   | Red    | 0       | 0       |
        | tf2-test6v6-control-point-stalemate.log | 301  | Blue   | Red    | 0       | 0       |
