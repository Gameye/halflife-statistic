Feature: As an API user I want to know the number of ubercharges per player

    Scenario Outline:
        Given I play a game of tf2
        And I store logs in <logfile>
        When I process the logs
        Then player <player> had <ubercharges> ubercharges
    
    Examples:
        | logfile                    | player          | ubercharges |
        | tf2-6v6test-payload.log    | Smashmint       | 0           |
        | tf2-6v6test-payload-v2.log | Micrux ¬ GAMEYE | 1           |
        | tf2-6v6test-payload-v3.log | Smashmint       | 1           |