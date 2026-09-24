# Heeler Pub Quiz — order of work

In what sequence, and why that sequence. Separate from `design.md` on purpose: that document says what and why, and
keeping them apart is what stops a stale assumption hiding inside a task list.

Written 23 September 2026, against the design as committed at that date.

**The rule this plan follows:** each increment leaves something that works. One increment breaks that rule, and it
says so rather than pretending.

---

## Prerequisites

Checked on this machine, 23 September 2026, rather than assumed:

| Needed | State |
| --- | --- |
| Node | v24.12.0, present |
| npm | 11.6.2, present |
| GitHub CLI (`gh`) | **Not installed** |
| A GitHub repository | Exists, blank: `nickarrow/heeler-pub-quiz` |
| Pages source set to GitHub Actions | **Not done yet** |

Two things remain. The Pages source has to be set to GitHub Actions rather than a branch, because there is a build
step, and that is an owner action in the repository settings taking about a minute. And without `gh`, pushing needs
the remote configured and credentials available to plain `git` — the remote is added but nothing is pushed until the
local state is worth publishing.

Nothing else. No accounts, no API keys, no paid services, no local database.

## 1. Walking skeleton — one fake round, playable, deployed

The whole stack, end to end, with content that does not matter yet.

**Delivers.** A Vite, React, TypeScript and Tailwind project. One hand-written fixture round of ten questions
covering all three answer shapes. All six phases from setup to podium. Scoring for each shape. The three storage
keys. The countdown, with pause, because a timer that enforces nothing cannot claim the accessibility exception and
pause is one state flag. The bank alias from `technical-design.md`. `base` set for a project site. A GitHub Actions
workflow that installs, typechecks, validates content, tests, builds and deploys. Live on Pages.

**Deliberately not.** More than one round. Dealing and no-repeat logic. Dispute and void. Wake lock. Any real
question. Any type-scale or contrast work beyond defaults.

**Why this shape.** It touches every layer — content module, types, state machine, screens, scoring, storage, build,
deploy — so nothing structural is left as a surprise for later. It also proves the bank alias and the CI gate before
a single real question exists, which is the order that makes them worth having.

**An ordering problem found while writing this plan.** The deploy workflow is supposed to set `HEELER_REAL_BANK=1`,
and in increment 1 there is no real bank for it to select. So increment 1 deploys **fixtures**, deliberately: the
alias is built and its guard test asserts the default resolves to fixtures, but the workflow does not set the
variable until increment 3. A pleasant side effect is that the first deployed site is safe to look at and safe to
screenshot.

**How you know it worked.** Open the Pages URL, name two teams, play ten questions, see a podium. Refresh mid-round
and carry on where you were. Drive the whole thing with the keyboard.

**Needs from you.** The repository and the Pages setting, per prerequisites above.

## 2. Corpus fetch and a reality check

**Delivers.** The fetch script, pinned to `blueypedia.fandom.com` and Wikipedia, writing into `.corpus/`, which is
gitignored. The script is committed; its output never is.

Then the part that matters more: written answers to the things the design guesses at.

- Do ten genuinely contested facts exist, or does Contested Evidence need to stop being a round?
- Which themes actually have depth, so the five second rounds get allocated on evidence rather than expectation?
- How many transcript pages are there, measured with a stated threshold and a date, since two earlier counts
  disagreed?
- Does anything in the scope assumption break on contact with the corpus?

**Deliberately not.** Any questions. This increment reads, counts and reports.

**This is the increment that breaks the rule.** It leaves a working script and a set of answers, not working
software. That is a deliberate trade: these questions would otherwise get answered by authoring 180 questions against
a plan that turns out to be wrong. Keeping it early and small is the cheap version.

**Why it is not first.** The app does not care what the rounds are about. Nothing the fetch can discover changes the
skeleton, so there is no reason to delay proving the stack.

**How you know it worked.** The script reruns from clean and produces the same corpus. `design.md` §5 and §9 get
updated with answers instead of expectations, and `verification-log.md` gets a dated entry.

**Needs from you.** Nothing.

## 3. One real round through the whole pipeline

A pipeline proof, not a content push.

**Delivers.** Twelve candidate questions for a single round, authored against the corpus. Both checks run — blind
re-derivation with the answer withheld, then cross-anchor against a second source. Survivors shipped to
`content/rounds/`, verification records to `content/verification/`. The deploy workflow starts setting
`HEELER_REAL_BANK=1`.

**And one number.** How many of the twelve survived. That is what tells us whether two candidates of slack per round
is enough, and it is much better to learn it now than after fourteen more rounds depend on it.

**Deliberately not.** The other fourteen rounds.

**How you know it worked.** One real round is live and playable, and the cut rate is written down. If fewer than ten
of twelve survive, `design.md` §5's arithmetic changes here, before increment 7, rather than being discovered as a
shortfall at the end.

**Needs from you.** Nothing, and specifically not reading the round.

## 4. Multiple rounds and the dealing logic

**Delivers.** `served-rounds` in use. New game deals four unserved rounds. Correct behaviour when the pool runs out,
which is to say so plainly rather than recycle. Reset behind a confirmation. Served on deal, not on finish, so an
abandoned evening does not leak half-seen questions into the next one.

**Deliberately not.** The full bank. The tests run against fixture rounds so that dealing logic does not wait on
content progress.

**How you know it worked.** Play two games back to back with no question repeating. Exhaust the pool and get told,
rather than getting a quiet repeat.

**Needs from you.** Nothing.

## 5. Dispute, void, and the review screen

The error-discovery mechanism. This has to exist before the first real evening, which is why it comes before the bulk
of the content.

**Delivers.** The `flags` key in use. Dispute records a question and a note without interrupting anything. Void drops
a question from scoring for every team. A review screen that lists flags and exports them.

**How you know it worked.** Void a question mid-round and confirm no team's score moved because of it. Dispute
another, finish the game, and find it on the review screen and in the export.

**Needs from you.** Nothing.

## 6. The room

Everything that makes it work from a sofa rather than from a desk.

**Delivers.** Type scale using `clamp()` with `rem` endpoints so text zoom still works. Contrast at AA. Scoring
targets at least 44 by 44, each carrying its team's name as its accessible name. The list stepper announcing its
value, and score changes announced in a live region. The full keyboard map with visible focus. Screen wake lock, with
feature detection, reacquired when the document becomes visible. Reduced motion respected.

**How you know it worked.** Tested on the screen you will actually use, from the distance you will actually sit at,
driven by keyboard only.

**Needs from you.** Tell me which screen and whether you cast a tab or plug in an HDMI cable — they behave
differently, and viewport-based sizing is exactly where that difference shows. This is the increment where a
screenshot pasted into chat is worth more than any description of the problem.

## 7. The rest of the bank

**Delivers.** The remaining rounds through the pipeline, at whatever slack rate increment 3 measured rather than the
rate the design guessed. Twelve shippable rounds is the floor and buys three games; fifteen if the corpus allows.

**How you know it worked.** Three games deal without repeating. Content validation passes in CI. The count of shipped
rounds and questions is computed and recorded, not estimated.

**Needs from you.** Nothing.

## 8. Play it, then measure it

The only increment that produces the quality number, and the only one that is mostly yours.

**Delivers.** A real evening. Then the post-play review from `content-pipeline.md` §4: every disputed question, plus
twenty shipped questions drawn at random. An error rate out of a known sample. A decision.

**How you know it worked.** There is a number in `verification-log.md` that somebody computed. Two or more errors in
twenty sends the bank back for a full pass.

**Needs from you.** Play the game, then read twenty questions. That is the whole owner cost of the quality system,
and it is the price of not being in the authoring loop.

## What this plan does not include

- **Tiebreaks beyond playing another round.** Open question 2 in `design.md`, undecided, and nothing here assumes an
  answer.
- **The shorts and minisodes.** Ruled out for launch.
- **Offline support.** Ruled out, and cheap to add later if a room proves it necessary.
- **Anything in `research/phone-join-and-multiplayer.md`.** Parked, with its own note on what would bring it back.

## Which open questions close where

| Question | Closes in |
| --- | --- |
| Whether Contested Evidence survives as a round | 2 |
| Which five themes get a second round | 2 |
| Default timer length | 6, once it has been tested at real pace |
| Whether three games is the finish line | 8 |
| Tiebreaks | Still open, and not blocking |

## Checking this plan

Two things worth doing before increment 1 starts.

Run `/review` over this document. The red team mandate is the one that earns its keep on a plan, and the question to
put to it is whether any increment secretly depends on something a later increment installs. Writing this surfaced
one of those — the deploy workflow selecting a bank that does not exist yet — and there are probably more.

Then dry-run the first increment: *pretend you are executing increment 1, change nothing, and say what you hit.* The
prerequisites table above came from doing a small version of that and finding `gh` missing.
