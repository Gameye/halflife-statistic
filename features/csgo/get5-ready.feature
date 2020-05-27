Feature: As an API user I want to know which player marked itself as ready
    Using the get5 plugin players must say "!ready" in the chat to mark themselves as ready in the team. A single player being not ready can prevent a match for starting. Customers want to know if a player marked themselves as ready so they can handle edge cases where a match started, players joined but the match never started because someone left without ready or went AFK but so they can still pick a winner and a losing team if the other player(s) did mark themselves as ready

    Scenario Outline:
        Given I play a game of csgo
        And I store logs in <logfile>
        When I process the logs
        Then player <player> is <is>

        Examples:
            | logfile                                                | player  | is        |
            | Gameye_vs_Slawter_Gameye_Forfeits_Forceready_used.log  | Slawter | ready     |
            | Gameye_vs_Slawter_Gameye_Forfeits_Forceready_used.log  | Gameye  | not ready |
            | Gameye_vs_Slawter_Slawter_Forfeits_Forceready_used.log | Gameye  | ready     |
            | Gameye_vs_Slawter_Slawter_Forfeits_Forceready_used.log | Slawter | not ready |
            | Gameye_vs_Slawter_Gameye_Forfeits_NoForceready.log     | Slawter | ready     |
            | Gameye_vs_Slawter_Gameye_Forfeits_NoForceready.log     | Gameye  | not ready |
            | Gameye_vs_Slawter_Slawter_Forfeits_NoForceready.log    | Gameye  | ready     |
            | Gameye_vs_Slawter_Slawter_Forfeits_NoForceready.log    | Slawter | not ready |