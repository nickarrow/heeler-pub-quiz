# Heeler Pub Quiz — content pipeline

How questions get made, how they get checked, and how a wrong one gets found afterwards. This is the working
instruction for the content half of the project, which `design.md` §1 calls the project.

Written 23 September 2026. Rebuilt the same day after a reviewer took apart the first version's verification step,
correctly. Separate from `design.md` because authoring content and designing a game are different activities with
different readers.

---

## The bar

For this audience one wrong answer costs the credibility of the whole evening.

A worked example of what that means in practice. During the design conversation a catchphrase was confidently
attributed to the wrong parent from recollection, and the wiki attributes it to the other one. That is the resolution
these questions live at, and it is why **no question is written from a model's memory of the show.**

## 1. Fetch

The corpus is pulled once into local files under `.corpus/`:

- Wikipedia's episode list, which returns 196 populated synopses in a single API call.
- The established Bluey wiki's per-episode articles and transcript pages, which carry scene-level detail the
  synopses do not.

**Pin the fetch to `blueypedia.fandom.com` explicitly.** At least three *fanon* wikis host fan-invented Bluey
material, including a fabricated fourth-series episode list. Anything search-driven will pick them up, and a question
sourced from invented canon is the worst possible failure for this audience — confidently wrong, and wrong about
something that never happened.

The fetch script is committed. Its output never is. See the tiers table below.

## 2. Author

Each candidate question is written against the stored text, recording:

- the episode, as series and number
- the source URL
- the passage that grounds it, capped at 40 words

Over-author deliberately: twelve candidates per round, ten shipped. `design.md` §5 has the arithmetic and why the
slack is there.

The first authoring pass also reports back on two things the design guesses at and nobody has verified — whether ten
genuinely contested facts exist, and which themes have real depth. Both are open questions in `design.md` §9, and
this pass is what closes them.

## 3. Check, two ways, neither of which is the author marking its own work

The first version of this document said questions would be verified "in a separate pass" against the source. A
reviewer took that apart and was right to. The independence there was from *recollection*, not from the author, and
AGENTS.md says plainly that several agents checking one shared opinion is not review.

The deeper problem: **tracing a question to a source URL proves provenance, not correctness.** A question can cite a
real passage and still be ambiguous, under-specified, or have the wrong answer attached to it.

So two checks, chosen because they fail in different directions.

### Blind re-derivation

A fresh session is given the question and the cited passage with **the answer withheld**, and has to produce the
answer itself.

- Agreement passes.
- Disagreement means the question is ambiguous or wrong. It is cut or rewritten, not argued with.

Withholding the answer is the entire point. The documented asymmetry is that models miss their own errors and catch
the same error once it belongs to someone else. A checker that can see the proposed answer is being invited to agree
with it.

This is also the only check that catches ambiguity, which is the most common way a technically-correct question still
ruins a round.

### Cross-anchor against a second source

The fact has to appear in, or at least not contradict, a source other than the one it was authored from — the
Wikipedia synopsis, the wiki's episode article, or the official episode page.

Anything resting on a single source is either cut, or shipped as tier 3 with the reveal naming what it rests on.

### What these checks are not

Neither is a human expert, and claiming otherwise would be dishonest. They are two machine checks that fail
differently, which is better than one that fails in the same direction as the author, and worse than a person who has
watched the show. The human step is below, and it is deliberately after play.

## 4. Discover errors after shipping, because otherwise nobody ever does

The owner has opted out of reading the bank in order to play. Without a route back, that makes the error rate
unobservable by construction. That was the real flaw in the first version — worse than any single wrong answer,
because it was unfalsifiable.

### During play

Two controls on the reveal screen:

- **Dispute** records the question and a note. It interrupts nothing and needs no discussion at the time.
- **Void** drops the question from scoring for every team, for when the answer is plainly wrong and the room agrees.

Both write to local storage. A review screen lists them and exports them so they can be acted on.

Voiding rather than arguing with the screen matters for a second reason: `design.md` §5 makes contested questions a
deliberate feature, so without a void control a genuine error looks exactly like a designed one.

### After an evening

- Every disputed question is reviewed.
- Plus twenty shipped questions drawn at random.

That produces a count of errors out of a known sample, which is an error rate rather than a feeling. **Two or more
errors in twenty sends the bank back for a full pass.**

After, not before, because the owner is a player. The error rate becomes knowable one evening later than would be
ideal, which beats never.

## Three tiers of content, and what is committed

| Location | Holds | In git | Shipped |
| --- | --- | --- | --- |
| `.corpus/` | Raw fetched transcripts and articles | No | No |
| `content/verification/` | Per question: source URL, and an excerpt capped at 40 words | Yes | No |
| `content/rounds/` | The question bank | Yes | Yes |

Transcripts are the show's dialogue regardless of who typed them up. Committing a transcript corpus to a public
repository is the riskiest thing this project could do and it is entirely avoidable.

`technical-design.md` covers what keeps the verification record out of the shipped bundle, and the two things that
would break it.

## Two banks

The owner intends to play, so no ordinary build may expose real questions.

- **Any build that is not an explicit production build loads a fixture bank** of obviously invented content, with a
  visible badge on screen.
- **The real bank requires an explicit production build**, which only the deploy workflow performs.

Fixture questions are written by hand as part of the app work rather than drawn from the corpus, and they cover all
three answer shapes so every code path is exercised by the set that is safe to look at. They are also what any
screenshot or demo link shows.

The first version called this a flag, and a reviewer showed the flag does not work. `technical-design.md` has the
mechanism that does, and is honest about what it still cannot guarantee.

One thing stated plainly rather than discovered later: the real questions ship inside a public JavaScript bundle and
anyone who opens developer tools can read them. The honour system covers that, and obfuscation would be theatre.

## Commits

Content changes go straight to `main`, prefixed `content:`, with a message that names counts and which rounds were
touched and **never quotes a question or an answer**.

The reason is in `technical-design.md` under Git workflow: a pull request touching `content/rounds/` puts the answers
in a diff the owner would read while reviewing it, which defeats the two-bank scheme entirely. Content is therefore
not reviewed by the owner, by design, and the post-play sampling above is what replaces that review.
