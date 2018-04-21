@skip
Feature: As an API user I want to know the number of backstabs per player
    Scenario Outline:
        Given I have been playing a game of tf2
        When collect a log with the contents of <logfile>
        Then player <player> had <backstabs> backstabs
    
    Examples:
        | logfile              | player          | backstabs |
        | tf2-6v6test-koth.log | Smashmint       | 1         |
        | tf2-6v6test-koth.log | Micrux ¬ GAMEYE | 0         |