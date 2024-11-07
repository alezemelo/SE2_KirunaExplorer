TEMPLATE FOR RETROSPECTIVE (Team #07)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done 
    - Committed stories: 3
    - Done stories: 3
- Total points committed vs. done 
    - Committed points: 26
    - Done points: 26
- Nr of hours planned vs. spent (as a team):
    - Planned: 82h 15m
    - Spent: 84h

**Remember** a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |      15 |        |    55h30m  |         54h  |
| 1      |      13 |      5 |    14h45m  |      18h36m  |
| 2      |       5 |     13 |        7h  |       6h30m  |
| 3      |       5 |      8 |        5h  |        5h5m  |
   


- Hours per task average, standard deviation (estimate and actual)
    - 2h10m task avg actual
    - 2h16m task avg estimated
    - 236,13 std dev estimated
    - 261,27 std dev actual
    - Absolute relative task estimation error: 0,5940
    - Total estimation error ratio: -0,044
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 7h30m
  - Total hours spent: 11h10m
  - Nr of automated unit test cases: 71 / 72
  - Coverage (if available): 
- E2E testing:
  - Total hours estimated: 4h
  - Total hours spent: 1h20m
- Code review 
  - Total hours estimated: 25h
  - Total hours spent: 30h
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
    - Inexperience with learning a new database technology
    - Inexperience with Docker containers management

- What lessons did you learn (both positive and negative) in this sprint?

- Which improvement goals set in the previous retrospective were you able to achieve? 
    - GitHub repository management has become way smooher
    - Communication among team members is clearer and more frequent
  
- Which ones you were not able to achieve? Why?
    - We feel that there's still room for improvement when it comes to optimally divide stories into small tasks and assigning them to members without getting in each other's way. This is probably due to a lack of experience in teamworking.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    - Team coordination may be improved by assigning members tasks that are independent from each other, to reduce time spent waiting for other team members, therefore we'll review task dependencies more closely during following sprint plannings.

- One thing you are proud of as a Team!!
    - We're proud of our openness to experimenting with new technologies and approaches, across all levels of our application, even when they were unfamiliar. This approach expanded our technical skill and favored collaboration and knowledge sharing.
