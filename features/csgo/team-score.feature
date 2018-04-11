Feature: Get team score from log-files

    Scenario Outline:
        Given I play a game of csgo
        And I store logs in <logfile>
        When I process the logs
        Then I have finished <rounds> rounds
        And team <team 1> has a score of <score 1>
        And team <team 2> has a score of <score 2>

    Examples:
        | logfile                                    | team 1 | team 2 |  score 1 | score 2 | rounds |
        | esl1on1-5-rounds.log                       | TeamA  | TeamB  |        3 |       1 |      4 |
        | esl5on5-36-rounds-1-overtime.log           | TeamA  | TeamB  |       17 |      19 |     36 |
        | testone-20-rounds-3-overtime.log           | TeamA  | TeamB  |       12 |       8 |     20 |
        | esl1on1-5-rounds-with-warmup.log           | TeamA  | TeamB  |        1 |       4 |      5 |
        | esl1on1-5-rounds-with-warmup-reconnect.log | TeamA  | TeamB  |        2 |       4 |      6 |
        | esl1on1-5-rounds-warmup-reconnect-v2.log   | TeamA  | TeamB  |        1 |       4 |      5 |
        | esl1on1-6-rounds-warmup-reconnect-v3.log   | TeamA  | TeamB  |        3 |       3 |      6 |
        | testone-7-rounds-1-overtime.log            | TeamA  | TeamB  |        3 |       4 |      7 |
