@skip
Feature: Get rounds from log-files

    Scenario Outline:
        Given I play a game of tf2
        And I store logs in <logfile>
        When I process the logs
        Then I have started <rounds> rounds
        And I have finished <rounds> rounds
    
    Examples:
        | logfile                          | rounds |
        | tf2-6v6test-koth.log             | 2      |
        | tf2-6v6test-payload.log          | 2      |
        | tf2-6v6test-payload-v2.log       | 2      |
        | tf2-6v6test-payload-v3.log       | 3      |
        | tf2-6v6test-payload-v4.log       | 3      |
        | tf2-6v6test-control-point.log    | 1      |
        | tf2-6v6test-control-point-v2.log | 4      |
        | tf2-6v6test-control-point-v3.log | 2      |
     


