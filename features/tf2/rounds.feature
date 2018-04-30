Feature: Get rounds from log-files

    Scenario Outline:
        Given I play a game of tf2
        And I store logs in <logfile>
        When I process the logs
        Then I have started <rounds> rounds
        And I have finished <rounds> rounds
    
    Examples:
        | logfile                          | rounds |
        | tf2-6v6test-payload.log          |      2 |
