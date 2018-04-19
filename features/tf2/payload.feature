@skip
Feature: Get team score from log-files

    Scenario Outline:
        Given I have been playing a game of tf2 with the king of the hill mode
        When collect a log with the contents of <logfile>
        And team <team 1> has a score of <score 1>
        And team <team 2> has a score of <score 2>

    Examples:
        | logfile                        | team 1 | team 2 | score 1 | score 2 | 
        | tf2-6v6test-payload.log        | Blue   | Red    | 3       | 4       | 
        | tf2-6v6test-payload-v2.log     | Blue   | Red    | 1       | 4       | 
        | tf2-6v6test-payload-v3.log     | Blue   | Red    | 7       | 2       | 