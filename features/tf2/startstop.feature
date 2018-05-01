Feature: Get start and stop times from log-files

    Scenario Outline:
        Given I play a game of tf2
        And I store logs in <logfile>
        When I process the logs
        Then I have a game start timestamp <start>
        And I have a game stop timestamp <stop>
    
    Examples:
        | logfile                          | start                 | stop                  |
        | tf2-6v6test-payload.log          | 04/16/2018 - 10:43:22 | 04/16/2018 - 11:10:21 |
