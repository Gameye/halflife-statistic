Feature: Get5 Ready information

    - We want to know if someone fails to ready up in time for a match and then which team forfeits the match.
    - The server then needs to be shut down

    Scenario Outline:
        Given I play a game of csgo
        And I store logs in <logfile>
        When I process the logs
        Then I know who failed to ready up in time
        And I know which team has forfeited a match
        And the match is then shut down

        Examples:
            | logfile                                                | Winner  |
            | Gameye_vs_Slawter_both_teams_ready.log                 |         |
            | Gameye_vs_Slawter_Gameye_Forfeits_Forceready_used.log  | Slawter |
            | Gameye_vs_Slawter_Slawter_Forfeits_Forceready_used.log | Gameye  |
            | Gameye_vs_Slawter_Gameye_Forfeits_NoForceready.log     | Slawter |
            | Gameye_vs_Slawter_Slawter_Forfeits_NoForceready.log    | Gameye  |

