@skip
Feature: As an API user I want to know the game scores per player

    Scenario Outline:
        Given I have been playing a game of tf2
        When collect a log with the contents of <logfile>
        Then player <player> had <kills> kills
        And player <player> had <assists> assists
        And player <player> had <deaths> deaths

    Examples:
        | logfile                    | player          | kills | assists | deaths |
        | tf2-6v6test-payload.log    | Smashmint       | 4     | 0       | 1      |
        | tf2-6v6test-payload.log    | denise          | 1     | 0       | 7      | 
        | tf2-6v6test-payload-v2.log | Smashmint       | 7     | 0       | 4      | 
        | tf2-6v6test-payload-v2.log | denise          | 1     | 0       | 0      |
        | tf2-6v6test-payload-v2.log | Micrux ¬ GAMEYE | 2     | 0       | 8      |
        | tf2-6v6test-payload-v3.log | Smashmint       | 4     | 4       | 6      |
        | tf2-6v6test-payload-v3.log | denise          | 9     | 0       | 3      |
        | tf2-6v6test-payload-v3.log | elmerbulthuis   | 2     | 0       | 14     |