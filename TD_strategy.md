# Technical Debt Management Strategy

## Introduction
This document outlines our strategy for managing Technical Debt (TD) and ensuring code quality throughout our development lifecycle. These practices will be reviewed and updated regularly as part of our sprint activities. 
---

## 1. Code Quality Checks in Sprint Activities
We include code quality checks in our sprint activities to maintain a healthy codebase and prevent the accumulation of Technical Debt.

### Integration CI-based with GitHub actions
- We use **SonarCloud** to analyze code quality as part of our CI/CD pipeline.
- **Quality Gates** are configured with thresholds for:
  - Code Coverage: Around 80%
  - Maintainability: B value 
  - Vulnerabilities: B value
  - Reliability: B value
- **Pipeline Behavior**: Builds will fail if Quality Gates are not met.

### Definition of Done (DoD)
- Each user story or feature is considered "Done" only when:
  - All SonarCloud checks pass. --> to be checked
  - Code review is completed and approved.
  - Adequate test coverage is ensured.

---

## 2. Paying Back Technical Debt
We manage and pay back Technical Debt using the following approach:

### Prioritization
- **Critical Issues**: Addressed immediately within the same sprint.
- **Major Issues**: Logged as backlog items with a high priority.
- **Minor Issues**: Reviewed during sprint planning and resolved based on impact.

### Workflow
1. Technical Debt items are tracked in SonarCloud and issued in YouTrack.
2. During sprint planning:
   - Allocate time for TD remediation tasks.
   - Include high-priority TD items in the sprint backlog.

### Ownership
- **Rotating Code Quality Champions**: Each sprint, all team members monitor and ensure TD tasks are addressed.
- Team-wide collaboration during peer reviews to catch issues early.

---

## 3. Sprint Activities for Quality
### Dedicated Code Quality Checks
- Time is allocated in each sprint for:
  - Reviewing SonarCloud reports.
  - Addressing new issues flagged during the sprint.
  - Incrementally reducing existing Technical Debt.

### Retrospective and Improvements
- Recurring quality issues are reviewed in sprint retrospectives.
- Action items are added to the TD Backlog for future sprints.

---

{## 4. Reporting and Metrics
We track the following metrics during sprints:
- Code Coverage percentage
- Number of new code smells
- Number of resolved vs. new TD items

These metrics are reviewed in sprint retrospectives and used to set quality improvement goals. } //starting from sprint3

---

## 5. Commitment to Continuous Improvement
Our team commits to:
- Regularly updating this strategy to address emerging challenges.
- Keeping the codebase maintainable, secure, and performant.

**Last Updated:** November 15, 2024

---
