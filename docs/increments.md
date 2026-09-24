# Heeler Pub Quiz — order of work

In what sequence, and why that sequence. Separate from `design.md` on purpose: that document says what and why, and
keeping them apart is what stops a stale assumption hiding inside a task list.

Written 23 September 2026. Rewritten the same day after a red team and mechanism review found eight blocking
problems in the first version — see `verification-log.md` for what they were.

**The rule this plan follows:** each increment leaves something that works. One increment breaks that rule, and it
says so rather than pretending.

---

## Prerequisites

Checked rather than assumed, 23 September 2026:

| Needed | State |
| --- | --- |
| Node | v24.12.0, present |
| npm | 11.6.2, present |
| GitHub repository | Exists, blank: `nickarrow/heeler-pub-quiz` |
| Pages source set to GitHub Actions | **Done** |
| GitHub CLI (`gh`) | Not installed |
| A credential for the first push | **Not established** |
| Playwright MCP | Package verified working at 0.0.82. Config needs pasting into `.kiro/settings/mcp.json` |

The last row is the only one that still blocks increment 1. Password authentication for git operations no longer
exists, so the first HTTPS push needs one of: Git Credential Manager, which ships with Git for Windows and opens a
browser prompt once; a personal access token pasted at the password prompt; or switching the remote to SSH with a
key. All three need you at the keyboard for a minute. Nothing else is outstanding.

## Standing constraints

True of every increment below, stated once here rather than repeated nine times.

**Verification never requires reading the question bank.** This was the worst finding in the review. The first
version had four consecutive increments whose "how you know it worked" step was to play the deployed game, while the
deployed game served real questions — which would have silently cancelled the error-rate sample in the final
increment, because eyes cannot be un-read. So: the deployed site serves **fixtures** until increment 8. Everything
before that is verified by playing fake questions. The real bank is verified structurally, by counts and by CI, and
the only person who reads it in full is nobody.

**Content commits never appear in a pull request.** App work goes on a branch and through a request, one feature per
request. Content goes straight to `main` with a `content:` prefix and a message that names counts and never quotes an
answer. The reasoning is in `technical-design.md`.

**Rollback is `git revert` plus a redeploy.** Every deploy is a build from a commit on `main`, so reverting the commit
and letting the workflow run again is the whole recovery path. Worth knowing because content bypasses your review by
design, which makes CI the only gate in front of it.

**Any increment that changes the content design updates this document too**, not just `design.md`. The first version
had increment 2 updating the design and leaving the plan above it untouched, which is the exact failure
`HOW-TO-WORK.md` warns about.

## Seeing the thing: Playwright MCP

`stack.md` calls this out directly — the screenshot habit is the cheap version, and a browser automation tool
connected to the agent is the better one, "worth doing once the interface matters." For an app that is almost entirely
interface, it matters from increment 1.

[Playwright MCP](https://playwright.dev/mcp/introduction) drives a real browser and returns an **accessibility tree**
rather than a screenshot. That is the detail that makes it worth more here than a picture would be: the snapshot is
structured, so "does the scoring button carry its team's name as its accessible name" is a question it can answer
directly, not something anyone has to squint at. Screenshots are still available when the question is about layout.

Configuration choices, each for a reason:

- **`--viewport-size=1920x1080`**, because `design.md` §3 says readable on a 1080p television. The default viewport
  would have been testing a size nobody plays at.
- **`--isolated`**, so the browser profile lives in memory. Each session starts with empty local storage, which is
  exactly what is needed to test the fresh-start, exhaustion and reset paths without hand-clearing anything. A refresh
  within a session still persists, which is the property `design.md` §4 actually promises.
- **Headed**, which is the default, so the work is watchable.
- **Pinned to a version**, not `@latest`, on the same principle as the Pages actions — a tool that changes under you
  is a debugging session waiting to happen. Bumping it is a deliberate act.

**What it is not.** Not a replacement for the Vitest suite in `technical-design.md`, which covers dealing, scoring and
persistence logic that needs no browser. Not conformance testing either — the snapshot shows the accessibility tree,
which is not the same as a screen reader user's experience. And not a substitute for increment 6's human check:
viewport size emulates a 1080p window, not a three-metre viewing distance or a television's overscan.

**Whether to commit a Playwright test suite** alongside the interactive use is a decision deliberately not taken here.
The tool earns its place as verification during development first; a committed browser suite is a change to
`technical-design.md`'s testing section and should be argued for on its own.

One hardening step left for increment 1: `--allowed-origins` can restrict the browser to the dev server and the Pages
site. It is left out for now because the docs are explicit that it is a convenience rather than a security boundary,
the dev server port is not known yet, and a guardrail whose failure mode is "the browser silently will not load your
app" is a poor trade on day one. Add it once both URLs are real.

## 1. Toolchain, and one question on a screen

The thinnest possible slice through every layer. Not a game yet — one question, rendered, live on the internet.

**Delivers.** Vite, React, TypeScript, Tailwind, Vitest. The bank alias resolving to fixtures, with absolute paths.
`base` set for a project site. `tsconfig` covering the content directory so the content types are actually checked.
One fixture question rendering on screen. The unofficial-and-unaffiliated footer notice, and the fixture badge. A
GitHub Actions workflow in the two-job shape Pages requires, with every gate wired: typecheck, content validation,
tests, build, upload, deploy. The first push. A live URL.

**Deliberately not.** Any game. No phases, no timer, no scoring, no storage, no real question.

**Why this shape.** It proves the pipeline before anything depends on it — the alias, the CI gates, the deploy, the
credential. The first version of this plan called this increment a walking skeleton and then quietly included the
entire game loop in it. A dry run found it stopped on the very first command, because scaffolding into a non-empty
directory is an interactive prompt and this directory already holds documentation and a git repository.

**Two traps the dry run found.** Scaffold into a temporary directory and move files in, rather than scaffolding in
place. And do not let the scaffold's own `.gitignore` overwrite this one — ours carries the corpus exclusion that
keeps transcripts out of a public repository, which is the one file here where an overwrite has consequences.

**How you know it worked.** Driven through Playwright MCP against the live Pages URL, not asserted from a green
workflow: the page loads, the snapshot contains the question and the footer notice, and `base` resolved correctly
because no asset 404ed. That last one is the most likely first-deploy failure and it is invisible from the CI log.
Then confirm the workflow is green with every gate having actually run rather than skipped.

**Needs from you.** The push credential, per prerequisites.

## 2. Corpus fetch and a reality check

**Delivers.** The fetch script, pinned to `blueypedia.fandom.com` and Wikipedia, writing into `.corpus/`, which is
gitignored. The script is committed; its output never is.

Then the part that matters more — written answers to what the design currently guesses:

- Do ten genuinely contested facts exist, or does Contested Evidence stop being a round?
- Which themes have real depth, so the five second rounds are allocated on evidence?
- How many transcript pages are there, measured with a stated threshold and a date, since two earlier counts
  disagreed?
- Does anything in the scope assumption break on contact with the corpus?

**Deliberately not.** Any questions. This increment reads, counts and reports.

**This is the increment that breaks the rule.** It leaves a working script and a set of answers, not working
software. Deliberate trade: otherwise these questions get answered by authoring 180 questions against a plan that
turns out to be wrong.

**Why here and not later.** It is cheap, it is entirely independent of the app, and knowing early costs nothing while
knowing late risks a surprise. It sits after increment 1 so that the first thing proven is the pipeline.

**How you know it worked.** The script reruns from clean and produces the same corpus. `design.md` §5 and §9, this
document, and `verification-log.md` all get updated with answers instead of expectations.

**Needs from you.** Nothing.

## 3. The game loop, on fixtures

**Delivers.** All six phases from setup to podium. Two to four teams. All three answer shapes and their scoring. The
countdown, with pause — a timer that enforces nothing cannot claim the accessibility exception, and pause is one
state flag. Two storage keys, `game` and `served-rounds`. One complete fixture round of ten questions covering every
answer shape.

**One constraint that must be honoured here or paid for twice.** Scoring stores per-question results and derives
totals from them. It does not accumulate a running per-team number. Increment 5 voids a question after the fact, and
a running total cannot retroactively drop one.

**Deliberately not.** More than one round. Dealing logic. Dispute and void. Wake lock. Any type-scale or contrast
work beyond defaults.

**How you know it worked.** Playwright MCP plays the whole thing: name two teams, work through ten fake questions
hitting all three answer shapes, score each one, reach the podium. Then reload mid-round and confirm the snapshot shows
the same question and the same scores — which is the `game` key doing its job, and is tedious to check by hand every
time the loop changes.

**Needs from you.** Nothing.

## 4. Multiple rounds and the dealing logic

**Delivers.** Twelve short fixture rounds, written by hand — the first version of this plan needed twelve rounds to
prove no-repeats across three games and had delivered exactly one. Then `served-rounds` in use, new game dealing four
unserved rounds, correct behaviour when the pool runs out, and reset behind a confirmation. Served on deal rather
than on finish, so an abandoned evening does not leak half-seen questions into the next one.

**Deliberately not.** Any real content. These rounds are obviously invented and they stay in the repository as the
permanent test fixture.

**How you know it worked.** This is the increment where the browser tool pays for itself. Playwright MCP plays three
full games back to back — twelve rounds, a hundred and twenty question-and-reveal cycles — collecting the round titles
from each snapshot and confirming no round appears twice, then confirms the fourth attempt says the pool is empty
rather than quietly recycling. Doing that by hand once is tedious; doing it after every change to dealing is not
something anyone would actually keep up.

**Needs from you.** Nothing.

## 5. Dispute, void, and the review screen

The error-discovery mechanism. It exists before any real content so that the first real evening cannot happen without
it.

**Delivers.** The `flags` key. Dispute records a question and a note without interrupting anything. Void drops a
question from scoring for every team. A review screen that lists flags and exports them.

**Deliberately not.** Any automatic correction, any editing of questions in the app. The export is the handoff.

**How you know it worked.** Playwright MCP scores a question for two teams, voids it, and reads the scores back out of
the snapshot to confirm both dropped — the scoring constraint from increment 3 being load-bearing here, and a
regression that a unit test would catch in the reducer but not in what the screen actually shows. Then dispute
another, finish the game, and confirm it appears on the review screen and in the export.

**Needs from you.** Nothing.

## 6. The room

Everything that makes it work from a sofa rather than from a desk.

**Delivers.** Type scale using `clamp()` with `rem` endpoints, so text zoom still works. Contrast at AA. Scoring
targets at least 44 by 44, each carrying its team's name as its accessible name. The list stepper announcing its
value, and score changes announced in a live region. The full keyboard map with visible focus. Screen wake lock, with
feature detection, reacquired when the document becomes visible. Reduced motion respected.

**Deliberately not.** Conformance testing with assistive technology, which needs a person and a screen reader, and is
not claimed anywhere.

**How you know it worked, in two halves.**

The machine half, through Playwright MCP, because the snapshot *is* an accessibility tree and every claim in this
increment is a claim about that tree. Each team's scoring control exposes its team name as its accessible name rather
than a position. The list stepper reports as a spin control with a value. The live region exists and its content
changes when a score does. Focus is visible and the whole game is reachable by keyboard alone. A timer can be paused.
None of that needs a person, and all of it is the kind of thing that silently regresses.

The human half, which the tool cannot do. Whether it is legible from a sofa three metres away, and whether the layout
survives your particular television. A 1920x1080 viewport is a 1080p *window*, not a viewing distance and not
overscan.

**Needs from you.** Tell me which screen, and whether you cast a tab or plug in HDMI — they behave differently and
viewport-based sizing is exactly where that shows. For the human half, a screenshot pasted into chat still beats any
description of a layout problem.

## 7. One real round through the whole pipeline

A pipeline proof, not a content push.

**Delivers.** Twelve candidate questions for one round, authored against the corpus. Both checks run — blind
re-derivation with the answer withheld, then cross-anchor against a second source. Survivors committed to the real
bank, verification records alongside. A rough signal on how many of twelve survive.

**Deliberately not.** The other fourteen rounds. And **not** a deploy switch: the live site still serves fixtures.
The real round is verified by CI and by counts, never by being played.

**On that signal.** One round gives a data point, not a rate — the first version of this plan overclaimed here. It is
still worth having, because if seven of twelve survive rather than eleven, `design.md` §5's arithmetic changes now
instead of at the end.

**How you know it worked.** Content validation passes on a real round with real verification records, in CI, without
anybody reading the questions.

**Needs from you.** Nothing, and specifically not reading the round.

## 8. The rest of the bank, then the switch

**Delivers.** The remaining rounds at whatever survival rate increment 7 measured. Twelve shippable rounds is the
floor and buys three games; fifteen if the corpus allows. If the corpus came up short in increment 2, the eleventh
theme substitution from `design.md` §5 happens here.

**Then the switch.** The deploy workflow starts setting the real-bank variable. This is the single line that was
sitting in increment 3 of the first version and causing the whole verification problem.

**Deliberately not.** Anything in the app.

**How you know it worked.** Validation passes in CI. The count of shipped rounds and questions is computed and
recorded rather than estimated. Then Playwright MCP smoke-checks the live site: three games deal without repeating,
each round is ten questions long, every reveal shows an answer and an episode.

**Worth being explicit about who reads what here.** That smoke check puts real questions into my context, and does not
violate the standing constraint at the top of this document. The constraint protects *you*, and the questions were
written by the same process doing the checking — there is nothing left to spoil. What the check deliberately does not
do is report any question's content back to you.

**Needs from you.** Nothing.

## 9. Play it, then measure it

The only increment that produces the quality number, and the only one that is mostly yours.

**Delivers.** A real evening. Then the post-play review from `content-pipeline.md` §4: every disputed question, plus
twenty shipped questions drawn at random. An error rate out of a known sample. A decision.

**Deliberately not.** A second evening. One is enough to get a number.

**The dependency nothing else in this plan has.** This needs two to four people in a room on a date. It is the only
step that cannot be scheduled by working harder, and it is worth knowing that before increment 8 finishes.

**How you know it worked.** There is a number in `verification-log.md` that somebody computed. Two or more errors in
twenty sends the bank back for a full pass.

**Needs from you.** Play the game, then read twenty questions. That is the entire owner cost of the quality system,
and it is the price of not being in the authoring loop.

## What this plan does not include

- **Tiebreaks beyond playing another round.** Open question in `design.md`, undecided, and nothing here assumes an
  answer.
- **The shorts and minisodes.** Ruled out for launch.
- **Offline support.** Ruled out, cheap to add later if a room proves it necessary.
- **Anything in `research/phone-join-and-multiplayer.md`.** Parked, with its own note on what would bring it back.

## Which open questions close where

| Question | Closes in |
| --- | --- |
| Whether Contested Evidence survives as a round | 2 |
| Which five themes get a second round | 2 |
| Default timer length | 9 — it needs real pace, which means real teams. Increment 6 is one person with a keyboard |
| Whether three games is the finish line | 9 |
| Tiebreaks | Still open, not blocking |
