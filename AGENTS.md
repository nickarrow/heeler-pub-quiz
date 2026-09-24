# Working agreement

Rules for any AI agent working in this repository. Kiro loads this file into every session, and other tools read
`AGENTS.md` too, which is why the rules live here rather than somewhere tool-specific.

## How to work

Talk before you build. Have a conversation first, research it, look for prior art. Do not scaffold before the problem
is understood, and do not offer to.

Change only what you were asked to change. If you spot something else worth doing, say so and wait. Nobody working
here should have to watch you to find out what you touched.

Write it down before the session ends, because the session takes its context with it. Plan the order separately from
the design, in increments that each leave the thing working. Show a commit message before committing it, and one
feature per pull request rather than six.

Review before shipping anything substantial. Run `/review` and fan out several reviewers, each anchored to a
different source. Several agents checking one shared opinion is not review. Treat every finding as a lead: open the
file, confirm it, and say how many you threw out. When reviewing, report rather than fix.

Keep files in the two to three hundred line range. Agents append rather than refactor and nobody reviews a 900-line
file properly. Cohesion is the target and size is the symptom.

## How to check yourself

Say what you did not verify. Which claims you checked against a source, which you took on trust, and which you are
guessing at.

Report counts you actually computed. If you did not count it, say "roughly" or leave the number out.

Do not report a task as done because a command exited zero. Say what you observed.

Record corrections with their date rather than editing history silently.

On anything touching cloud infrastructure: read-only credentials by default, explicit approval before anything changes
state, a scoped role rather than an administrator profile, and never production credentials in a session.
