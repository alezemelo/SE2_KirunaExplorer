TEMPLATE FOR RETROSPECTIVE (Team 7)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 7/7
- Total points committed vs done: 81/81
- Nr of hours planned vs spent (as a team): 80h / 80h 10m

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing (no unit test atually, only integration):
  - 266 unit
- Code review completed:
  - yes, using SonarCloud's automatic review.
- Code present on VCS: 
  - 13k LOC according to SonarCloud
- End-to-End tests performed:
  - 11 END2END has been done 
- Full END 2 ENE Testing
  testing all together 8 functional of the tests


### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    18    |    -   |       44     |      41.33        |
| 9      |    3     |        |    4        |    4.08          |
| 19     |    4     |        |       5.5     |    5.83         |
| 10     |    4     |        |       9.5     |      11.42        |
| 20     |    4     |        |       9.5     |      10.33        |
| 14     |     2    |        |       4     |     4.17         |
| 11     |     1    |        |      0.5      |      0.5        |
| 17     |     1    |        |     3       |      2.5        |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)

|            | Mean     | StDev     |
|------------|------    |-------    |
| Estimation |  2.16    |  3.26     | 
| Actual     |  2.16    |   3.01    |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$
  - -0.002
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$
  - 0.062

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: none, we didn' work on backend basically
  - Total hours spent: 0h
  - Nr of automated unit test cases: 266
  - Coverage: 55%
- E2E testing:
  - Total hours estimated: 7h 30m = 5 automated + 2h 30m manual
  - Total hours spent: 7h 25m
  - Nr of test cases: 19
- Code review 
  - Total hours estimated: some fraction of the 14h of meetings
  - Total hours spent: 2h 30m
- Technical Debt management:
  - Strategy adopted: work on main, deal with not hindering parts of the code
  - Total hours estimated: 2h 15m
  - Total hours spent: 2h 15m
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - difficulty with clusters
  - difficulty with some aspects of the time diagram
  - didn't do all the meetings (also "formal" reviews) again because we prioritized writing new code
  - Estimation errors stemmed primarily from underestimating the complexity of clusters and time diagram features. To address this, we should conduct more detailed task breakdowns during planning.
- What lessons did you learn (both positive and negative) in this sprint?
  - the need to better comment code
  - communicating more often is helpful
  - learned new tools of course
  - Better commenting and frequent communication were key takeaways. Moving forward, we’ll enforce stricter comment standards and schedule regular syncs for clarification.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - we proposed to improve TD management, and we somewhat did, as we assigned it immediately and worked on it throughly
  - we wanted to bring relative estimation error down, and we definitely succeded
  
- Which ones you were not able to achieve? Why?
  - we planned TD well this time, but didn't really plan a lot, although it wasn't really our focus or proposition, so that's fine probably

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - although this is the last sprint, I believe that we could improve TD policies and approach

> Propose one or two

- One thing you are proud of as a Team!!
  - We’re proud of the excellent collaboration that allowed us to deliver 100% of committed stories and achieve significant improvements in estimation accuracy.