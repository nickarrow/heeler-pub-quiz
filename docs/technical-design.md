# Heeler Pub Quiz — technical design

How it is built. `design.md` says what it is and why; this says how, and is the document to check against
implementation.

Written 23 September 2026, then corrected the same day after a mechanism review checked the tooling claims against
current documentation and found three of them wrong. Every corrected item is marked.

---

## Words used here

Defined because a reader who has to guess at one of these cannot judge the decisions that follow.

| Term | What it means here |
| --- | --- |
| Static site | Plain files — HTML, JavaScript, CSS — served as-is. No program runs on a server. |
| Build | The step that turns source files into those plain files. |
| Bundle | The JavaScript the build produces. Anything inside it is readable by anyone who looks. |
| Module graph | Every file the app reaches by importing, directly or through other imports. If a file is not in the graph, the app cannot use it. |
| Alias | A rule in the build configuration that redirects one import name to a chosen file. |
| Base path | The subfolder a site is served from. A GitHub project site lives under `/repo-name/`, so the build has to be told. |
| Environment variable | A value set outside the code, usually by whoever runs the build. |
| CI | Continuous integration. A script GitHub runs automatically on a push, here to check and publish. |
| Artifact | A packaged build output that one CI job hands to another. |
| Secure context | A page served over HTTPS. Some browser features refuse to work without it. |
| `rem` and `clamp()` | CSS units. `rem` scales with the reader's chosen text size; `clamp()` sets a floor, a preference and a ceiling. |
| `satisfies` | A TypeScript keyword that checks a value matches a type without widening it. It checks shapes, not counts. |
| Success criterion | A numbered, testable rule in the accessibility standard. "AA" is the level this project targets. |

## Architecture

TypeScript and React, built with Vite, styled with Tailwind, tested with Vitest. Static output published to GitHub
Pages.

No backend, no database, no network requests while the game is running. The question bank is compiled in at build
time. State lives in React; three keys in local storage make it survive a refresh.

**No router.** The game is six phases of one screen held in state. There are no URLs to move between. The first draft
specified hash routing and justified it with a claim about GitHub Pages that was half wrong and, more to the point,
was solving a problem this app does not have.

**`base` must be `'/heeler-pub-quiz/'`.** Without it the built asset URLs point at the domain root and the deployed
site loads nothing. This is the most likely first-deploy failure.

One second-order consequence the first draft missed: assets imported from JavaScript, and URLs inside CSS, are
rebased automatically. Anything placed in `public/`, and any hand-written link, needs `import.meta.env.BASE_URL` —
written exactly like that, because the replacement is textual and bracket access is not substituted.

**Tailwind is version 4 and installs differently from version 3.** `npm install tailwindcss @tailwindcss/vite`, add
the plugin to the Vite config, and `@import "tailwindcss";` in the stylesheet. There is no `tailwind.config.js`, no
PostCSS step and no content globs; configuration is CSS-based. *Corrected: the first draft named no version, and
following it would have produced the version 3 setup.*

## File layout for content

| Path | Holds | Typechecked | Importable by the app |
| --- | --- | --- | --- |
| `src/content/fixtures/` | The fixture bank | Yes | Yes, via the alias |
| `src/content/rounds/` | The real bank | Yes | Yes, via the alias |
| `content/verification/` | Source URL and excerpt per question, as JSON | No | **No** |
| `.corpus/` | Raw fetched transcripts and articles, gitignored | No | No |

Both banks live under `src` for a specific reason. The scaffold's `tsconfig.app.json` ends with `"include": ["src"]`,
so anything outside `src` is never seen by the compiler. *Corrected: the first draft put the banks at the repository
root and claimed `satisfies Round` made the types "a test that runs on every build". That was false — the compiler
would not have looked at them.*

The verification records stay outside `src` and stay JSON, which is the stronger arrangement. They are data read by a
validation script, not code, and keeping them out of the compiled tree is a guarantee rather than a rule about
remembering not to import them. Two things would still break it and are therefore forbidden: putting them in
`public/`, which is copied into the build wholesale regardless of imports, and sharing a directory-wide glob between
the tests and the app.

## The two banks, and the mechanism that actually works

`design.md` §3 promises that no build which is not an explicit production build can render a real question.

**What the first draft got wrong, twice.** It said a flag would switch banks, implying `import.meta.env.DEV` — but
Vite derives that from `NODE_ENV`, and `vite build --mode development` sets `NODE_ENV` to `production`, so a command
that looks like the safe one would have loaded the real bank. Then the replacement used relative paths, and Vite's
documentation is explicit that relative alias values are used as-is and never resolved into filesystem paths, so the
import would simply have failed.

**What works:**

```ts
// vite.config.ts
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const useRealBank = process.env.HEELER_REAL_BANK === '1'

export default defineConfig({
  base: '/heeler-pub-quiz/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@bank': resolve(
        import.meta.dirname,
        useRealBank ? 'src/content/rounds/index.ts' : 'src/content/fixtures/index.ts',
      ),
    },
  },
})
```

The app contains exactly one import of the bank, `from '@bank'`, and never names either file. Three properties
follow:

- **Only one bank is ever in the module graph.** Not dead code removed later — the other file is never reached, in
  development or in a build.
- **The default is the safe one.** Absence of the variable means fixtures, so forgetting it produces the harmless
  outcome.
- **One place sets it.** The deploy workflow, and only from increment 8 onward. `npm run build` on your machine gives
  fixtures.

**TypeScript needs telling separately.** A `paths` entry mapping `@bank` to the fixture bank goes in
`tsconfig.app.json`, not the root config — the scaffold's root is solution-style, holding only `files` and
`references`. The real bank is still typechecked, because it lives under `src` and is covered by `include`, not
because anything imports it through the alias.

A test asserts the default resolution is the fixture bank, so none of this can regress unnoticed.

**What it does not cover, stated plainly.** The real bank is a file on disk in an open editor, and a published
production bundle contains the questions in readable form. Neither is solvable and neither is worth theatre. The
mechanism removes every accidental path; the deliberate ones are the honour system.

## Data model

TypeScript modules, not JSON, because TypeScript widens JSON imports and the tagged union below would not be checked
without a cast.

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
  questions: Question[]
}
```

**What `satisfies Round` catches and does not.** It catches wrong value types, excess keys, and a `tier` outside
1 to 3. It cannot count ten questions, enforce id uniqueness across files, count forty words in an excerpt, or check a
blurb against its round's answers. Every one of those is runtime code in the validation script, and the first draft
leaned on the compiler for work it cannot do.

Note `questions` is not typed as a ten-tuple. Ten is a rule about the real bank, enforced at validation time, because
fixture rounds are deliberately short.

## Persisted state

```
heeler-pub-quiz/v1/served-rounds   string[]
heeler-pub-quiz/v1/game            current game, or absent
heeler-pub-quiz/v1/flags           disputed and voided questions
```

`served-rounds` stops repeats between games. Round-level rather than question-level: simpler, and it matches themed
rounds.

**A round is marked served when it is dealt, not when the game finishes.** An evening abandoned at round two must not
put half-seen questions back in the pool. When the pool is exhausted the app says so and offers the reset rather than
silently recycling.

**Scoring stores per-question results and derives totals.** It does not accumulate a running per-team number. This is
a constraint, not a preference: voiding a question removes it from scoring for every team after the fact, and a
running total cannot retroactively drop one. Getting this wrong in the first app increment means rewriting scoring in
the fifth.

### Storage failures

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
anybody. An unofficial-and-unaffiliated notice sits in the footer on every screen.

Built for a sofa three metres from a television.

**Type scale.** `clamp()` with `rem` endpoints and a viewport-based preference, not raw viewport units. Raw `vw` does
not respond when a reader increases text size, which is what success criterion 1.4.4 is about; `rem` endpoints do.
Viewport units also track the browser window rather than the panel, so a cast tab, a windowed TV browser, and a set
doing overscan all differ — test at 1080p and test a cast tab separately, because it is the likelier setup.

**Contrast and colour.** 4.5:1 for body text and 3:1 for large text, per 1.4.3. Correct and incorrect are never
signalled by colour alone, per 1.4.1.

**The scoring interaction**, which the first draft treated as invisible despite it being the most-used control. Targets
at least 44 by 44 CSS pixels, comfortably above the 24-pixel minimum in 2.5.8. Each team's control carries the team
name as its accessible name, not a position. The list stepper is a real spin control that announces its value. A score
change is announced in a live region rather than only appearing.

**Keyboard.** Space reveals, arrows advance, `P` pauses, with visible focus per 2.4.7. Someone is driving this from a
sofa, possibly with a remote pretending to be a keyboard.

**The countdown can be paused**, and this is a requirement rather than a nicety. Criterion 2.2.2 covers auto-updating
information shown alongside other content, and its exception is for updates that are *essential* — defined as
something whose removal would fundamentally change the functionality. This timer enforces nothing by design, so the
exception is hard to claim. The standard's own example is a turn-based game that can be paused without spoiling the
competition.

**Screen wake lock**, so the television does not sleep during a long discussion. It needs a secure context, which
Pages provides, and the lock releases whenever the document loses visibility, so it must be reacquired on
`visibilitychange`. Feature-detect and degrade silently.

**Reduced motion.** `prefers-reduced-motion` respected.

## Testing

Vitest, with a DOM environment — `jsdom` or `happy-dom` — plus `@testing-library/react`, `@testing-library/user-event`
and `@testing-library/jest-dom` for component work. *The first draft named no runner at all while describing a CI test
step.*

**Content validation** is the highest-value work here, and its rules split by bank, which the first draft missed.
Demanding source records of invented fixture questions would have made the very first CI gate either fail or pass
vacuously.

Applies to every bank:

- Question ids are unique across the whole bank and never reused after an edit.
- A round's blurb contains no answer string from its own round. Cheap, and it catches the one way a blurb spoils its
  own questions.
- The fixture bank contains at least one question of each answer shape.

Applies to the real bank only:

- Every round has exactly ten questions. A round with fewer is dropped, not shipped short.
- Every question has a verification record, and every excerpt is forty words or fewer.
- Tier mix is 3 / 5 / 2 per round, tolerated at plus or minus one on any tier.

**Other groups.** Round dealing: no repeats across three consecutive games, correct exhaustion behaviour, served on
deal rather than finish. Scoring: all three answer shapes including list caps and contested rules, plus a voided
question scoring zero for every team and not only the disputing one. Persistence: restore mid-round, and every row of
the storage-failure table. The bank guard: default alias resolution is the fixture bank.

**When validation fails.** It is a script that exits non-zero and CI runs it before the build, so a bank that fails
does not deploy. Not a warning in a log, and no falling back to a smaller game — a quietly shortened bank is worse
than a failed deploy.

**Browser verification sits outside this suite.** Playwright MCP drives a real browser during development and returns
an accessibility tree, which is how claims about accessible names, live regions, keyboard reachability and actual
rendered behaviour get checked. `increments.md` says which increments use it for what. It is not part of the committed
test suite, and whether it should become one is an open decision rather than an omission.

## Build, CI and deploy

Pages with its source set to GitHub Actions, which is done.

Publishing to Pages from Actions is **two jobs with an artifact handoff**, not one list of steps. *The first draft
described a single sequence, which is not the shape the platform uses.*

- Workflow-level `permissions`: `contents: read`, `pages: write`, `id-token: write`.
- Workflow-level `concurrency`: group `pages`. *Corrected 24 September 2026: this said "cancel in progress" and that
  was wrong. `actions/deploy-pages` has no cleanup step, so cancelling it mid-run can leave a deployment un-finalised
  and the next run failing against it. GitHub's own Pages starter workflows set `cancel-in-progress: false` and say
  why. The workflow now does too.*
- **build** job: checkout, set up Node, `npm ci`, validate content, test, build, then upload the `dist` directory as a
  Pages artifact.
- **deploy** job: `needs` the build job, declares the `github-pages` environment, and deploys the artifact.

Two details worth pinning deliberately rather than discovering. The official Pages actions have different major
versions in GitHub's own documentation than in the registry and in Vite's deployment guide, so choose versions on
purpose and record which. And the scaffold's `build` script already runs the typechecker before Vite, so a separate
typecheck step duplicates it — drop the separate step rather than paying for it twice.

The real-bank variable is set on the build step, in this workflow, and nowhere else. It is not set until increment 8.
That is what makes the guarantee in `design.md` §3 a property of the pipeline instead of a habit.

## Git workflow

**App changes go on a branch and through a pull request**, one feature per request, with the commit message shown
before it is made.

**Content changes go straight to `main`**, prefixed `content:`, with a message that names counts and which rounds were
touched and **never quotes a question or an answer**. A pull request touching the real bank would put the answers in a
diff the owner reads while reviewing it, which defeats the two-bank scheme entirely. The build configuration can keep
questions out of a development build; it cannot keep them out of a code review the owner performs. So content is not
reviewed by the owner, by design, and the post-play sampling in `content-pipeline.md` §4 replaces that review.

**Never mix the two in one commit.** An app change that touches a content file is two commits.

### Rollback

*Rewritten 24 September 2026. This said "`git revert` plus letting the workflow redeploy", which is true of a content
commit and not true in general. A review found the gap.*

Two things make a revert insufficient on its own.

**A revert does not unpublish.** Pages keeps serving the last *successful* deployment. So reverting into a state that
fails a CI gate leaves the bad site live, looking as though the rollback worked because the commit is gone from `main`.
Check the Actions tab after a revert, not just the git log.

**Reverting a commit that contains the workflow deletes the workflow.** Increment 1 is a single commit and it added
`.github/workflows/deploy.yml`. Reverting it leaves the push with nothing to run: no build, no artifact, no deploy, and
no `workflow_dispatch` button either, because that is declared in the file just deleted. The site freezes on whatever
was last deployed.

So the procedure, in order:

1. `git revert <sha>` the offending commit, or `git revert --no-commit` a range.
2. Before pushing, confirm `.github/workflows/deploy.yml` still exists and still has the triggers. If the revert removed
   or changed it, restore that file from `main` and commit it back — a revert of application code must not take the
   pipeline with it.
3. Push to `main` and watch the run in the Actions tab.
4. Confirm the deployed site actually changed. A green run and a correct site are different claims.

If the workflow file itself is what needs reverting, fix it forward in a new commit rather than reverting it. There is
no way to run a workflow that does not exist on the default branch.

## What this design does not guarantee

- That a published bundle hides its questions. It does not, and cannot.
- That the owner never sees a question. Only that no ordinary command shows them one.
- That the app works with no network on first load. No service worker, ruled out in `design.md` §8.
- That it behaves well on a television's built-in browser. Wake lock, viewport behaviour and overscan on Tizen or
  webOS are untested and no vendor documentation was read. A laptop on HDMI is the supported path.
- That the accessibility criteria named here are complete. They are the ones a timed, colour-coded, large-screen quiz
  obviously touches. Full conformance needs testing with assistive technology and expert review, neither of which has
  happened.
