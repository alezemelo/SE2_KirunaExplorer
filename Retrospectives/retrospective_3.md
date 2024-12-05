TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done 
  - 2 / 2
- Total points committed vs done 
  - 18 / 18
- Nr of hours planned vs spent (as a team):
  - Planned: 80h 
  - Spent: 79h 40m

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing: 
  - None were written
- Code review completed: 
  - yes, using SonarCloud's automatic review.
- Code present on VCS: 
  - ~12k LOC across 133 files
- End-to-End tests performed: 
  - lots of manual testing + 3 cypress tests
- Integration tests performed:
  - 266 out of 10 suites

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   33    |    -   |    74h 10m |     72       |
| 7      |    4    |  13    |   4h 50m   |   6h 40m     |
| 8      |   3     |    5   |     1h     |      1h      |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
  - Average Estimated: 2
  - Average Actual: 1.99
  - StdDev Estimated: 3h 51m
  - StdDev Actual: 3h 56m
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1
  - 0.004
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n
  - 0.424

  
## QUALITY MEASURES 

- Unit Testing: (we basically do integration directly)
  - Total hours estimated: 0
  - Total hours spent: 0
  - Nr of automated unit test cases: 0
  - Coverage (if available)
- E2E testing: (2 tasks containing `cypress` in the title)
  - Total hours estimated: 1h
  - Total hours spent: 2h
- Code review (`Meeting Before Demo 3` and 'Daily Meetings` tasks, shared between all of us 5)
  - Total hours estimated: 20h 
  - Total hours spent: 7h 30m
- Technical Debt management: (we'll start with at least part of TD first next sprint, as we didn't really have time for it this one)
  - Strategy adopted: Fix bad smells of current sprint, Fix somes mells of old sprint
  - Total hours estimated estimated at sprint planning: 2h 40m
  - Total hours spent: 2h 40m
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - Absence of meetings: if we start doing all the meetings that we actually plan we would have no time to work
  - DB updates and refactors underestimated yet again
  - After the refactors tests often break because of too specificity: we learned some way to make them more general this sprint
  - First time automating e2e test (frontend tests)
  - Lots of really small (like 10m/20m) tasks that aren't really easy to estimate precisely and thus yield high relative error

- What lessons did you learn (both positive and negative) in this sprint?
  - TD setup should be done at the very beginning, not during the sprint
  - Most meetings are better done in smaller groups so they can tackle more precise issue and allow more time flexibility

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - Not really set, but implicitly set: we reduced estimation error again a little
  - We made sure to communicate with PO and thus focused ther correct amount of time on the FAQ issues
  - We mixed front and back a little: one team member moved to the frontend and another did some jobs on the front too
  
- Which ones you were not able to achieve? Why?
  - We couldn't do meetings as desired this time too, see above (Q2 Ans2)

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - Manage TD better, although even without it the SC automatic review seemed good
  - Improve task estimation further

> Propose one or two

- One thing you are proud of as a Team!!
  - We are ready to help each other and are understanding of each other. 
