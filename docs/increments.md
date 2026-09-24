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
| GitHub repository | Exists and empty: `nickarrow/heeler-pub-quiz`. **Public**, which is what makes Pages free |
| Pages source set to GitHub Actions | Done |
| A credential for the first push | Done. Git Credential Manager, verified by a dry-run push |
| GitHub CLI (`gh`) | Not installed, and not needed — plain `git` authenticates fine |
| Playwright MCP | Connected, pinned at 0.0.82 |

Nothing outstanding. Increment 1 can start.

Repository visibility matters more than it looks: `design.md` §6 claims hosting costs nothing, and that claim depends
on the repository being public. It is, confirmed by fetching it unauthenticated. A red team pass flagged that the
design asserted free hosting without ever stating the visibility it rests on.

Public also means every commit's author email is publicly visible once anything is pushed. Nothing has been pushed
yet, so this is the one cheap moment to decide about that — see the note at the end of this document.

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

**Rollback starts with `git revert` and is not finished by it.** Worth knowing because content bypasses your review by
design, which makes CI the only gate in front of it. *Corrected 24 September 2026: this said reverting the commit and
letting the workflow run again "is the whole recovery path". It is not. A revert does not unpublish, because Pages keeps
serving the last successful deployment; and reverting a commit that contains the workflow file deletes the workflow, so
the revert has nothing to run. The full procedure is now in `technical-design.md` under Rollback.*

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

**Both URLs are now real, 24 September 2026.** The dev server binds to `http://localhost:5173/heeler-pub-quiz/` and the
site is at `https://nickarrow.github.io/heeler-pub-quiz/`, so the argument is
`--allowed-origins=http://localhost:5173;https://nickarrow.github.io`. Semicolon-separated, confirmed against the
0.0.82 README, which also states in its own words that the flag is not a security boundary and does not affect
redirects. Two things it cannot do: the list takes origins, so it cannot be scoped to the `/heeler-pub-quiz/` path, and
it therefore permits any site on `nickarrow.github.io`. Handed to the owner to apply rather than applied here, because
the config is user-level and shared across projects.

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

**Needs from you.** The push credential, per prerequisites. *Corrected 24 September 2026: it needed two more things
than that. A decision on the footer notice's wording, including whether it names the show, since nothing in the
documents settled that and the notice publishes to the internet. And permission to edit a user-level MCP config, which
sits outside this workspace and is shared by every project.*

**Done, 24 September 2026.** Live at `https://nickarrow.github.io/heeler-pub-quiz/`, on commit `2995f5b`. Verified in a
real browser rather than from the workflow: the page loads, the accessibility tree carries the question, the badge and
the footer notice, and all four requests returned 200 with no asset 404ing. Every step of both jobs reported success
rather than skipped. What was observed, what was deviated from and what was left unverified are in
`verification-log.md` under the same date.

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

**Done, 24 September 2026.** `scripts/fetch-corpus.ts` and `scripts/corpus-sources.ts` fetch Wikipedia's episode list
and the wiki's episode articles and `/Script` transcript pages into `.corpus/`, pinned to `en.wikipedia.org` and
`blueypedia.fandom.com` with no search step. What was verified is that the **transform is deterministic**: two fetches
from clean produced byte-identical content across all 364 content files. That is not the same as the corpus being
reproducible for all time — the source is a live wiki with no revision pinning, so a rerun on a later date can differ
if an article was edited. The corpus is a dated snapshot; the script that produces it is what is committed and stable.
`git status` showed only the two scripts, never the corpus. The four open questions were answered with computed numbers:

- **206 non-redirect `/Script` pages** (151 at 10 KB or more), which reconciles the earlier 206-vs-220 disagreement —
  220 had counted redirect pages as well as real ones.
- **Contested Evidence does not survive as a round:** roughly three to five genuine contested facts exist, not ten. It
  becomes a scattered question type, and an eleventh theme — an owner choice, surfaced in increment 7 — takes the slot.
- **The five second rounds, ratified by the owner:** The Support Act, Say That Again, Games They Invented, Props
  Department and Family Trees, on depth evidence rather than the first draft's guess.
- **The scope assumption held:** 52 + 52 + 50 = 154 aired episodes, 21 Bonus Bits, 21 minisodes, all confirmed against
  the corpus.

What was measured, how, and what was left unverified are in `verification-log.md` under the same date.

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

**Done, 24 September 2026.** All six phases play through on fixtures, on two local commits (a `content:` commit for the
ten-question fixture round and a `feat:` commit for the app, never mixed), not pushed. Verified through Playwright MCP
rather than asserted: named two teams, played all ten questions across all three answer shapes, scored each, reached the
podium, and the standings read out of the accessibility tree derived correctly (Chilli 3, Bandit 1) and survived a
mid-round reload. Pause holds the timer, the keyboard drives the whole loop, and the two-bank guarantee still holds in
the rebuilt bundle. Five-reviewer pass; the blocking finding (a team-id counter that reset on reload) and the
brick-on-reload paths were fixed, the two untested load-bearing paths (timer, persistence) got tests, and 61 tests, lint,
validate and build are all green. What was observed, what was fixed, what was rejected or deferred, and what was left
unverified are in `verification-log.md` under the same date.

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

**Done, 24 September 2026.** Twelve short fixture rounds and the dealing logic, on two local commits (a `content:`
commit splitting the bank into twelve rounds and a `feat:` commit for dealing), not pushed. Verified through Playwright
MCP: three full games back to back dealt twelve distinct rounds with no repeat (game 1 rounds one to four, game 2 five
to eight, game 3 nine to twelve, all computed distinct from the collected titles), and the fourth attempt reported the
pool exhausted rather than recycling. Reset behind a confirmation restored the pool; served-rounds was observed holding
the four dealt rounds on the round-1 intro before any question was played, confirming served-on-deal. Four-reviewer
pass; the blocking finding (a `served-rounds` key loaded without shape validation, which could brick the app on a
corrupt value) was fixed and re-verified in the browser, and the served-marking path got an integration test. 72 tests,
lint, validate and build all green; the two-bank guarantee holds in the rebuilt bundle. The Playwright pass used the
short rounds, so it ran 36 question cycles rather than the 120 this section anticipated for ten-question rounds — the
no-repeats property is a function of rounds dealt, not questions, so the shorter pass proves it. Details, what was fixed
or deferred, and what was left unverified are in `verification-log.md` under the same date.

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

**Done, 24 September 2026.** The flags key, dispute, void, and the review screen with export, on one local `feat:`
commit, not pushed. Verified through Playwright MCP exactly as this section specifies: scored a question for two teams,
voided it, and read both totals back from the accessibility tree as zero (the increment-3 scoring constraint doing its
job); disputed another without interrupting the reveal; finished the game and confirmed both flags on the review screen
with their `(fixtures)` bank markers, then captured the export download and parsed it to confirm the summary and that
every flag carries its bank marker. The bank marker that keeps fixture-era disputes out of increment 9's error-rate
export is the increment-1-review concern this increment was to solve, and it is solved. Four-reviewer pass; a
blocking-rated cross-game void bleed was traced and rejected as unreachable (served gates re-dealing) but hardened with
an invariant test, and three real should-fix findings (a silent flags-degradation notice, an export object-URL leak on
throw with no test, an unstable callback dependency) were fixed. 92 tests, lint, validate and build all green; the
two-bank guarantee holds. Details, what was fixed, rejected or deferred, and what was left unverified are in
`verification-log.md` under the same date.

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

**Done, 24 September 2026.** The room, on one local `feat:` commit, not pushed. The machine half was verified through
Playwright MCP: the type scale is fluid and rem-based (heading 48px at 1080p, responds to zoom), scoring targets measure
44x44 and carry team names, the stepper is a spinbutton announcing its value, the live region changes on every score,
focus is visible on Tab, and the pausable countdown still works. The human half was verified by the owner, who viewed
the app windowed and full-screen and pasted screenshots confirming legibility and layout. Four-reviewer pass; no
blocking findings, and six should-fix findings were fixed — a contrast comment that overstated three ratios (all still
AA; corrected to recomputed values), disabled stepper buttons that dimmed to an unreadable ~2.2:1 (raised to 60%
opacity), a long prompt that could push the save button below the fold (type ceiling reduced), the setup submit button
reimplementing the shared Button, the 44px target written five ways (extracted a constant), and an implicit
secure-context check (made explicit). 99 tests, lint, validate and build all green; the two-bank guarantee holds. Two
Tailwind-4 mechanism traps (font-size token namespace, comments in `@theme`) were caught by the build gate and fixed. A
deliberate deviation — a rounded system-font stack rather than fetching Nunito — is recorded and owner-accepted. Details
and what was deferred are in `verification-log.md` under the same date.

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

**The eleventh-theme choice surfaces here.** Increment 2 cut Contested Evidence as a round and left an open slot;
`design.md` §5 says which theme fills it is the owner's call, not an authoring one. So this increment also hands the
owner a shortlist of themes deep enough to carry a second round, with the depth signal behind each. The owner picks;
increment 8 authors it. The shortlist names themes, not questions, so choosing does not require reading the bank.

**Needs from you.** Not reading the round. One decision: pick the eleventh theme from the shortlist above.

**Done, 24 September 2026.** The Support Act round 1, ten questions, on `content:` commits, pushed; CI green. The
real-bank provenance checks were turned on here — `validate:content` went from 5 checks with 4 real-bank skipped to
the full set, 0 skipped. Twelve candidates authored, all twelve survived both checks (blind re-derivation with the
answer withheld, then a second-source cross-anchor), ten shipped at tier mix 3/5/2 with a verification record each.
That survival rate is what increment 8 authored against. The deploy still served fixtures, verified by bundle grep.
The owner picked the eleventh theme (Where and When) and, separately, asked for For the Grown-Ups too as a test. What
was verified is in `verification-log.md` under the same date.

## 7a. The preview bank and the prompt-spoiler safeguard

Inserted before authoring the bank, on the owner's 7a shape review. Not in the original plan; recorded here so the
increment list matches what shipped.

**Delivers.** A third bank the owner can read in full without spoiling anything the real bank will ever ship: eight
preview questions, drawn from five episodes that the real bank must then avoid, listed in
`content/preview-exclusions.json`. The bank selection becomes three-way through one tri-valued `HEELER_BANK` (unset
falls to fixtures; `preview` and `real` are the two deliberate values), with a badge for the preview build and a
`dev:preview` command. And the safeguard the shape review demanded: a content rule, `checkPromptsSpoilNothing`, that
fails a build if any prompt contains its own answer as a substring, run on all three banks.

**Deliberately not.** Any real-bank question. The preview set is disjoint from the real bank by the exclusion list.

**How you know it worked.** The preview build shows the preview badge and preview questions; the default build shows
fixtures; neither the default nor the preview build carries a real question. The spoiler rule fails on a deliberately
spoiled question and passes the bank.

**Needs from you.** The 7a shape review — done: the owner cleared the shape and flagged the answer-in-prompt case
(Yoga Ball), which the rule now guards.

**Done, 24 September 2026.** The three-way bank, eight preview questions, the exclusion list, and the prompt-spoiler
rule, on `feat:`, `content:`, and `docs:` commits, pushed. Verified through Playwright MCP (preview badge in the
preview build; fixtures by default) and by bundle grep (no real or preview question in the default build). The
spoiler rule was negative-tested and later caught real cases in increment-8 authoring. What was verified is in
`verification-log.md` under the same date.

## 8. The rest of the bank, then the switch

**Delivers.** The remaining rounds at whatever survival rate increment 7 measured. Twelve shippable rounds is the
floor and buys three games; fifteen if the corpus allows. The eleventh theme — the one that replaces Contested
Evidence as a round, chosen by the owner in increment 7 from the shortlist — is authored here.

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

**Done, 24 September 2026.** Eleven more real rounds (twelve total, 120 questions) and the deploy switch, on `content:`
commits and one `feat:`, pushed to main; CI green on each. Counts were computed by loading the bank, not estimated:
12 rounds, 120 questions, ten per round, unique ids, 120 verification records, tier mix 3/5/2 on eleven rounds and
2/6/2 on where-and-when-1 (within the ±1 tolerance). The switch sets `HEELER_BANK: real` on the deploy build step
only; built both ways locally to confirm the real bank ships with it and fixtures without it. The live site was
smoke-checked through Playwright MCP: real bank served, ten questions per round, every reveal shows an answer and an
episode, and three games dealt all twelve distinct rounds with no repeat (the app refused a fourth rather than
repeat). No question content was reported back.

Fifteen was not reached: three would-be rounds were dropped rather than shipped short, which `design.md` §5 sanctions
— For the Grown-Ups (too little checkable), a merged Names/Titles/Alter Egos round (too few clean facts), and Family
Trees round 2 (only three clean two-source non-reused family facts). A third Say That Again round reached the
twelve-round floor. The four-reviewer fan-out fixed one guard-test gap (the deploy guard now fails if the real
assignment is removed, not just if the comment stays) and logged the rest as recommendations. All of this is in
`verification-log.md` under the same date.

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
| Whether Contested Evidence survives as a round | 2 — **closed: it does not.** See the increment 2 note above |
| Which five themes get a second round | 2 — **answered and owner-ratified**, revisable in 7 if a theme underdelivers |
| Which eleventh theme replaces Contested Evidence | 7 — owner picks from a shortlist; authored in 8 |
| Default timer length | 9 — it needs real pace, which means real teams. Increment 6 is one person with a keyboard |
| Whether three games is the finish line | 9 |
| Tiebreaks | Still open, not blocking |

## One decision before the first push

> **Stale, 24 September 2026.** This section's premise no longer holds and it is left in place rather than deleted,
> because the direction of the error matters. Six commits were already on `origin/main` before increment 1 began, all
> six carrying the owner's personal address, confirmed with `git log --format='%ae'`. The cheap moment described below
> had already passed by the time anybody read this. Raised with the owner on 23 September 2026, who decided to leave it
> as it is; git configuration is theirs, and the address is public either way now. The remedy at the end of this section
> is no longer available without rewriting published history.
>
> The literal address has also been taken out of this document's prose. It remains permanently public in the commit
> metadata, so this achieves little — but file text is indexed differently from commit metadata, and removing one
> surface costs nothing.

The commits made so far carry the owner's personal address as the author email, because that is what `user.email` is set
to globally. Pushing to a public repository publishes that address in the commit history, where it is readable and
scrapeable.

That may be entirely fine and deliberate — plenty of people commit to public repositories under a real address. It is
raised here only because **nothing has been pushed yet, which makes this the last cheap moment**. Afterwards the
address is out regardless of what the repository does later.

If it should change, the sequence is: turn on email privacy in GitHub's settings to get a `users.noreply.github.com`
address, set `user.email` to it, and rewrite the five existing commits' author. All five are local and unpushed, so
that rewrite is safe and touches nothing anybody else has seen. Doing it after a push means rewriting published
history, which is a different and worse conversation.

Recorded as a decision rather than acted on: git configuration is the owner's to change.
