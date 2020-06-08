Feature: As an API user I want to know the game scores per player that is calculated and logged by OkLetsPlay's addon.

    Addon line in logs: "[OkLetsPlay] [round-end-scores] Slawter<3><STEAM_1:0:18095987> 66"

    Scenario Outline:
        Given I play a game of csgo
        And I store logs in <logfile>
        When I process the logs
        Then player <player> had a score of <score>

        Examples:
            | logfile                     | player  | score |
            | slawter_v_gameye_match1.log | Slawter | 16    |
            | slawter_v_gameye_match1.log | Gameye  | 4     |
            | slawter_v_gameye_match2.log | Slawter | 66    |
            | slawter_v_gameye_match2.log | Gameye  | 0     |
            | csgo-ffa-score-1.log        | Slawter | 44    |
            | csgo-ffa-score-1.log        | Gameye  | 21    |
            | csgo-ffa-score-2.log        | Gameye  | 86    |
            | csgo-ffa-score-2.log        | Slawter | 187   |
