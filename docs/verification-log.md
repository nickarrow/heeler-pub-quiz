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
