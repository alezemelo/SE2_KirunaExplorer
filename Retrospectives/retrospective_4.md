About Stories And Tasks
> we did a lot of stories because they were smaller + we didn't have as many uncategorized as last time (in proportion to total tasks), although there were still a lot
> a lot more story points than previous sprints because 
	- story 9 (draw area - with 21 points) when we estimated it we though we wouldn't have many features yet
	- story 10 (diagram - with 34 points) was easier than expected (on par with the 21 point stories of sprints 2 and 3)
	- story 20 [idk if to say it but we forgot to estimate story 20, which was one of the later added stories]
	- most of the relative error came from story 10 (diagram), which is the 34 points task (max points ever)
	- other cause may be things like story 11 having only 30m but having 5 points
	
About Estimation Error
> the total is low as last time, but we finally managed to lower the relaitve one by
	- assigning less 10m tasks
	- increasing the estimation by some factor after deciding on it
	- reduced allocated meeting time by a lot

About TD
> We assigned some time early this time, and decided to work on fixing on the main branch mostly the code that we would not work on during this sprint
> We brought the total amount of issues down by 36 issues, mostly not severe ones, to then create 28 new ones, and have an overall decrease of only 8 issues
> The gate is failed, but only because the automatic gate is strict on duplicated code, and on reliability, which we decided to keep on C as threshold, just like it is (security and mantainability are both A)

About Quality Measures
> we didn't add new integration tests because we didn't work on the backend, but we added e2e automated ones
> we didn't really plan on code review this time, as this was usually done in meetings, and we decided to cut them down. What we did was we tried to do good reviews directly after finishing the code.
> tasks like testing and TD almost never have error as you can just stop after the time
> [idk if we should say this but: running tests with --coverage fails half of them for some reason, so the coverage could be more than 70%]




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