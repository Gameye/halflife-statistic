Feature: Get rounds from log-files

    Scenario Outline:
        Given I have been playing a game of csgo
        When collect a log with the contents of <logfile>
        Then I have started <rounds> rounds
        And I have finished <rounds> rounds
    
    Examples:
        | logfile                          | rounds |
        | esl1on1-5-rounds.log             |      4 |
        | esl5on5-36-rounds-1-overtime.log |     36 |
        | testone-20-rounds-3-overtime.log |     20 |
        | testone-7-rounds-1-overtime.log  |      7 |
