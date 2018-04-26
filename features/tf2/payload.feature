@skip
Feature: Get team score from log-files

    Scenario Outline: payload mode
        Given I play a game of tf2
        And I store logs in <logfile>
        When I process the logs
        And team <team 1> has a score of <score 1>
        And team <team 2> has a score of <score 2>

    Examples:
        | logfile                    | team 1 | team 2 | score 1 | score 2 | 
        | tf2-6v6test-payload-v5.log | Blue   | Red    | 3       | 4       | 