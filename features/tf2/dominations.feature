Feature: As an API user I want to know the number of dominations per player
    Scenario Outline:
        Given I have been playing a game of tf2
        When collect a log with the contents of <logfile>
        Then player <player> had <dominations> dominations
    
    Examples:
        | logfile                    | player        | dominations |
        | tf2-6v6test-payload.log    | Smashmint     | 0           |
        | tf2-6v6test-payload-v2.log | Smashmint     | 1           |
        | tf2-6v6test-payload-v2.log | denise        | 0           |
        | tf2-6v6test-payload-v3.log | Smashmint     | 1           |
        | tf2-6v6test-payload-v3.log | denise        | 1           |
        | tf2-6v6test-payload-v3.log | elmerbulthuis | 0           |