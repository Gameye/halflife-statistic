Feature: Get team score from log-files

    Scenario Outline: payload mode
        Given I play a game of tf2
        And I store logs in <logfile>
        When I process the first <line> log lines
        And team <team 1> has a score of <score 1>
        And team <team 2> has a score of <score 2>

    Examples:
        | logfile                    | line | team 1 | team 2 | score 1 | score 2 |
        | tf2-6v6test-payload-v2.log | 310  | Blue   | Red    | 0       | 0       | 
        | tf2-6v6test-payload-v2.log | 320  | Blue   | Red    | 1       | 0       | 
        | tf2-6v6test-payload-v2.log | 323  | Blue   | Red    | 2       | 0       | 
        | tf2-6v6test-payload-v2.log | 325  | Blue   | Red    | 3       | 0       |
        | tf2-6v6test-payload-v2.log | 345  | Blue   | Red    | 4       | 0       |
        | tf2-6v6test-payload-v2.log | 356  | Blue   | Red    | 0       | 4       |
        | tf2-6v6test-payload-v2.log | 369  | Blue   | Red    | 1       | 4       | 
        | tf2-6v6test-payload-v2.log | 5806 | Blue   | Red    | 1       | 4       | 
        | tf2-6v6test-payload-v6.log | 315  | Blue   | Red    | 0       | 0       |
        | tf2-6v6test-payload-v6.log | 316  | Blue   | Red    | 1       | 0       |
        | tf2-6v6test-payload-v6.log | 317  | Blue   | Red    | 2       | 0       |
        | tf2-6v6test-payload-v6.log | 318  | Blue   | Red    | 3       | 0       |
        | tf2-6v6test-payload-v6.log | 319  | Blue   | Red    | 4       | 0       |
        | tf2-6v6test-payload-v6.log | 331  | Blue   | Red    | 0       | 4       |
        | tf2-6v6test-payload-v6.log | 334  | Blue   | Red    | 1       | 4       |
        | tf2-6v6test-payload-v6.log | 335  | Blue   | Red    | 2       | 4       |
        | tf2-6v6test-payload-v6.log | 341  | Blue   | Red    | 3       | 4       |
        | tf2-6v6test-payload-v6.log | 343  | Blue   | Red    | 4       | 4       |

