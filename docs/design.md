# Heeler Pub Quiz — design

What this is, who it is for, and why it is shaped this way. This is the document to argue with.

Written 23 September 2026 from a research and design conversation on the same day, then revised the same day after a
four-reviewer pass.

Four companion documents, each a different job:

| Document | Holds |
| --- | --- |
| `content-pipeline.md` | How questions get made, checked, and corrected afterwards |
| `technical-design.md` | How the app is built. Architecture, data shapes, storage, testing, deployment |
| `verification-log.md` | What has been checked, what has not, and what turned out to be wrong |
| `increments.md` | In what sequence the work happens, and why that sequence |
| `research/phone-join-and-multiplayer.md` | Work that informed the design and is not part of it |

Sequencing is kept out of this document deliberately, so that a stale assumption here cannot hide inside a task list.

---

## 1. What this is

A trivia game about the animated series *Bluey*, pitched at adults who have watched every episode many times, run
from a single browser on a laptop or a television in somebody's living room.

One screen shows a question and a countdown. Teams talk among themselves and write an answer on a pad. The person
driving clicks to reveal, everyone finds out together, and the app records who got it. At the end of each round it
shows the standings. Honour system throughout.

No accounts, no server, no phones, no install.

The question bank is the project. The app is small and the 150 checked questions are not, which is why
`content-pipeline.md` is as long as this document.

## 2. Who it is for

Parents who have seen "Sleepytime" forty times and can recite most of it. The audience's expertise is not really
factual; they hold episodes as emotional objects. That single observation drives most of the content design below.

Everything that already exists for this show is pitched at children. The closest licensed product, *Bluey Beat the
Parents*, frames parents as opponents but is rated ages 5+, so its questions have to be winnable by a five-year-old.
No licensed adult quiz product or published quiz book was found. The fan material that does aim higher is scattered
and mostly breed-and-name recall.

Two to four teams. Designed for four, laid out for four, works with two.

## 3. What counts as working

Concrete and checkable:

- Three complete games can be played back to back with no question repeating.
- Every shipped question has been checked two independent ways first. `content-pipeline.md` §3 says what those are
  and why neither of them is the author marking its own work.
- A wrong question can be disputed or voided during play without stopping the game.
- The bank's error rate is a number somebody computed, not a hope.
- A whole game can be driven from the keyboard, without a mouse, from across a room.
- Readable from roughly three metres on a 1080p television.
- Scoring a question takes one or two taps, not a walkthrough.
- No build of the app that is not an explicit production build can render a real question.

That last one exists because the owner intends to play. The mechanism is in `technical-design.md`, and it is a build
configuration rather than a promise to be careful. What it cannot do is stop somebody opening the file in an editor.
That part is the honour system, and it is fine.

## 4. How a game runs

Setup, then four rounds of ten questions, then a final standing.

| Phase | Screen shows | Driver does |
| --- | --- | --- |
| Setup | Team name entry, timer length | Names two to four teams, starts |
| Round intro | Round title and its one-line blurb | Advances |
| Question | Question, countdown, round and question number | Pauses, extends, skips, or reveals |
| Reveal | Answer, episode it comes from, any note | Taps the teams that got it. Can dispute or void |
| Round break | Standings after that round | Advances |
| Final | Podium | New game, or reset |

Four rounds of ten is forty questions. At roughly sixty to seventy-five seconds per question end to end — show,
discuss, write, reveal, argue — that is forty to fifty minutes, plus three round breaks for about an hour. **That pace
is an estimate and it is the number most likely to be wrong.** Round length is configuration, not structure, so a
chattier group changes a setting rather than a design.

Five decisions inside that flow are deliberate.

**The timer never enforces anything.** It runs down visibly and then stops. Nobody should lose a question because they
were refilling a drink.

**It can also be paused.** Partly because someone will answer the door, and partly because a countdown sitting next to
the question is auto-updating content, and the accessibility rule covering that is hard to waive precisely because
this timer decides nothing. The two reasons agree, so it gets a pause.

**Per-question reveal, not per-round.** Traditional pub format holds the answers until the end of a round, which
requires a quizmaster who cannot play. Revealing per question means the whole room learns the answer at the same
moment, so the person driving is also a player. With two or three teams, that difference is a whole player.

**Nothing auto-advances.** Every transition is a deliberate press.

**A question can be voided mid-game.** If the answer is plainly wrong and the room knows it, the driver drops it from
scoring for everybody rather than arguing with the screen. `content-pipeline.md` §4 explains why this matters beyond
the moment: without it, a genuine error leaves no trace and the bank's quality stays unmeasurable.

The round blurb is one line of framing on the intro card — enough to set up what the round is about without giving any
of it away. Blurbs are written and checked as content under the same rules as questions, because a careless one could
answer a question in its own round.

## 5. Content design

### Scope

In: characters, plots, dialogue, locations, invented games, running gags, continuity, subtext. Out: writers, voice
actors, production, awards, ratings, broadcast history, merchandise, anything real-world or meta.

The canon is effectively closed, which is unusually convenient. 154 episodes across three series, no fourth series
announced, and the feature film does not arrive until August 2027. There are also 21 minisodes and 21 shorter "Bonus
Bits". **The 154 aired episodes are the question pool.** Shorts are a later decision, not a launch one.

"No fourth series announced" is deliberately weaker than the first draft's "not in production" — see
`verification-log.md`.

The three counts above were confirmed against the fetched corpus on 24 September 2026: the Wikipedia episode tables
give 52 + 52 + 50 = 154 aired episodes, plus 21 Bonus Bits and 21 minisodes. Nothing in the scope assumption broke on
contact with the corpus, and 153 of the 154 episodes have a transcript to author against. Details and method are in
`verification-log.md` under that date.

### Difficulty

Three tiers, mixed inside every round at three, five and two:

1. A regular watcher gets it.
2. You had to be paying attention.
3. Deep cut. One team might have it.

That mix exists so every team scores something and no team sweeps. It is also a guess about calibration against an
audience defined as expert, which is worth saying out loud: the mix is a starting position to adjust after the first
evening, not a finding.

Two failure modes to design against, both of which look like difficulty and are not. **Countable trivia** — how many
times a character says a word — is unanswerable and no fun. **Freeze-frame trivia** rewards owning the show on disc
rather than loving it. A hard question should feel like the answer is on the tip of your tongue, recoverable from
having genuinely watched.

### Rounds

Ten themes were drawn from how the owner actually phrased their own example questions. Nine survive as rounds; the
tenth, Contested Evidence, was cut to a scattered question type by the 24 September 2026 reality check (below), and an
eleventh theme takes its round slot.

| Theme | What it asks about |
| --- | --- |
| Full Names and Formalities | Middle names, full names, titles |
| The Support Act | Minor characters and their small stories |
| Games They Invented | Names, rules, who wins |
| Alter Egos | Pretend-play personas, invented names, aliases |
| Where and When | Locations, neighbourhood, continuity |
| For the Grown-Ups | Jokes and subtext aimed over the children's heads |
| Say That Again | A line of dialogue, name the episode |
| Family Trees | Relationships, cousins, grandparents |
| Props Department | Specific objects and what happens to them |
| Contested Evidence | Questions with two defensible answers, on purpose. No longer a round — see below |

Fifteen rounds, so five themes get a second one. The first draft guessed The Support Act, Games They Invented, Say
That Again, For the Grown-Ups and Alter Egos. The corpus reality check on 24 September 2026 recommended keeping the
first three and replacing the last two. **The owner ratified the five second rounds on 24 September 2026: The Support
Act, Say That Again, Games They Invented, Props Department and Family Trees.**

The reasoning for each change, so it can be argued with:

- *For the Grown-Ups* dropped — the subtext is real but resists a single checkable answer, so it reads as opinion
  rather than fact.
- *Alter Egos* dropped — thin, with pretend-play personas appearing in only about a third of episodes.
- *Props Department* added — specific objects and their fates are named concretely in the episode recaps and
  transcripts, which is exactly the material a checkable question needs.
- *Family Trees* added — the show's relationships (cousins, grandparents, the extended Heeler and Cattle families) are
  documented across roughly two-thirds of episode articles, deep enough to carry ten questions.

This rests on depth signals rather than on authored questions, so increment 7 may still bring a slot back to the owner
if a theme underdelivers once questions are actually written. The per-theme depth table is in `verification-log.md`.

**Contested Evidence does not survive as a round.** It assumed ten questions where two sources genuinely disagree or
the show contradicts itself. The fetch found roughly three to five once animation goofs, dub and broadcast edits, and
scheduling noise are excluded — well below ten, because the wiki documents plot rather than recording in-universe
self-contradiction. So the theme becomes those three-to-five questions distributed across other rounds, and the
vacated slot goes to an eleventh theme. **Which eleventh theme is an owner decision, not an authoring one.** Increment
7 surfaces a shortlist of the themes deep enough to carry a second round, the owner picks, and only then does increment
8 author it — the choice does not get made silently inside authoring. This closes the risk this paragraph used to
carry; the finding and its method are in `verification-log.md`, 24 September 2026.

Where a question is contested, the reveal shows both answers, says why they conflict, and states which ones score. So
a reveal can never be a single word.

### Answer shapes

Three, and no more:

- **Single.** One answer, optionally with accepted variants.
- **List with a cap.** "Name a few of Bingo's made-up names" — a point each up to a stated maximum.
- **Contested.** Two or more answers, each with a note, and an explicit scoring rule.

### The arithmetic, with slack in it

The first draft had none, and a pipeline that cuts questions with no room to cut them is a plan that fails quietly.

| | Count |
| --- | --- |
| Rounds attempted | 15 |
| Candidate questions authored per round | 12 |
| Candidates authored in total | 180 |
| Questions shipped per round | 10 |
| Questions shipped if every round survives | 150 |
| Rounds needed for three games of four | 12 |

Two candidates of slack per round absorb the cuts. A round that cannot reach ten survivors is dropped whole rather
than shipped short, because an eight-question round makes scores across rounds incomparable. Twelve surviving rounds
is the floor and three games is what the floor buys; the three rounds above it are genuine reserve, for an evening
that runs fast or a tiebreak.

## 6. What it costs

**Money: nothing.** GitHub Pages is free for public repositories, there is no backend, no database and no paid API. A
custom domain is optional and unnecessary.

**Effort, in artefacts rather than hours.** 180 candidate questions authored and checked, 150 shipped, 15 round files,
one fixture bank, and roughly six screens. No hours estimate is given, because any number offered would be invented
and AGENTS.md says to report counts that were actually computed.

**What falls to the owner** is small and worth naming, since almost everything else is agent work: answering the open
questions in §9, reading twenty sampled questions after an evening has been played, and deciding whether three games
is the finish line.

## 7. Legal posture

Reporting decisions, not giving legal advice.

The show is produced by Ludo Studio; BBC Studios holds global distribution and merchandising. Documented enforcement
is almost entirely counterfeit physical goods, plus one cease-and-desist in May 2024 to a Las Vegas restaurant over an
unauthorised themed event. No documented action against a fan wiki or a non-commercial fan quiz was found, which is
absence of evidence rather than permission.

**A correction to the first draft, because it had the lesson backwards.** That restaurant event was free. The
reporting describes a community giveaway, and BBC Studios' stated basis was brand confusion and unauthorised use of
the mark, not commerce. So charging nothing is not what keeps a project out of trouble. What drew the letter was
publicly promoting an unlicensed thing using the name, in a way that read as though it were licensed. That is a more
useful thing to design against, and it is a different thing.

Decisions taken from that:

- The show's name stays out of the product name, the repository name and the domain. The product is **Heeler Pub
  Quiz**, and the published repository and Pages site are `heeler-pub-quiz`. The local working folder is still named
  after the show and is not published.
- No character art, no logo lettering, no theme music, no screenshots.
- Nothing that presents the game as official, licensed, or connected to the show's owners. An unofficial and
  unaffiliated notice in the footer.
- Catchphrases are out too. Two candidates turned out to be in use by the rights holders: one has appeared in BBC
  Studios press release headlines and on a licensed watch, the other is the branding of a retail collaboration. A
  generic dog-breed word is the safer wink.
- Non-commercial. No tickets, no ads, no sponsorship. Not because commerce is the trigger — see the correction above —
  but because it raises the stakes and buys nothing this project wants.
- Questions are written fresh from facts rather than reworded from wiki prose. The general principle usually pointed at
  is that facts are not protected while a particular expression of them is, with
  [Feist v. Rural Telephone](https://supreme.justia.com/cases/federal/us/499/340/) (US, 1991) as the common reference.
  Three jurisdictions are plausibly in play and this is not advice, which is why the design does not lean on the
  principle harder than it has to.
- **One place the project does reproduce wording, argued rather than waved through.** The Say That Again round quotes a
  line of dialogue and asks which episode it is from. Paraphrasing would destroy the round, since recognising the words
  is the whole point. So: one line per question, never an exchange, never a scene, and no round that accumulates into a
  transcript. That is a short excerpt used for identification, which is a different act from redistributing dialogue —
  and it is the single place this posture is doing real work rather than avoiding a question.

## 8. Ruled out, and why

Recorded so the design cannot quietly contradict where the conversation started.

**Phones joining by QR code.** The original request, and it is gone. One shared screen with answers on paper turned out
to be the better game at two to four teams, and it deleted the entire multiplayer problem with it. The research is
preserved in `research/phone-join-and-multiplayer.md`, with what would justify revisiting it.

**A Cloudflare Worker with a Durable Object.** The recommended architecture while phone joining was in scope, and it
was viable and free. With one screen there is no shared state to coordinate.

**WebRTC peer-to-peer.** Rejected even while phone joining was in scope, because it does not avoid infrastructure, it
relocates it to a relay credential embedded in a public bundle plus public signalling relays with no guarantee.

**Printable answer sheets.** Overkill at this scale. Teams still need to write an answer before the reveal or the
honour system becomes "we were going to say that", and a pad does that without a print stylesheet.

**IndexedDB via Dexie**, which the standing stack preference names. That preference scopes it to a progressive web app,
and the progressive web app is ruled out below. Two small keys and a game object do not need a database. This
deviation was taken silently in the first draft and is recorded here because every other one was.

**A transcript corpus in the repository.** See the tiers table in `content-pipeline.md`.

**A router.** The game is six phases of one screen held in state. There are no URLs to move between. The first draft
specified hash routing and justified it with a claim about GitHub Pages that was half wrong and, more to the point,
solving a problem this app does not have.

**Question-level repeat tracking.** Round-level is simpler and matches themed rounds. Revisit only if partial rounds
become a real need.

**Offline support via a service worker.** A living room has wifi and the app is static, so a page that has loaded keeps
working. Cheap to add later if a venue proves otherwise. Nothing in §3 tests this, which is the honest cost of the
decision.

**Counting the shorts and minisodes as canon for launch.** 42 extra items of uneven availability against 154 episodes
everybody has actually seen. Later decision.

## 9. Open questions

1. **Default timer length.** 45 seconds is the placeholder.
2. **Tiebreaks.** Three reserve rounds exist. Whether a draw needs more than "play another round" is undecided.
3. **Whether three games is the finish line** or the first milestone of a larger bank.

Resolved by the 24 September 2026 corpus fetch (see §5 and `verification-log.md`):

4. ~~Whether Contested Evidence survives as a round.~~ **Closed: it does not.** The corpus yields roughly three to
   five genuinely contested facts, not ten — a count low enough that the conclusion does not depend on the exact
   number. They scatter across other rounds and an eleventh theme, itself an owner choice, takes the slot.
5. ~~Which five themes get a second round.~~ **Answered and ratified by the owner:** The Support Act, Say That Again,
   Games They Invented, Props Department and Family Trees. Held open in one respect: it rests on depth signals rather
   than authored questions, so increment 7 brings a slot back to the owner if a theme underdelivers in practice. Not a
   prediction that has been tested, so not fully closed.

Settled since the first draft: the product name and the published repository name, both `heeler-pub-quiz`.
