Feature: Get team score from log-files

    Scenario Outline:
        Given I play a game of csgo
        And I store logs in <logfile>
        When I process the logs
        And the first team is called <team 1>
        And the second team is called <team 2>

        Examples:
            | logfile                                    | team 1             | team 2      |
            | esl1on1-5-rounds.log                       | TeamA              | TeamB       |
            | esl5on5-36-rounds-1-overtime.log           | TeamA              | TeamB       |
            | testone-20-rounds-3-overtime.log           | TeamA              | TeamB       |
            | esl1on1-5-rounds-with-warmup.log           | TeamA              | TeamB       |
            | esl1on1-5-rounds-with-warmup-reconnect.log | TeamA              | TeamB       |
            | esl1on1-5-rounds-warmup-reconnect-v2.log   | TeamA              | TeamB       |
            | esl1on1-6-rounds-warmup-reconnect-v3.log   | TeamA              | TeamB       |
            | testone-7-rounds-1-overtime.log            | TeamA              | TeamB       |
            | csgo-get5-dreamteam.log                    | DEAGL.PPRROO       | hemingwayco |
            | csgo-get5-freaks4u-stay.log                | Counter Terrorists | Terrorists  |
            | csgo-get5-freaks4u-swap.log                | Counter Terrorists | Terrorists  |
