# Heeler Pub Quiz

A browser trivia game for adults, run from one shared screen. Teams write answers on paper; the app shows questions
and keeps score. Static build, no backend, no accounts.

Heeler Pub Quiz is an unofficial, fan-made quiz. It is not affiliated with, endorsed by, or connected to Bluey, Ludo
Studio, BBC Studios, or any of their licensees.

Live at **https://nickarrow.github.io/heeler-pub-quiz/**

## Running it

Needs Node 24.12 or newer. That is not arbitrary: `npm run validate:content` executes a TypeScript file directly with
no build step, and Node declares type stripping stable at v24.12.0. Older versions from v22.18 probably work and are
untested here.

```
npm install
npm run dev
```

The dev server serves at **http://localhost:5173/heeler-pub-quiz/**, not at the bare root. The path is there because a
GitHub project site lives under a subfolder, and the build is configured for it.

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm test` | Vitest once, no watch mode |
| `npm run validate:content` | The content rules. Runs in CI before the build |
| `npm run build` | Typecheck then production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally, base path and all |
| `npm run lint` | Oxlint. Not a CI gate |

## When the deploy breaks

Every push to `main` builds and deploys. To find out why a run failed, open the repository's **Actions** tab in a
browser and read the failing step. That is the route that needs no tooling — `gh` is not installed here, and the
workflow-logs API endpoint requires authentication, so the browser is the practical path.

The workflow is two jobs. `build` runs content validation, tests, then the build, and uploads `dist/` as an artifact.
`deploy` publishes it. A failure in any gate means nothing is published and the previously deployed site stays up.

To roll a bad deploy back, see the rollback procedure in `docs/technical-design.md`. Reverting a commit is not
sufficient on its own, and the reason is worth reading before you need it.

## Two question banks

There is a fixture bank of obviously invented questions and a real bank. Every ordinary command loads the fixtures, and
the screen carries a badge saying so. The real bank requires an environment variable that only the deploy workflow will
ever set, and not until increment 8 of the plan.

This exists because the owner intends to play the game, so no ordinary build should show them a real question.
`docs/technical-design.md` has the mechanism and is honest about what it cannot guarantee.

## The documents

The project is documented more than it is coded, on purpose — the question bank is the hard part, not the app.

| Document | Holds |
| --- | --- |
| `AGENTS.md` | The working agreement. It governs |
| `docs/design.md` | What this is and why. The one to argue with |
| `docs/technical-design.md` | How it is built |
| `docs/increments.md` | The order of work |
| `docs/verification-log.md` | What has been checked, what has not, and what turned out to be wrong |
| `docs/content-pipeline.md` | How questions get made, checked, and corrected |
| `HOW-TO-WORK.md` | The practice behind all of the above |
