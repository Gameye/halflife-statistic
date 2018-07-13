Feature: Get game over event from log-files for games with the game mode FFA

    Scenario Outline: 
        Given I play a game of csgo
        And I store logs in <logfile>
        When I process the logs
        Then player <player> had <kills> kills
        And the game has ended

    Examples:
        | logfile  | player       | kills | 
        | ffa1.log | Smashmint    | 25    |
        | ffa1.log | Sir Hooples  | 19    |
        | ffa1.log | Skinner      | 17    |
        | ffa1.log | Doug_Johnson | 36    |
        | ffa1.log | sazaithehand | 23    |
        | ffa2.log | Smashmint    | 5     |
        | ffa2.log | Skinner      | 2     |
        | ffa2.log | Doug_Johnson | 6     |
        | ffa2.log | Sir Hooples  | 3     |
