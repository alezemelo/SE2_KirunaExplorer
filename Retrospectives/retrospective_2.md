TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs. done
  - 3 / 3
- Total points committed vs. done
  - 31 / 31
- Nr of hours planned vs. spent (as a team):
  - 80h planned vs. 83h50m spent

**Remember**a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!)

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |  23     |        |   62h15m   |    63h50m   |
| 4      |   5     |   21   |   10h15m   |    13h30m   |
| 5      |   2     |   5    |    3h      |     2h30m   |
| 6      |   4     |   5    |    4h30m   |     4h      |


> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
  - Hours per task average:
    - Estimated: 2h21m
    - Actual: 2h27m
  - Standard deviation:
    - Estimated: 2h37m
    - Actual: 2h37m
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1
  - 0,013

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$

- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n
  - 0,489

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 7h
  - Total hours spent: 4h
  - Nr of automated unit test cases: 237
  - Coverage (if available)
- E2E testing:
  - Total hours estimated: 1h
  - Total hours spent: 1h
- Code review
  - Total hours estimated: 5h
  - Total hours spent: 5h



## ASSESSMENT

- What caused your errors in estimation (if any)?
  - Bug fixing required more time than initially expected
  - Adjustments in the frontend part of the application required a 
  - The Docker containers setup time was underestimated
  - Time needed to implement the map was underestimated

- What lessons did you learn (both positive and negative) in this sprint?
  - Misalignments with the product owner's expectations highlighted the need for stricter adherence to agreed priorities.

- Which improvement goals set in the previous retrospective were you able to achieve?
  - Task assignment between team members was planned more carefully, allowing team members to work more efficiently compared to the previous sprint.

- Which ones you were not able to achieve? Why?
  - As stated above, the previous sprint objective was achieved, however we believe that we could keep improving on this aspect as we get more experienced.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - We plan to make our team meetings shorter and more frequent during the sprint, by setting a small time limit in which each member can update the others on their work.
  - Attaching SonarQube will help us to spot TD in our code and to reserve some time to keep the code clean and more maintainable.
  - Communication with POs should be more frequent and as clear and detailed as possible, to avoid misunderstandings.
  - Team members should be less specialized on their role: this can be done by starting to assign them tasks regarding a different area of the application (e.g. FE vs BE), in contrast of their usual area.

- One thing you are proud of as a Team!!
  - We are proud of how we maintained an overall positive attidude during this sprint, even though it proved to be particularly challenging.
