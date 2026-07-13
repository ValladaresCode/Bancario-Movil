# Agent Instructions

## General behavior

For every non-trivial software development task, follow the workflow below.

Do not immediately modify files just because the requested change appears simple. First gather enough evidence from the actual repository to understand the current implementation.

For trivial tasks such as correcting a typo, changing a label, or performing a clearly isolated edit, a full implementation plan is not required. The change must still be verified.

## 1. Investigate

Before proposing or implementing a solution:

* Inspect the repository structure.
* Read all files directly related to the task.
* Read relevant configuration, scripts, tests, schemas, and documentation.
* Search for existing implementations before creating new code.
* Identify the current behavior.
* Determine the likely root cause or relevant architecture.
* Do not invent files, APIs, dependencies, commands, or project behavior.
* Clearly distinguish verified facts from assumptions.

## 2. Plan

For non-trivial tasks, create a plan before editing files.

The plan must include:

* Current behavior.
* Desired behavior.
* Root cause or relevant architecture.
* Exact files expected to change.
* Step-by-step implementation approach.
* Existing code that can be reused.
* Risks and possible regressions.
* Tests that must be created or updated.
* Verification commands.
* Clear acceptance criteria.

Do not begin implementation until the investigation and plan are complete.

When the user explicitly requests planning only, do not modify files. Save the plan as a Markdown document in the project’s plans directory.

## 3. Review the plan

Before implementation:

* Verify that every mentioned file, API, dependency, and command actually exists.
* Remove speculative or unnecessary steps.
* Check whether the plan matches the current repository state.
* Prefer the smallest correct solution.
* Update the plan when new evidence contradicts it.

## 4. Implement

When implementation is requested or approved:

* Make small and focused changes.
* Follow the existing architecture and coding conventions.
* Avoid unrelated refactors.
* Reuse existing utilities and abstractions where appropriate.
* Do not silently change public APIs or behavior outside the task.
* Re-read modified files after significant edits.
* Keep the implementation consistent with the approved plan.
* Stop and revise the plan if the repository contradicts an important assumption.

## 5. Verify

Never claim that a task is complete merely because the code looks correct.

Run all relevant available checks, including where applicable:

* Unit tests.
* Integration tests.
* Regression tests.
* Type checking.
* Linting.
* Formatting checks.
* Build commands.
* Application startup.
* Browser or UI verification.
* Database migrations or schema validation.

When a verification command fails:

1. Investigate the failure.
2. Determine whether it was caused by the new changes.
3. Fix relevant failures.
4. Run the verification again.

Do not hide failed checks or describe an unexecuted check as successful.

## 6. Review the final changes

Before reporting completion:

* Inspect the complete diff.
* Check for unintended file changes.
* Check for duplicated logic.
* Check for security and privacy issues.
* Check for missing error handling.
* Check for regressions.
* Confirm that the acceptance criteria were met.

## 7. Report

The final report must include:

* A concise summary of the result.
* Files changed.
* Important implementation decisions.
* Verification commands actually executed.
* Results of those commands.
* Any remaining risks or limitations.
* Anything that could not be verified and the reason.

Never claim successful completion without fresh verification evidence.