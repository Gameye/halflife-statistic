Feature: determine the number side of a team by the number of switches

    Scenario Outline: even rounds
        Given I have a game of 30 rounds
        And overtime is 6 rounds
        When I have played <round> rounds
        Then I have had <switches> switches
    
    Examples:
        | round | switches |
        |    15 |        0 |
        |    16 |        1 |
        |    30 |        1 |
        |    33 |        1 |
        |    34 |        2 |
        |    36 |        2 |
        |    39 |        2 |
        |    40 |        3 |
        |    42 |        3 |

    Scenario Outline: 7 round game and 1 overtime
        Given I have a game of 4 rounds
        And overtime is 3 rounds
        When I have played <round> rounds
        Then I have had <switches> switches
    
    Examples:
        | round | switches |
        |     2 |        0 |
        |     3 |        1 |
        |     5 |        1 |
        |     6 |        2 |

    Scenario Outline: odd rounds (needs expansion)!
        # we still need to test what happend with odd rounds, odd regular rounds
        # are very rare and maybe even hypothetically, but odd rounds in
        # overtime could be possible.
        Given I have a game of 5 rounds
        And overtime is 3 rounds
        When I have played <round> rounds
        Then I have had <switches> switches
    
    Examples:
        | round | switches |
        |     5 |        1 |
        |     8 |        2 |
        |    11 |        3 |
