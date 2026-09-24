# Heeler Pub Quiz — verification log

What has been checked, what has not, and what turned out to be wrong. Appended to rather than rewritten, because the
direction of an error matters as much as the fact of it.

Kept separate from the design documents so that corrections accumulate somewhere without swelling the document they
correct, and so that "what do we actually know" is answerable in one place.

---

## 23 September 2026 — corrections after the first review

A four-reviewer pass over `design.md` and `research/phone-join-and-multiplayer.md`, before any code existed. Roughly
43 discrete findings; these are the ones confirmed against a source and acted on.

**"Ticketed themed events are the one pattern with a documented response" was wrong.** The Las Vegas restaurant event
that drew a cease-and-desist in May 2024 was free — a community giveaway, per the reporting — and BBC Studios' stated
basis was brand confusion and unauthorised use of the mark, not commerce. The first draft therefore taught the
opposite of the right lesson, implying that charging nothing keeps a project safe. `design.md` §7 now carries the
correction: what drew the letter was publicly promoting an unlicensed thing using the name in a way that read as
licensed. Non-commercial remains the decision; the reason is different.

**"No fourth series in production" was stated more strongly than the sources support.** There is no renewal
announcement and September 2026 coverage says not renewed, but at least one April 2026 trade item claims development.
`design.md` §5 now says "announced". The design premise is unaffected, because nothing new has aired and the pool is
the 154 aired episodes.

**"Verify in a separate pass" described a check that was not independent of the author.** The independence claimed was
from recollection, not from whoever wrote the question, and tracing a question to a source URL proves provenance
rather than correctness. `content-pipeline.md` §3 is rebuilt around blind re-derivation with the answer withheld, plus
a cross-anchor against a second source.

**No route existed for a wrong question, before or after play.** The bank's error rate was unobservable by
construction, which was the worst finding in the set because it was unfalsifiable. `content-pipeline.md` §4 now has
dispute and void controls during play, and a sampled review after it that produces a computed error rate.

**"Running the real bank locally takes a deliberate flag" described a mechanism that does not work.** Vite derives
`import.meta.env.DEV` from `NODE_ENV`, not from the mode, and `vite build --mode development` sets `NODE_ENV` to
`production`. So a command that looks like the safe one would have loaded the real bank. Replaced with a
build-configuration alias in `technical-design.md`.

**The round arithmetic had no slack.** Exactly ten questions per round, a rule to cut anything ungrounded, and no
backfill, which made the three reserve rounds a cut buffer rather than reserve. `design.md` §5 now over-authors twelve
candidates per round and states twelve surviving rounds as the floor.

**"The application is a few hundred lines" was never computed** and has been removed. So has "hash routing, because
Pages has no server-side rewrites", which was both half wrong and solving a problem the app does not have — there are
no routes.

**A per-object storage figure for Durable Objects was wrong.** Corrected in place in
`research/phone-join-and-multiplayer.md`, along with a conflation of relay-usage rates with connection-failure rates.

**`design.md` was 377 lines, not the 267 first reported.** `Measure-Object -Line` silently skips blank lines. The
document has since been split four ways so each part sits inside the two-to-three-hundred-line target.

**The Dexie deviation was taken silently.** The standing stack preference names IndexedDB via Dexie; this project uses
three local storage keys. Defensible, because that preference scopes Dexie to a progressive web app and the
progressive web app is ruled out, but the first draft recorded every other ruling-out and not that one. Now in
`design.md` §8.

### One finding rejected

A reviewer said the two catchphrase names in the legal section were attributed the wrong way round. They are not.
"Wackadoo" has appeared in BBC Studios press release headlines — the 2021 UK DVD launch and the Italy and Greece
expansion, both on `bbc.com/mediacentre/bbcstudios` — and on a licensed VTech watch. "For Real Life" is the branding
of the Bunnings retail collaboration. The reviewer found the Bunnings headline and a 2026 Apple Arcade campaign and
missed the 2021 items. Partially accepted: describing this as *current* marketing is stronger than 2021 press releases
support, so the wording no longer says current.

Three further findings were dropped because the reviewer answered them themselves: a source-map leak they checked and
cleared, success criterion 2.2.1 which is satisfied because nothing expires, and seven jargon terms I asked about that
turned out never to appear in the document.

## Verified directly, by fetching the source

- **Vite's `NODE_ENV` and mode table**, which settled the two-bank question —
  [env and mode](https://vite.dev/guide/env-and-mode.html), 23 September 2026.
- **Durable Objects free-plan allowances**: 100,000 requests and 13,000 GB-s per day, SQLite-backed only —
  [pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/), 23 September 2026. Moot now, but it
  is what made the ruling-out in `design.md` §8 a decision rather than a guess.
- **Durable Objects storage limits**: 5 GB per account on free, 10 GB per object —
  [limits](https://developers.cloudflare.com/durable-objects/platform/limits/), 23 September 2026.
- **Success criterion 2.2.2 and its "essential" exception**, which is hard to claim for a timer that enforces nothing
  — [WCAG 2.2, Pause Stop Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).
- **That the Las Vegas event was free rather than ticketed.**

## Taken on trust from research, fetched but not independently re-checked

- **154 episodes across three series**, computed from the wikitext of Wikipedia's episode list, whose tables and prose
  agree. Not cross-checked against a broadcaster catalogue.
- **196 populated synopses** in one Wikipedia API call.
- **The August 2027 film date.**
- **21 minisodes and 21 Bonus Bits.**
- ***Beat the Parents* rated 5+**, and the absence of any adult Bluey quiz product. The second is a negative and
  cannot be proven.
- **At least three fanon wikis** carrying invented material, including a fabricated fourth-series episode list.
- **Licence terms.** Wikipedia CC BY-SA 4.0 confirmed from the API. The Bluey wiki's version number came from Fandom
  help pages after the licensing page itself refused the request.
- **Prior-art licence and maintenance status** for the projects listed in `research/phone-join-and-multiplayer.md`.

## Not verified at all

- **Whether the corpus supports the content plan.** Whether ten genuinely contested facts exist for the Contested
  Evidence round, and which five themes have real depth. Both need the fetch, and both are open questions in
  `design.md` §9 rather than assumptions in a plan.
- **How many transcript pages there are.** Two measurements agree that 151 exceed 10 KB and disagree on the total —
  206 in the first pass, 220 in review. No precise total is stated anywhere as a result.
- **Sixty to seventy-five seconds per question**, the estimate the entire authoring target rests on. The number most
  likely to be wrong.
- **The difficulty tier mix as a calibration**, as opposed to as a starting position to adjust after one evening.
- **Question-accuracy of the wiki transcripts** against broadcast subtitles.
- **The enforcement case dockets**, which come from press summaries rather than filings.
- **Whether a licensed adult Bluey quiz exists outside English-language search**, including on mobile app stores.
- **Television browser behaviour** — wake lock, viewport units and overscan on Tizen or webOS. No vendor documentation
  read, no device tested.
- **Whether any Vite mechanism could make the two-bank split airtight against deliberate inspection.** The stated one
  was confirmed to fail; that no better one exists was not established, and the current design does not claim it.

## 23 September 2026 — corrections after the second review

A red team pass over `increments.md` and a mechanism pass over `increments.md` and `technical-design.md`, still before
any code existed. 25 findings, 8 of them blocking. Nearly all were accepted, which reflects how quickly the first plan
was written rather than anything about the reviewers.

### The worst one

**Four consecutive increments could only be verified by reading the question bank.** Increments 3 through 6 each said
"play it and see", while the deploy workflow switched to real questions back in increment 3. Since the real bank only
existed on the deployed site, confirming any of those increments meant reading real questions — which would have
silently cancelled the error-rate sample in the final increment, and burned `served-rounds` before the first real
evening.

Fixed by moving one line: the workflow does not select the real bank until increment 8. Everything before that is
verified against fixtures, and the real bank is verified structurally in CI. `increments.md` now carries this as a
standing constraint rather than leaving it implicit.

### Mechanism errors, each verified against the documentation

**Relative alias paths do not work.** The corrected two-bank mechanism used `'./content/rounds/index.ts'`. Vite's
documentation states that when aliasing to filesystem paths you must use absolute paths, and that relative values are
used as-is and never resolved. The import would simply have failed. Now built with `resolve(import.meta.dirname, …)`.
Read at [resolve.alias](https://vite.dev/config/shared-options.html), 23 September 2026.

**The content types were never going to be checked.** `technical-design.md` claimed `satisfies Round` made the data
model "a test that runs on every build". The scaffold's `tsconfig.app.json` ends with `"include": ["src"]`, and the
banks were specified at the repository root, so the compiler would never have looked at them. Verified by reading
[the template's tsconfig.app.json](https://raw.githubusercontent.com/vitejs/vite/main/packages/create-vite/template-react-ts/tsconfig.app.json)
directly. Both banks now live under `src/content/`; verification records stay outside it as JSON, which is the
stronger arrangement anyway.

**`satisfies` was doing work it cannot do.** It checks shapes, not counts. It cannot enforce ten questions per round,
id uniqueness across files, a forty-word excerpt cap, or a blurb check against its round's answers. All of those are
runtime code now.

**Tailwind's install method was unstated and would have been wrong.** Version 4 uses a first-party Vite plugin and
CSS-based configuration, with no `tailwind.config.js` and no PostCSS step.

**Pages deployment is two jobs with an artifact handoff**, not the single step sequence described, and needs specific
`permissions`, a `needs` dependency and a `github-pages` environment. Also noted: the official action versions differ
between GitHub's own documentation and the registry, so they get pinned deliberately.

**No test runner was named anywhere** while CI had a test step. Now Vitest with a DOM environment and testing-library.

### Design and plan errors

**Voiding a question would have required rewriting scoring.** A running per-team total cannot retroactively drop a
question. Scoring now stores per-question results and derives totals, stated as a constraint on the first app
increment rather than discovered in the fifth.

**Increment 1 validated content that did not exist.** The validation rules demanded verification records and a tier
mix, and fixtures have neither, so the first CI gate would have failed or passed vacuously. Validation rules are now
split: structural rules apply to any bank, provenance rules to the real bank only.

**No-repeat testing needed twelve rounds and one increment had delivered one.** Twelve short fixture rounds are now an
explicit deliverable.

**The footer notice existed in the legal posture and in no increment**, while increment 1 published to the internet.

**The first push had no credential path.** Password authentication for git operations is gone, so this needs Git
Credential Manager, a token, or SSH — an owner action, now in the prerequisites.

**Scaffolding would have stopped on the first command.** A dry run found that `npm create vite` into this directory is
an interactive prompt, because the directory already holds documentation and a git repository, and that the scaffold's
own `.gitignore` would overwrite the one carrying the corpus exclusion.

**Increment 6 could not close the timer question.** It is one person with a keyboard; real pace needs real teams, so
that question now closes in increment 9. And the real evening is the only dependency in the plan that cannot be
scheduled by working harder, which is now said out loud.

### Partially accepted, and what was folded

One reviewer said the single-round survival measurement "cannot answer its question" because one round gives a data
point rather than a rate. Right about the text, which overclaimed, and the increment is still worth having as a
pipeline smoke test — the wording changed rather than the plan. A related finding, that three increments leave a
deployed site that cannot start a game, is real but entirely downstream of the verification problem above and
dissolves with the same fix, so it was folded rather than counted twice.

One reviewer discarded three of their own suspicions on reading the files, which is the behaviour worth having.

## 24 September 2026 — increment 1, what the first real code changed

First increment with code in it. Everything below was observed rather than inferred, except where it says otherwise.

### What the deployed site actually does

Driven through Playwright MCP against `https://nickarrow.github.io/heeler-pub-quiz/`, not asserted from a green
workflow:

- The page loads and the title is `Heeler Pub Quiz`.
- The accessibility tree contains the fixture question, the fixture badge and the footer notice. The notice appears
  inside a `contentinfo` landmark.
- **No asset 404ed.** Four requests, all 200: the document, `assets/index-C4agnejQ.js`,
  `assets/index-gw3bVsTn.css`, `favicon.svg`. All four under the `/heeler-pub-quiz/` base path. This was the most
  likely first-deploy failure and it did not happen.
- Zero console errors and zero console warnings.

Workflow run 1 on commit `2995f5b` concluded `success`, and every step in both jobs reported conclusion `success`
rather than `skipped` — read from the Actions REST API per step, since `gh` is not installed.

### The two-bank guarantee, checked in the artefact rather than trusted

`grep` of the built bundle for `content/rounds` returns nothing, and the fixture question's prompt is present. So the
claim that only one bank is ever in the module graph is now a property observed in the output, not only a property of
the config. `HEELER_REAL_BANK` is set nowhere in the repository.

The content validation gate was negative-tested rather than assumed: a duplicated question id, a blurb seeded with one
of its own round's answers, and a bank missing the contested shape each produced exit 1 with a named failure, and the
file restored clean afterwards. Four structural checks run; four real-bank checks report themselves SKIPPED with the
reason, because the real bank does not exist until increment 7.

### Three claims about the scaffold, re-checked against create-vite 9.2.1

`technical-design.md`'s claims were verified against the template on `main` in September 2026, and the scaffold has
moved since. All three still hold:

- `build` is `tsc -b && vite build`, so the typechecker does run inside it and a separate CI step would duplicate it.
- The root `tsconfig.json` is solution-style, holding only `files` and `references`.
- `tsconfig.app.json` ends with `"include": ["src"]`, which is why both banks live under `src`.

Resolved versions, for the record: create-vite 9.2.1, Vite 8.3.0, React 19.2.8, TypeScript 6.0.3,
`@vitejs/plugin-react` 6.1.1, Tailwind 4.3.3, Vitest 5.0.1, oxlint 1.81.0.

**TypeScript 6 makes the strict family the default.** `tsconfig.app.json` contains no `"strict": true`, which reads
like strict is off. It is not: a probe file with an untyped parameter produced TS7006, and `const n: number = null`
produced TS2322. So the typecheck gate is a real gate. Worth writing down because the natural conclusion from reading
that file is the wrong one.

**The scaffold now ships a linter.** Oxlint, by default, in place of ESLint. `increments.md` names no lint gate, so it
is present as `npm run lint` and deliberately not wired into CI. Confirmed live by planting a duplicate declaration,
which it caught.

### Pinned action versions, and the divergence that prompted pinning

The divergence is real. GitHub's own maintained starter workflows — `pages/static.yml` and `pages/jekyll-gh-pages.yml`,
both read on 23 September 2026 — use `configure-pages@v5`, `upload-pages-artifact@v3`, `deploy-pages@v5`. The
registry's latest releases are `configure-pages` v6.0.0, `upload-pages-artifact` v5.0.0, `deploy-pages` v5.0.1. The
`deploy-pages` README example shows `@v4`, a third answer again.

Chose the starter-workflow trio. The reasoning is that it is the only place a *combination* of the three is asserted to
work together; the individual latest releases assert nothing about each other, and `upload-pages-artifact` v5.0.0
bumped its internal `upload-artifact` to v7 with no corresponding statement about which `deploy-pages` consumes it.

*Corrected 24 September 2026, after review.* This said "the one documented pairing constraint". There are two, pointing
in opposite directions: `upload-pages-artifact` v3.0.0 requires `deploy-pages@v4` or newer, and `deploy-pages` v4.0.0
requires artifacts from `upload-pages-artifact@v3` or newer. The chosen pair satisfies both, so the decision stands and
only the count was wrong.

`checkout@v7` and `setup-node@v7` are latest major, since neither has a cross-pairing constraint.

*Corrected 24 September 2026, after review.* This said the breaking changes across checkout v5 to v7 concern
`pull_request_target` checkout safety. That covers one of the three majors. v5.0.0 was a Node 24 runtime bump carrying a
stated minimum runner version, v6.0.0 changed where credentials are persisted, and only v7.0.0 is the
`pull_request_target` and `workflow_run` change. The conclusion survives — none of the three affects a push-to-main
workflow on GitHub-hosted runners — but the reason given was too narrow to support it.

### Deviations from the documents, with reasons

**`happy-dom` rather than `jsdom`.** `technical-design.md` allows either. jsdom 30.1.1 declares
`engines.node` of `^22.22.2 || ^24.15.0 || >=26.0.0` and this machine runs Node v24.12.0, so npm warned on install.
happy-dom 20.14.5 wants `>=20.0.0`. Choosing it keeps local and CI on the same footing.

**`defineConfig` imported from `vitest/config`, not `vite`.** The config snippet in `technical-design.md` imports from
`vite`, which cannot carry the `test` block Vitest needs for a DOM environment. `vitest/config`'s `defineConfig` is a
superset. The `base`, the plugins and the alias are otherwise exactly as specified.

**No `pull_request` trigger on the workflow.** The documents put app changes on a branch and through a pull request.
The owner directed on 23 September 2026 that this project commits straight to `main`, branches and requests being
overkill for a solo repository, so a `pull_request` trigger would never fire. `push` to `main` and `workflow_dispatch`.

**`concurrency.cancel-in-progress` is `true`, which contradicts GitHub's own recommendation.**
`technical-design.md` specifies cancel in progress, and both GitHub starter workflows set it to `false` with a comment
that production deployments should be allowed to finish. Followed the project document. Flagging it because the
opposite choice is defensible and this is the owner's call, not a finding.

### Four things that bit, recorded so they do not bite twice

**`import.meta.dirname` survives Vite's config bundling.** The absolute-path alias depends on it and it was not safe to
assume. Verified by the build resolving the fixture bank correctly, and guarded further by an `existsSync` check in the
config that throws if the alias target is missing.

**Vite rebases hand-written root-relative URLs in `index.html`.** `dist/index.html` contains
`href="/heeler-pub-quiz/favicon.svg"` from a source that said `href="/favicon.svg"`. `technical-design.md` warns that
hand-written links need `import.meta.env.BASE_URL`, which is true for URLs built in JavaScript at runtime and **not**
true of attributes in `index.html`, which the build rewrites. Recorded precisely so nobody later "fixes" a link that
already works.

**Dynamic `import()` of an absolute Windows path fails.** The validation script loads a bank by path, and
`c:\...` is read as a URL scheme by the ESM loader — `ERR_UNSUPPORTED_ESM_URL_SCHEME`. Fixed with
`pathToFileURL`. Node's native TypeScript execution itself worked fine; the script runs as `node scripts/validate-content.ts`
with no build step.

**Testing Library does not auto-clean without Vitest globals.** This project runs Vitest without globals so imports
stay explicit, and Testing Library only registers its own cleanup when it detects a framework's globals. Without an
explicit `cleanup()` in `afterEach`, renders accumulated across tests in a file and role queries found several of
everything. Two tests failed for that reason before it was added, and the failure looks nothing like its cause.

### Corrections to what the documents claim

**`increments.md`'s closing section is out of date and has been corrected in place with a dated note.** It says five
commits exist and nothing has been pushed, which made the author-email decision cheap. Six commits were already on
`origin/main` before this increment started, all six carrying the owner's personal address, verified with
`git log --format='%ae'`. That moment had already passed. Raised with the owner on 23 September 2026, who decided to
leave it as it is; git configuration is theirs.

**`increments.md` said increment 1 needed only the push credential from the owner.** It needed two more decisions: the
wording of the footer notice, including whether it names the show, and permission to edit a user-level MCP config.
Corrected in place.

### The footer notice, and why it names the show

`design.md` §7 keeps the show's name out of the product name, the repository name and the domain, and bans character
art, title-card lettering, theme music and screenshots. It does not say whether the name may appear in prose, and a
disclaimer that does not name what it disclaims affiliation with disclaims nothing. The owner decided on
23 September 2026 that it names the show. Shipped wording:

> Heeler Pub Quiz is an unofficial, fan-made quiz. It is not affiliated with, endorsed by, or connected to Bluey, Ludo
> Studio, BBC Studios, or any of their licensees.

Reporting a decision, not giving legal advice, per §7's own framing. It is covered by a test, because the notice is
easy to forget and increment 1 publishes to the internet.

### Not verified in this increment

- **That local and CI run the same runtime.** CI pins Node major `24` and the machine runs v24.12.0, so "green in CI"
  and "green locally" are not bit-identical claims. *Corrected 24 September 2026, after review: this originally said the
  runner "resolves to v24.21.0" and that the two were "nine patch releases apart". Two errors. v24.21.0 is the newest
  24.x published on `nodejs.org/dist/index.json` as of 24 September 2026, which is not the same thing as what
  `setup-node` selects — it resolves against its own version manifest, which can lag, and the CI logs were not read. And
  the gap is twelve releases, counted, spanning nine **minor** versions, not patch releases. The original number was
  stated as though computed and was not.*
- **The CI logs themselves.** Step conclusions were read from the API; the log text was not, because the logs endpoint
  needs authentication. So "the validation gate ran and reported four checks" is verified locally and inferred in CI
  from a successful step.
- **Anything about a television.** A 1920x1080 viewport is a 1080p window, not a viewing distance and not overscan.
  Increment 6.
- **Any accessibility claim beyond landmark structure.** No contrast measurement, no type scale, no keyboard map. Those
  are increment 6 deliverables and nothing here claims them.
- **`--allowed-origins`.** Handed to the owner rather than applied, since it lives in a user-level config outside this
  workspace. Unapplied as of this entry.

**One incidental observation.** Playwright MCP's `--output-dir=.playwright-mcp` resolves against the MCP server's own
working directory rather than the workspace, so no `.playwright-mcp/` directory appears in the repository. The
`.gitignore` entry for it is therefore currently guarding nothing. Harmless, and cheap to leave in place.

## 24 September 2026 — the increment 1 review, and what it found

Five reviewers, each anchored to a different source, per `.kiro/steering/review.md`: against the source, against the
mechanism, cold as the reader, red team, and a senior-engineer pass over the whole repository. 52 findings as the
reviewers numbered them. Every one was opened and confirmed before acting; three did not survive that and are recorded
below, because the step that keeps this honest is the one that gets skipped.

### One root cause with two symptoms, and it was mine

`src/content/fixtures/index.ts` was committed carrying a double-encoded em dash **and** a UTF-8 byte-order mark. Both
came from the same mistake: the negative test that proved the validation gate works used PowerShell 5.1's
`Set-Content -Encoding utf8` to restore the file afterwards, and that writes a BOM and re-encodes non-ASCII on the way
through. A byte sweep of all 32 tracked files found the damage confined to that one file; every other file was clean.

It mattered more than tidiness. `checkBlurbsSpoilNothing` compares answers to blurbs by substring, so text encoded two
different ways stops matching and that gate passes while checking nothing — and this is the file increment 7 copies to
shape the real bank. There is now a validation rule that rejects double-encoded UTF-8 and replacement characters
anywhere in a bank's text, negative-tested by planting `U+00E2 U+20AC U+201D` in a prompt and watching it fail. The BOM
itself is cosmetic and was simply removed; no byte-level rule was added for it, because the data-level rule catches the
case that does damage.

**Lesson worth keeping:** on Windows, restore files with `Copy-Item` from a backup, or
`[System.IO.File]::WriteAllText` with `UTF8Encoding($false)`. Not `Set-Content -Encoding utf8`.

### The validation gate would have printed real answers into a public CI log

The worst finding, and it was latent rather than live. The blurb check's failure message interpolated the answer:

```
blurb for round "X" contains the answer "Y" from question Z
```

That function runs against the real bank from increment 7. `increments.md` says content "bypasses your review by design,
which makes CI the only gate in front of it", so the owner is exactly the person who reads that log — on a public
repository. Printing an answer to be helpful would have cancelled the error-rate sample that the whole two-bank scheme
exists to protect, and it would have done it silently.

Fixed by naming the question id and withholding the text. A second instance of the same class was found in the same
function while fixing it: the verification-record parser reported `String(error)` from a failed `JSON.parse`, and V8's
JSON errors quote the offending region of the file, which is an excerpt. That message no longer includes the error.

The rule is now stated at the top of the script rather than left to judgement: no failure message ever prints question or
answer text, regardless of bank. A single rule that cannot leak beats a conditional one that might.

One related claim was checked and **rejected** — see below.

### Corrections to the increment 1 entry above

Four factual errors, all in text written the same day, all corrected in place with dated notes: the "one documented
pairing constraint" was two; the checkout reasoning covered one of three majors; the Node gap was reported as "nine patch
releases" when it is twelve releases spanning nine minor versions, a number written as though computed and not computed;
and the runner's resolved Node version was asserted as fact inside the section headed *Not verified*.

### Code and pipeline changes

- **`scripts/bank-paths.ts` is new**, holding the two bank paths that were previously duplicated in `vite.config.ts` and
  `scripts/validate-content.ts`. Renaming the fixture bank failed loudly in both; renaming or moving the *real* bank and
  updating only the Vite config did not — `existsSync` would go false, the provenance rules would report themselves
  skipped, and the script would exit zero. From increment 8 that ships unchecked questions past a green gate. The
  constants are relative fragments rather than resolved paths, because Vite bundles its config before running it and
  `import.meta.dirname` inside an imported module cannot be trusted to point at the repository root. One duplicate
  remains and cannot be removed: `tsconfig.app.json` maps `@bank` for the compiler and JSON cannot import anything.
- **`process.exitCode = 1` replaces `process.exit(1)`** in the validator. Node does not flush pending async writes on
  exit and in CI both streams are pipes, so the failure list it had just printed could be truncated.
- **`AnswerText` has an explicit `ReactElement` return type.** Without it, adding a fourth answer shape lets the switch
  fall through and return `undefined`, which React renders as nothing — a blank answer with no error. The shape-coverage
  rule in the validator is now a `Record` keyed by the union for the same reason, so a fourth shape is a type error
  rather than a rule that silently stops requiring it.
- **`concurrency.cancel-in-progress` is now `false`.** `technical-design.md` specified cancelling and that was wrong:
  `actions/deploy-pages` has no cleanup step, so cancelling mid-run can leave a deployment un-finalised. The spec carries
  a dated correction.
- **`engines` declares `node >=24.12.0`.** Not arbitrary: `validate:content` runs a TypeScript file directly, and Node's
  own documentation gives v23.6.0 and v22.18.0 as where type stripping became default-on and **v24.12.0 and v25.2.0 as
  where it became stable** — which is exactly the version this machine runs. Read at
  [nodejs.org/api/typescript.html](https://nodejs.org/api/typescript.html), 24 September 2026. The same page confirms a
  reviewer's point worth recording for increment 7: `tsconfig` `paths` aliases are explicitly unsupported by the
  stripper, so a bank file importing through an alias would break this gate while leaving the app fine.
- **Three comments that described increment 8's behaviour in the present tense** now say what is true as of increment 1
  and what changes later. Read cold they had looked like descriptions of current behaviour.

### Documentation changes

- **`README.md` is new**, which three reviewers arrived at independently. Nothing said how to run the project, the five
  npm scripts were undocumented, and the base path means bare `localhost:5173` is not the app. It also names the one
  route to CI logs that needs no tooling — the Actions tab in a browser — since `gh` is not installed and the logs API
  needs authentication, so both routes the documents did mention were closed.
- **A real rollback procedure** is in `technical-design.md`. "`git revert` plus a redeploy" is true of a content commit
  and false in general: a revert does not unpublish, because Pages keeps serving the last *successful* deployment, so
  reverting into a state that fails a gate leaves the bad site live while the git log looks correct. And reverting the
  commit that contains the workflow deletes the workflow, so the revert push has nothing to run — which is exactly the
  shape of increment 1, a single commit that introduced `deploy.yml`.
- **The owner's email address is out of the documents' prose.** It remains permanently public in six commits' metadata,
  so this achieves little, but file text is indexed differently and removing one surface cost nothing.
- **Document length is settled as a code concern, not a document one.** Three documents exceed the two-to-three-hundred
  line target in `AGENTS.md` and the owner's ruling on 24 September 2026 is that the rule is about keeping code
  reviewable and does not apply to documents. Recorded here rather than edited into `AGENTS.md`, which is the owner's to
  change. Noted so the next review does not raise it a fourth time.

### Three findings rejected

**Mojibake in `.gitignore`.** Byte-checked: one clean `U+2014` and zero corrupt sequences. The reviewer read it through
the same mangled console that has garbled output throughout this session, which is an instructive failure — the tool
reporting the corruption was itself the corruption.

**That `tsc` would echo real answers into CI logs.** Plausible and not active. Tested with a probe file containing a
distinctive string: piped, non-TTY output prints only `file(line,col): error TSxxxx: message` with no source line, while
`--pretty` echoes the offending line and its string contents. Actions `run:` steps are not TTYs, so pretty is off.
Recorded as a live hazard only if someone forces `--pretty` in CI. Not verified on the runner itself.

**That the `--allowed-origins` paragraph in `increments.md` is stale without a dated note.** The dated note is directly
below it.

Two more were downgraded rather than dropped: that two records of the author-email conversation disagreed — "accepted as
fine" and "left unactioned" are compatible, though the wording is now aligned — and that the `deploy-pages` README
showing a third version answer needed action, when it strengthens the existing pinning argument.

### Deliberately not fixed, and whose problem it is

Left for the increment that owns them, rather than widening this change: no written shape for the `game` and `flags`
storage keys, which increment 3 needs and `technical-design.md` does not give; `flags` keyed on question ids with no bank
marker, so fixture-era disputes from increments 3 to 6 would land in the same export that increment 9 computes an error
rate from; `theme: string` and `id: string` both looser than the design, with round and question ids interchangeable to
the compiler; lint absent from CI, which is harmless now and stops being harmless when increment 3 adds hooks and
`react/rules-of-hooks` starts mattering; the `list` and `contested` branches of `AnswerText` untested; and the
accumulation of up to forty words per verification record across 150 questions in a public repository, which
`content-pipeline.md` never weighed against the reasoning that keeps `.corpus/` out of git.

### The validator was split, because the length rule turned out to apply to it

Acting on the findings pushed `scripts/validate-content.ts` to 307 lines, past the `AGENTS.md` target, and the owner's
ruling the same day was that the target is about code specifically. So it split along the seam a reviewer had already
named: `content-rules.ts` holds what is and is not acceptable, `validate-content.ts` works out which banks exist and
prints the outcome. 231 and 116 lines, plus 23 for `bank-paths.ts`, all counted with `ReadAllLines`.

The split also removed three module-level mutable arrays that every rule reached into. Rules now take a `Report` they
write to, which is why the seam was worth taking rather than just moving lines to get under a number.

### Verified after the changes

All four gates re-run and observed, not assumed: content validation 5 checks ran and 4 skipped, exit 0; 6 tests in 2
files passing; build green; oxlint exit 0. The two-bank guarantee re-checked in the rebuilt bundle — `content/rounds`
absent, `bank-paths` absent, fixture prompt and footer notice present, favicon rebased under the base path.

All four structural rules negative-tested against the split script: a duplicated question id, a blurb seeded with one of
its own answers, a bank missing the contested shape, and a planted `U+00E2 U+20AC U+201D` in a prompt. Each produced exit
1, and each output was checked against every answer string in the fixture bank to confirm none appeared — which is the
leak fix tested rather than assumed. The fixture file restored byte-identical afterwards, verified with `git diff`.

Then the deploy: workflow run 3 on commit `b6f35e6` green with every step reporting success, and the live site re-driven
through Playwright — question, badge and footer notice in the accessibility tree, four requests all 200, zero console
errors. The deployed asset hashes matched the local build exactly, which is incidental evidence that CI built the same
thing this machine did.

## 24 September 2026 — increment 2, the corpus fetch and reality check

The first increment that reads real show content. It delivers a committed fetch script writing into `.corpus/` (which
is gitignored — its output is never committed) and closes the open questions `design.md` §9 left for the fetch. It
authors no questions. Everything below was computed from the fetched corpus or read from it directly, and each finding
says how it was measured.

### The fetch, and that it reproduces

`scripts/fetch-corpus.ts` with `scripts/corpus-sources.ts` pulls three things into `.corpus/`: Wikipedia's
`List of Bluey episodes` wikitext, the wiki's episode articles from `Category:Episodes`, and every non-redirect
`/Script` transcript page. Both hosts are hardcoded — `en.wikipedia.org` and `blueypedia.fandom.com` — and every
request URL is asserted against that allow-list before it leaves the machine, with `redirect: 'error'` so a redirect
cannot smuggle the fetch onto a fanon host. There is no search step anywhere, which is the `content-pipeline.md` §1
requirement that a search-driven fetch would violate by picking up the fanon wikis.

`bluey.fandom.com` was found to redirect to `blueypedia.fandom.com`; the script names the canonical host directly so
nothing depends on following that redirect.

**Reproducibility was run, not asserted.** The script was run once, every content file SHA-256-hashed, then run a
second time from clean, and the hashes compared. All 364 content files were byte-identical across the two runs, and
the manifest was identical once its single date field was excluded. The script deletes `.corpus/` at the start of each
run, so "reruns from clean" is a property of the run rather than a hope. Determinism comes from sorting every
collection by title, writing a normalised trailing newline, and keeping only stable content — no revision ids, no
per-request timestamps. The manifest carries one coarse `fetchedUtc` date (`2026-09-24`), which is the only field that
changes across days and the only reason a rerun on a later date would differ without an editor having changed an
article.

The corpus that produced these findings was 365 files totalling roughly 4.3 MB. It is never committed; `git status`
was confirmed to show only the two script files, and `git check-ignore` confirmed the corpus is excluded.

### The transcript-page count, with a threshold and a date

**206 non-redirect pages in the main namespace end in `/Script`, measured 24 September 2026.** Counted by walking
`list=allpages` with `apnamespace=0&apfilterredir=nonredirects` and filtering titles ending `/Script`. This reconciles
the earlier 206-vs-220 disagreement recorded above: **206 is the non-redirect count; the 220 figure counted redirects
as well.**

Sized by UTF-8 byte length of the wikitext, the distribution is: 202 pages at 1 KB or more, 194 at 2 KB or more, 166
at 5 KB or more, and **151 at 10 KB or more.** That 151 matches exactly the stable sub-count the earlier passes agreed
on ("151 exceed 10 KB"), which is independent corroboration that the fetch reached the same corpus those passes saw.
Median script page is 13,064 bytes; the largest is 69,028.

The `/Script` pages exceed the 154 aired episodes because they also cover shorts, minisodes, songs and specials. Of the
154 aired episodes specifically, **153 have a `/Script` transcript** — only *Tickle Crabs* lacks one — so the
transcript-dependent rounds have near-complete source coverage.

### The scope assumption held

Parsed from the Wikipedia episode-list tables: **Series 1 has 52 episodes, Series 2 has 52, Series 3 has 50, for 154
aired episodes**, plus 21 Bonus Bits and 21 Minisodes, giving 196 populated synopsis rows in the one call. This
confirms the three figures `design.md` §5 and this log had been carrying on trust — 154 episodes, 21 minisodes, 21
Bonus Bits — and the "196 synopses in one API call" claim. Nothing in the scope assumption broke on contact with the
corpus. No fourth series appears; the canon is closed as the design assumes.

The wiki's `Category:Episodes` holds 157 article pages, three more than 154 because it includes a small number of
non-episode entries (an episode guide, the 2016 pilot, and similar). 155 of the 157 carry a `Trivia` section, averaging
roughly 2.2 KB each, which is the richest single vein for tier-2 and tier-3 facts.

### Contested Evidence does not survive as a full round

This is the finding the increment existed to produce, and it closes the biggest open risk in the content plan. **The
corpus does not support ten questions where two sources genuinely disagree or the show contradicts itself.**

The method: scan every episode article's prose for contradiction, continuity and ambiguity markers, then exclude the
three categories that look contested but are not usable. Animation goofs are freeze-frame trivia, which `design.md` §5
rules out as a failure mode. International dub and broadcast edits — a shot cut for one broadcaster, a character
renamed in a dub — are real-world and meta, which §5 puts out of scope. Live-tour scheduling changes are neither
in-universe nor about the show. What survives all three exclusions and meets §5's "two defensible answers" bar is a
handful: **roughly three to five genuine candidates, not ten.** The specific facts are withheld here, per the repo's
public-and-no-answers rule; what matters for the plan is the count and that it is well below ten.

The reason is structural, not a gap in the fetch: the wiki documents plot, appearances and production trivia, and
records in-universe self-contradiction only rarely. The famous fan-argued topics that might have filled the round are
barely present in the article prose — Bandit's occupation is mentioned in one article, exact character ages in one or
two.

Consequence, per the path §5 already specified: Contested Evidence stops being a standalone round. Its three-to-five
survivors fold into other rounds as individual contested questions, and the vacated slot goes to an eleventh theme.
`design.md` §5 and §9 and `increments.md` are updated to record this rather than leaving it as an expectation.

### Which themes have real depth

Reported honestly as two different things: **locator counts, which were computed**, and a **depth judgment, which is
mine from reading** and is not a question count. A locator hit means an episode article contains a keyword for the
theme; it does not mean a groundable question exists. Across the 157 episode articles:

| Theme | Episodes with a locator hit | Depth judgment |
| --- | --- | --- |
| The Support Act | 157 | Deep — minor characters saturate the corpus |
| Say That Again | 153/154 have a transcript | Deep — dialogue is almost fully covered |
| Games They Invented | 124 | Deep |
| For the Grown-Ups | 120 | Present but hard to ground — subtext resists a single checkable answer |
| Where and When | 111 | Moderate |
| Props Department | 103 | Deep enough for a second round |
| Family Trees | 102 | Deep enough for a second round |
| Alter Egos | 55 | Thin |
| Full Names and Formalities | 36 | Thinnest |

The design's guessed five second-round themes were The Support Act, Games They Invented, Say That Again, For the
Grown-Ups and Alter Egos. The evidence keeps the first three and replaces the last two: For the Grown-Ups is hard to
author as checkable fact rather than opinion, and Alter Egos is thin at 55 articles. **On the evidence the five second
rounds go to The Support Act, Say That Again, Games They Invented, Props Department and Family Trees.** This is a
recommendation from depth signals, not from authored questions; increment 7 authors against one round and can still
move a second-round slot if a theme underdelivers in practice.

### Not verified in this increment

- **That any of the three-to-five contested candidates actually yields a sound question.** This increment counted and
  categorised; it did not author or check. Whether a candidate survives blind re-derivation is an increment-7 question.
- **That the depth ranking predicts survival.** Locator hits and Trivia richness are a proxy for how many facts exist,
  not for how many pass both checks. The second-round allocation is a starting position, revisable in increment 7.
- **Transcript accuracy against broadcast.** The `/Script` pages are fan transcriptions; whether their wording matches
  broadcast subtitles was not checked and remains as it was in the earlier log entry.
- **The three extra `Category:Episodes` entries individually.** They were identified as non-episode entries in
  aggregate (157 vs 154), not each read, because they do not affect the 154-episode pool.
