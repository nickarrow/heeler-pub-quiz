# Heeler Pub Quiz — technical design

How it is built. `design.md` says what it is and why; this says how, and is the document to check against
implementation.

Written 23 September 2026. Split out of `design.md` after review, because that document had grown to 377 lines and
the technical half was where its reader stopped. `content-pipeline.md` and `verification-log.md` came out of the same
split.

---

## Words used here

Defined because a reader who has to guess at one of these cannot judge any of the decisions that follow.

| Term | What it means here |
| --- | --- |
| Static site | Plain files — HTML, JavaScript, CSS — served as-is. No program runs on a server. |
| Build | The step that turns source files into those plain files. |
| Bundle | The JavaScript file the build produces. Anything inside it is readable by anyone who looks. |
| Module graph | Every file the app reaches by importing, directly or through other imports. If a file is not in the graph, the app cannot use it. |
| Alias | A rule in the build configuration that redirects one import name to a chosen file. |
| Base path | The subfolder a site is served from. A GitHub project site lives under `/repo-name/`, so the build has to be told. |
| Environment variable | A value set outside the code, usually by whoever runs the build. |
| CI | Continuous integration. A script GitHub runs automatically on a push, here to check and publish. |
| Secure context | A page served over HTTPS. Some browser features refuse to work without it. |
| `rem` and `clamp()` | CSS units. `rem` scales with the reader's chosen text size; `clamp()` sets a floor, a preference and a ceiling. |
| Success criterion | A numbered, testable rule in the accessibility standard. "AA" is the level this project targets. |

## Architecture

TypeScript and React, built with Vite, styled with Tailwind. Static output published to GitHub Pages.

No backend, no database, no network requests while the game is running. The question bank is compiled in at build
time. State lives in React; three keys in the browser's local storage make it survive a refresh.

**No router.** The first draft specified hash routing and justified it with a claim about GitHub Pages that was
half right and, more to the point, was solving a problem this app does not have. The game is six phases of one
screen, held in state. There are no URLs to route between. Removing the router removes a dependency, a concept and
a wrong sentence.

`base` must be set to `'/heeler-pub-quiz/'` in the Vite configuration. Without it every asset URL points at the
domain root and the deployed site loads nothing. This is the single most likely first-deploy failure.

## The two banks, and the mechanism that actually works

`design.md` §3 promises that no build which is not an explicit production build can render a real question. Here is
how, and what it still does not cover.

**What the first draft got wrong.** It said a flag would switch banks, implying `import.meta.env.DEV`. Vite's own
documentation has a table showing `NODE_ENV` and mode are different things, and that `vite build --mode development`
sets `NODE_ENV` to `production` — which makes `import.meta.env.DEV` false and would have loaded the **real** bank
from a command that looks like the safe one. Verified at
[Vite env and mode](https://vite.dev/guide/env-and-mode.html), 23 September 2026.

**What replaces it.** A build-configuration alias, resolved before any app code runs:

```ts
// vite.config.ts
const useRealBank = process.env.HEELER_REAL_BANK === '1'

export default defineConfig({
  base: '/heeler-pub-quiz/',
  resolve: {
    alias: {
      '@bank': useRealBank ? './content/rounds/index.ts' : './src/content/fixtures/index.ts',
    },
  },
})
```

The app contains exactly one import of the bank, `from '@bank'`, and never names either file. Three properties
follow:

- **Only one bank is ever in the module graph.** This is not dead code that gets removed later; the other file is
  never reached at all, in development or in a build.
- **The default is the safe one.** Absence of the variable means fixtures, so forgetting it produces the harmless
  outcome. The unsafe path requires an explicit act.
- **One place sets it.** The deploy workflow, and nowhere else. `npm run build` on the owner's machine produces
  fixtures.

A test asserts the default resolution is the fixture bank, so this cannot regress unnoticed.

**What it does not cover, stated plainly.** The real bank is still a file on disk in an open editor, and a published
production bundle still contains the questions in readable form. Neither is solvable and neither is worth theatre.
The mechanism removes every accidental path; the deliberate ones are the honour system, which is what `design.md`
says it is.

## Data model

TypeScript modules, not JSON. The reason is specific: TypeScript widens JSON imports, so `tier: 1 | 2 | 3` and the
tagged union below would not be checked without a cast. Content authored as `.ts` with `satisfies Round` is checked
by the compiler, which turns these types from documentation into a test that runs on every build.

```ts
type Citation = {
  episode: string          // "Sleepytime"
  series: 1 | 2 | 3
  episodeInSeries: number
}

type AnswerShape =
  | { kind: "single"; answer: string; alsoAccept?: string[] }
  | { kind: "list"; answers: string[]; maxPoints: number }
  | { kind: "contested"; options: { answer: string; why: string }[]; scores: "either" | "all" }

type Question = {
  id: string              // stable across edits; never reused
  prompt: string
  tier: 1 | 2 | 3
  answer: AnswerShape
  note?: string           // one line on the reveal
  source: Citation
}

type Round = {
  id: string              // "support-act-1"
  theme: string
  title: string
  blurb: string           // one line of framing, checked against its own round's answers
  questions: Question[]   // exactly ten
}
```

What to check when reading this, since "it looks fine" is not a review: that every field the reveal screen needs is
present, that `AnswerShape` covers the three shapes in `design.md` §5 and nothing else, that nothing here requires a
value the authoring pipeline cannot produce, and that `id` is the only field a later edit must not change.

The verification record lives in `content/verification/`, keyed by question id, holding the source URL and an excerpt
capped at 40 words. It is never imported by the app, which is what keeps it out of the bundle. Two things would break
that and are therefore forbidden: putting it in the `public/` directory, which is copied wholesale into the build
regardless of imports, and sharing a directory-wide import between the tests and the app.

## Persisted state

Three keys, version-prefixed so a change of shape can be migrated or discarded without leaving a half-readable
object behind.

```
heeler-pub-quiz/v1/served-rounds   string[]
heeler-pub-quiz/v1/game            current game, or absent
heeler-pub-quiz/v1/flags           disputed and voided questions
```

`served-rounds` is what stops repeats between games. Round-level rather than question-level, because it is simpler
and it matches themed rounds.

**A round is marked served when it is dealt, not when the game finishes.** An evening abandoned at round two must not
put half-seen questions back in the pool. When the pool is exhausted the app says so plainly and offers the reset,
rather than silently recycling.

`game` exists so a refresh or an accidental tab close does not end the evening. `flags` is what makes the error rate
in `content-pipeline.md` §4 computable; it holds question ids, a dispute note, and whether the question was voided.

Controls: **new game**, which deals four unserved rounds; **reset**, which clears served rounds after confirming; and
a **review screen** listing flags with an export.

### Storage failures

The first draft covered "a missing or malformed key", which is not the realistic set.

| Failure | Behaviour |
| --- | --- |
| Key absent | Treat as a fresh start. Normal, not an error. |
| Value unparseable | Discard that key, carry on, say so once. |
| Storage unavailable — private browsing, or disabled | Play anyway, entirely in memory, with one quiet notice that a refresh will lose the evening. |
| Write rejected on quota | Same as above. Never lose a game in progress to a failed write. |

The rule behind all four: a storage problem degrades persistence and never interrupts play.

## Presentation

Blue, orange and cream, and a friendly rounded free sans such as Nunito. No character artwork, no title-card
lettering, no theme music, no screenshots. The vibe comes from colour, shape and warmth, none of which belongs to
anybody.

Built for a sofa three metres from a television.

**Type scale.** `clamp()` with `rem` endpoints and a viewport-based preference, not raw viewport units. Raw `vw` does
not respond when a reader increases text size, which is what success criterion 1.4.4 Resize Text is about; `rem`
endpoints do. Viewport units also track the browser window rather than the panel, so a cast tab, a windowed TV
browser, or a set doing overscan all change the result — test at 1080p, and test a cast tab separately, because it is
the likelier setup.

**Contrast and colour.** 4.5:1 for body text and 3:1 for large text, per 1.4.3. Correct and incorrect are never
signalled by colour alone, per 1.4.1.

**The scoring interaction, which the first draft treated as invisible.** It is the most-used control in the app and
it was specified only as "one or two taps". So: targets at least 44 by 44 CSS pixels, comfortably above the 24-pixel
minimum in 2.5.8; each team's control carries the team name as its accessible name, not just a position; the list
stepper is a real spin control that announces its value; and a score change is announced in a live region rather than
only appearing.

**Keyboard.** Space reveals, arrows advance, `P` pauses, with visible focus per 2.4.7. Someone is driving this from a
sofa, possibly with a remote pretending to be a keyboard.

**The countdown can be paused**, and this is an accessibility requirement rather than a nicety. Success criterion
2.2.2 covers auto-updating information shown alongside other content, and its exception is for updates that are
*essential* — defined as something whose removal would fundamentally change the functionality. This timer enforces
nothing by design, so the exception is hard to claim. The standard's own worked example is a turn-based game that can
be paused without spoiling the competition. Read at
[WCAG 2.2, Pause Stop Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).

**Screen wake lock**, so the television does not sleep during a long discussion. The Screen Wake Lock API needs a
secure context, which Pages provides, and the lock is released whenever the document loses visibility, so it must be
reacquired on `visibilitychange`. Feature-detect and degrade silently: an absent wake lock is a mild annoyance, not a
failure. Note this was claimed as already-in-the-design in the research document while appearing in neither document;
it is specified here and that claim has been corrected.

**Reduced motion.** `prefers-reduced-motion` respected.

## Testing

Tests as the thing that says when to stop, concentrated where the risk is.

**Content validation.** The highest-value tests in the project, because they are what keeps the bank honest.

- Every shipped round has exactly ten questions. A round with fewer is dropped, not shipped short.
- Every question has a verification record, and every excerpt is 40 words or fewer.
- Question ids are unique across the whole bank and never reused after an edit.
- Tier mix is 3 / 5 / 2 per round, tolerated at plus or minus one on any tier. The first draft said "within tolerance"
  and gave no number, which made the test unwritable.
- A round's blurb does not contain any answer string from its own round. Cheap, and it catches the one way a blurb
  can spoil its own questions.

**Round dealing.** No repeats across three consecutive games. Correct behaviour when the pool is exhausted. Served on
deal, not on finish.

**Scoring.** All three answer shapes, including list caps and contested rules, plus a voided question scoring zero for
every team and not just the disputing one.

**Persistence.** Restore a game mid-round. Every row of the storage-failure table above.

**The bank guard.** The default alias resolution is the fixture bank, and the fixture bank covers all three answer
shapes.

**When validation fails.** Content validation is a script that exits non-zero, and CI runs it before the build. A bank
that fails does not deploy. It is not a warning in a log and it does not fall back to a smaller game — a bad bank
stops the release, because a quietly shortened bank is worse than a failed deploy.

## Build, CI and deploy

GitHub Pages with its source set to GitHub Actions, because there is a build step.

The workflow, in order: install, typecheck, validate content, test, build with `HEELER_REAL_BANK=1`, deploy. Each step
gates the next.

That is the only place the real bank is ever selected, which is what makes the guarantee in `design.md` §3 a property
of the pipeline instead of a habit. `design.md` listed the tests and never said anything ran them; this is that gap
closed.

## Git workflow

Two rules, and the second one exists because of a collision the review found.

**App changes go on a branch and through a pull request**, one feature per request, with the commit message shown
before it is made. That is what AGENTS.md asks for and there is no reason to deviate.

**Content changes go straight to `main`**, prefixed `content:`, with a message that names counts and which rounds
were touched and never quotes a question or an answer. The reason: a pull request touching `content/rounds/` puts the
answers in a diff the owner would read while reviewing it, which defeats the entire two-bank scheme. The build
configuration can keep questions out of a development build; it cannot keep them out of a code review the owner
performs. So content is not reviewed by the owner, by design, and the post-play sampling in `content-pipeline.md` §4 is
what replaces that review.

**Never mix the two in one commit.** An app change that touches a content file is two commits.

## What this design does not guarantee

- That a published bundle hides its questions. It does not, and cannot.
- That the owner never sees a question. Only that no ordinary command shows them one.
- That the app works with no network on first load. No service worker, ruled out in `design.md` §8.
- That it behaves well on a television's built-in browser. Wake lock, viewport behaviour and overscan on Tizen or
  webOS are untested, and no vendor documentation was read. A laptop on HDMI is the supported path.
- That the accessibility criteria named here are the complete set. They are the ones a timed, colour-coded,
  large-screen quiz obviously touches. Full conformance needs testing with assistive technology and expert review,
  neither of which has happened.
