Feature: As an API user I want to know which team a player is currently in

    Scenario Outline:
        Given I play a game of csgo
        And I store logs in <logfile>
        When I process the logs
        And team <team 1> consists of <players 1> as the players
        And team <team 2> consists of <players 2> as the players

    Examples:
        | logfile                       | team 1 | team 2 | players 1         | players 2       |
        | esl1on1-ralph-denise.log      | TeamA  | TeamB  | denise            | Smashmint       |
        | esl1on1-disconnect-rejoin.log | TeamA  | TeamB  | Smashmint, denise |                 |
        | esl1on1-bots.log              | TeamA  | TeamB  | Derek, Kevin      | Smashmint, Brad |
        | esl1on1-team-switch.log       | TeamA  | TeamB  | Xavier, Joe       | Smashmint, Erik |
        | esl1on1-spectator.log         | TeamA  | TeamB  | Joe, Eric         | Troy, Kevin     |
        | esl1on1-coaching-mode.log     | TeamA  | TeamB  | Cory, Adrian      | Xander, Derek   |
