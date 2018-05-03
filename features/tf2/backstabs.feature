Feature: As an API user I want to know the number of backstabs per player

    Scenario Outline:
        Given I play a game of tf2
        And I store logs in <logfile>
        When I process the logs
        Then player <player> had <backstabs> backstabs
    
    Examples:
        | logfile                    |  player         | backstabs |
        | tf2-6v6test-payload-v4.log | Smashmint       | 1         |
        | tf2-6v6test-payload-v4.log | Micrux ¬ GAMEYE | 0         |