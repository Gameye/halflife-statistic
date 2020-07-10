Feature: As an API user I want to know which player marked itself as ready
    Using the get5 plugin players must say "!ready" in the chat to mark themselves as ready in the team. A single player being not ready can prevent a match for starting. Customers want to know if a player marked themselves as ready so they can handle edge cases where a match started, players joined but the match never started because someone left without ready or went AFK but so they can still pick a winner and a losing team if the other player(s) did mark themselves as ready
    Get5 also supports a !forceready option which should be tracked in the same way.
    
    
    Scenario Outline:
        Given I play a game of csgo
        And I store logs in <logfile>
        When I process the logs
        Then player state has both !ready and !forceready listed

        Examples:
            | logfile                                                | player  | !Ready    | !forceready  |
            | Gameye_vs_Slawter_Gameye_Forfeits_Forceready_used.log  | Slawter | ready     | forceready   |
            | Gameye_vs_Slawter_Gameye_Forfeits_Forceready_used.log  | Gameye  | not ready | forceready   |
            | Gameye_vs_Slawter_Slawter_Forfeits_Forceready_used.log | Gameye  | ready     | forceready   |
            | Gameye_vs_Slawter_Slawter_Forfeits_Forceready_used.log | Slawter | not ready | forceready   |
            | Gameye_vs_Slawter_Gameye_Forfeits_NoForceready.log     | Slawter | ready     | No forceredy |
            | Gameye_vs_Slawter_Gameye_Forfeits_NoForceready.log     | Gameye  | not ready | No forceredy |
            | Gameye_vs_Slawter_Slawter_Forfeits_NoForceready.log    | Gameye  | ready     | No forceredy |
            | Gameye_vs_Slawter_Slawter_Forfeits_NoForceready.log    | Slawter | not ready | No forceredy |
            | csgo-get5-both-players-ready.log                       | Slawter | ready     | forceready   |
            | csgo-get5-both-players-ready.log                       | Gameye  | ready     | forceready   |
            
            
            
 Log line:
 
 Ready:
 L 05/08/2020 - 15:04:32: get5_event: {
    "matchid": "example_match",
    "params": {
        "client": "Slawter<3><STEAM_1:0:18095987><>",
        "map_number": 0,
        "map_name": "de_dust2",
        "message": "!ready"
 
 Forceready:
 L 05/08/2020 - 15:04:35: get5_event: {
    "matchid": "example_match",
    "params": {
        "client": "Slawter<3><STEAM_1:0:18095987><>",
        "map_number": 0,
        "map_name": "de_dust2",
        "message": "!forceready"
    },
    "event": "client_say"
