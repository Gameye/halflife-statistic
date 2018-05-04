Feature: As an API user I want to know the number of destructions per player

    Scenario Outline:
        Given I play a game of tf2
        And I store logs in <logfile>
        When I process the logs
        Then player <player> had <destructions> destructions
    
    Examples:
        | logfile                    | player     | destructions |
        | tf2-6v6test-payload.log    | Smashmint  | 0            |
        | tf2-6v6test-payload-v2.log | Smashmint  | 2            |