Feature: As an API user I want to know the number of defenses per player
    Scenario Outline:
        Given I have been playing a game of tf2
        When collect a log with the contents of <logfile>
        Then player <player> had <defenses> defenses
    
    Examples:
        | logfile                    | player     | defenses |
        | tf2-6v6test-payload.log    | Smashmint  | 9        |
        | tf2-6v6test-payload.log    | denise     | 1        |
        | tf2-6v6test-payload-v2.log | Smashmint  | 0        |
        | tf2-6v6test-payload-v2.log | denise     | 1        |