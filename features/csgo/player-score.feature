Feature: As an API user I want to know the game scores per player

    Scenario Outline:
        Given I play a game of csgo
        And I store logs in <logfile>
        When I process the logs
        Then player <player> had <kills> kills
        And player <player> had <assists> assists
        And player <player> had <deaths> deaths
        And player <player> had <headshots> headshots
        And player <player> had <enemies_flashed> enemies_flashed

        Examples:
            | logfile                                | player        | kills | assists | deaths | headshots | enemies_flashed |
            | esl1on1-ralph-denise.log               | Smashmint     | 4     | 0       | 2      | 0         | 1               |          
            | esl1on1-ralph-denise.log               | denise        | 2     | 0       | 4      | 1         | 0               |
            | esl1on1-ralph-denise-elmer-assists.log | Smashmint     | 2     | 2       | 0      | 2         | 0               |
            | esl1on1-ralph-denise-elmer-assists.log | denise        | 2     | 1       | 0      | 5         | 0               |
            | esl1on1-ralph-denise-elmer-assists.log | elmerbulthuis | 0     | 0       | 4      | 0         | 0               |
            | esl1on1-bots.log                       | Smashmint     | 2     | 0       | 4      | 2         | 0               |
            | esl1on1-bots.log                       | Brad          | 1     | 0       | 5      | 0         | 0               |
            | esl1on1-bots.log                       | Derek         | 4     | 1       | 2      | 0         | 0               |
            | esl1on1-bots.log                       | Kevin         | 5     | 0       | 1      | 0         | 0               |
            | esl1on1-team-switch.log                | Smashmint     | 4     | 1       | 3      | 5         | 0               |
            | esl1on1-team-switch.log                | Erik          | 1     | 1       | 2      | 1         | 0               |
            | esl1on1-team-switch.log                | Xavier        | 1     | 0       | 4      | 0         | 0               |
            | esl1on1-team-switch.log                | Joe           | 0     | 0       | 1      | 0         | 0               |
            | esl1on1-teamkill-suicide.log           | Smashmint     | 0     | 1       | 4      | 5         | 0               |
            | esl1on1-negative-kills.log             | Smashmint     | -1    | 1       | 5      | 0         | 0               |
            | esl1on1-coaching-mode.log              | Smashmint     | 2     | 0       | 3       | 0        | 1               |
