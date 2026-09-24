# Research: phones joining by QR code

**Not part of the design.** Parked on 23 September 2026 when the game format changed to one shared screen with
answers on paper. Kept because the research was sound and the decision was about format, not feasibility.

Everything here was gathered on 23 September 2026. Platform facts age fast; treat every figure as needing a
re-check before acting on it.

---

## Why it was parked

The original request was players scanning a QR code and answering on their own phones. Two things removed the need.

At two to four teams in a living room, paper is simply a better game. It is faster to score by voice than by
handset, it keeps everyone looking at each other, and it has no failure mode.

Per-question reveal already solved the problem phones were solving. The reason to give everyone a device is usually
so the person running the quiz is not excluded. Revealing each answer on the shared screen at the same moment does
that for free.

## What would bring it back

Any one of these, and the work below becomes relevant again rather than historical:

- Playing with more teams than can gather round one screen.
- Playing remotely, with people in different houses.
- Wanting speed-based scoring, where who answered first matters. This is the only one that genuinely needs devices.
- Wanting per-player statistics across a night.

The recommendation if it does come back is at the bottom, and it has not changed.

## The options that were on the table

| Option | Infrastructure | GitHub Pages | Venue failure modes | Cost |
| --- | --- | --- | --- | --- |
| Host screen only, paper answers | None | Yes | None that matter | Nil |
| WebRTC peer-to-peer | Third-party signalling plus a relay credential | Yes, with the credential in the bundle | Mixed networks, client isolation, carrier NAT, relay outages | Nil at this volume |
| Worker plus Durable Object | One Worker deployment | Static app yes, Worker separate | Only total loss of internet | Nil on the free plan |
| Managed realtime service | Vendor account and public key | Yes | Vendor key in a public bundle, free-tier caps | Nil at this volume |

The chosen design is row one. Row three was the recommendation while phones were in scope.

## Cloudflare Workers and Durable Objects

This is the part worth keeping, because it is the load-bearing fact and it was verified directly rather than
recalled.

From [the Durable Objects pricing page](https://developers.cloudflare.com/durable-objects/platform/pricing/),
fetched 23 September 2026 and paraphrased:

- The Workers **free** plan can create and access Durable Objects, SQLite-backed only. Key-value-backed classes are
  paid-plan only.
- Free allowances are **100,000 requests per day** and **13,000 GB-s of compute duration per day**, resetting at
  midnight UTC. Exceeding a limit fails that operation type rather than billing.
- Storage on free: 5 million rows read per day, 100,000 rows written per day, 5 GB total.
- Incoming WebSocket messages are billed at a 20:1 ratio. Outgoing messages and protocol pings are not billed.
- A Durable Object that is idle and eligible for hibernation is not billed for duration. The WebSocket Hibernation
  API is documented as the way to avoid duration charges on a long-lived socket.

A trivia night for a dozen teams sits several orders of magnitude inside those allowances. The practical upshot: a
room coordinator for this game is free, and free with a lot of headroom.

[The limits page](https://developers.cloudflare.com/durable-objects/platform/limits/) confirmed availability on both
plans. Storage is 5 GB per account on the free plan and 10 GB per Durable Object. **Corrected 23 September 2026:** the
first draft of this file said 1 GB per object on free, which appears nowhere on that page. 1 GB is the paid plan's
key-value stored-data allocation on the pricing page — wrong number from the wrong table.

*Content rephrased for compliance with licensing restrictions.*

### Ecosystem

PartyKit was acquired by Cloudflare ([announcement](https://blog.cloudflare.com/cloudflare-acquires-partykit/)). Of
its successors, `partyserver` and `partysocket` were both alive on npm in 2026 with substantial weekly download
counts. `partysocket` is the piece worth using regardless of transport — it handles reconnection backoff, which is
otherwise hand-rolled badly.

## WebRTC, and why it was rejected first

It looks like the no-infrastructure option and it is not.

[Trystero](https://github.com/dmotz/trystero) was the strongest candidate: MIT licensed, actively developed through
September 2026, roughly 10,000 weekly downloads. Its default signalling runs over **public Nostr relays**, with
swappable strategies for MQTT, BitTorrent, Supabase, Firebase and IPFS. So "no infrastructure" means somebody else's
infrastructure, unpaid, with no guarantee. Two open issues at the time of research were exactly the live-failure
class: slower room joining after a change to Nostr announcements, and a failed leave that left a room permanently
un-rejoinable.

[PeerJS](https://github.com/peers/peerjs) is widely used but was last pushed in February 2026 with roughly 200 open
issues, and its free broker is a community service rather than a product. PlayPeerJS wraps it with exactly the
host-authority pattern this game wanted, but is a single-author project with a few dozen weekly downloads. Worth
reading, not depending on.

### The network reality, which is the real objection

Phones on mobile data with the shared screen on venue wifi is the hard case, and in a pub it is the *normal* case.
Carrier-grade NAT is typically address-and-port-dependent, so hole punching does not work reliably and the
connection falls back to a relay.

Counter-intuitively, everyone on the same guest wifi is worse. Access-point client isolation blocks device-to-device
traffic at layer 2, so the local path dies and there is no hairpin back to an isolated peer, which kills the
reflexive path with it. Isolation is not part of the 802.11 standard, so vendor behaviour is inconsistent
([SANS, March 2026](https://www.sans.org/blog/airsnitch-wi-fi-client-isolation-what-security-teams-actually-need-know);
[TP-Link, May 2026](https://www.tp-link.com/us/blog/2586/what-is-ap-isolation-and-when-to-enable-it-/)). Only a
relay over TCP on port 443 reliably survives it.

How often relays are needed: measurements cited in the WebRTC community put the **relay rate** at around 15–20% of
consumer sessions, rising to 30–40% for business users behind corporate firewalls
([OpenVidu](https://openvidu.medium.com/connectivity-resilience-and-security-in-webrtc-deployments-key-considerations-on-turn-56e73e6fb6d4);
[Forasoft](https://www.forasoft.com/learn/video-streaming/articles-streaming/ice-stun-turn-deep-dive)). **Those are
video-conferencing populations, not this game.** Treat them as evidence that the problem is real, not as a rate for
this shape of app.

**Corrected 23 September 2026:** the first draft of this file also claimed 15–30% of sessions *fail* without a relay.
That conflated two relay-rate bands into a different quantity. The sourced figures describe how often a relay gets
used, which is not the same as how often a connection would fail without one. The argument for a relay does not need
the stronger claim.

Cloudflare offers a TURN relay at $0.05/GB, documented as free when paired with its realtime SFU
([TURN docs](https://developers.cloudflare.com/realtime/turn/)). Payloads here are kilobytes, so cost is nil either
way. The point is that once you hold a relay account and a credential, the peer-to-peer route has not avoided
infrastructure. It has moved it somewhere with worse ergonomics and put a secret in a public bundle.

## QR joining mechanics

Kept because it is useful and cheap if phones ever return.

Encode the complete join URL with the room code in the hash — `https://owner.github.io/app/#/j/BLUE7` — because
GitHub Pages has no server-side rewrites. The short code exists only for whoever's camera will not cooperate;
scanning should require no typing at all.

`qrcode.react` (ISC licensed, very heavily used, repository active through September 2026) was the pick, with
`react-qr-code` as a fine alternative. The plain `qrcode` package has enormous download numbers and a repository
untouched since August 2024.

Short codes without a server: let the code *be* the room name, drawn from an alphabet with no ambiguous characters
such as Crockford base32. Four characters gives roughly a million combinations, and even fifty simultaneous games
worldwide puts collision risk near a tenth of a percent. The real problem is not the probability, it is that **a
collision cannot be detected** — two games silently merge into one room. A Durable Object can claim-or-reject a code
atomically, which removes the failure mode rather than making it unlikely. That was a small but genuine argument for
the server.

## Prior art

None of it turned out to be a better starting point than writing the round logic directly, which is small. Recorded
so the search does not need repeating.

| Project | Licence | Status when checked | Use |
| --- | --- | --- | --- |
| [shone/phoneparty](https://github.com/shone/phoneparty) | **No licence file** | Last pushed March 2023 | Read only, and legally read-only. Good two-panel phone control layout |
| [jccr/mpg](https://github.com/jccr/mpg) | **No licence file** | Last pushed February 2024 | Reference only |
| [Ralex91/Rahoot](https://github.com/Ralex91/Rahoot) | MIT | Active September 2026 | Best available read for a round state machine. Needs a persistent Node host, so it cannot go on Pages |
| [ClassQuiz](https://github.com/mawoka-myblock/ClassQuiz) | MPL-2.0 | Active September 2026 | Needs Postgres, Redis and a search engine. Wrong weight class |
| quizlive | **No licence, non-commercial notice** | — | Do not use |

Absence of a licence file was confirmed through the GitHub API for the first two; licence headers inside source
files were not checked.

## Reliability patterns worth keeping

These are good design regardless of transport, and two of them apply to the current single-screen design.

**The shared screen is the single source of truth.** Devices send intent — "answer B for question seven" — and never
scores.

**Broadcast whole-state snapshots, not deltas.** At a dozen players the bandwidth is irrelevant, and reconnection
becomes "receive current state" with no log to reconcile.

**Persist an identifier and rejoin with it.** A player id in local storage plus an idempotent submission keyed on
player and question turns a screen lock, a refresh or a dropped socket into a non-event instead of a duplicate
player. This was the single highest-value pattern found.

**Assume a phone socket dies silently.** A backgrounded or locked mobile browser stops executing JavaScript and
leaves a half-open socket, reported consistently from 2018 through 2026. Reconnect on the page becoming visible
again, not only on a close event.

**Never block a round on a missing player.** The timer lives on the shared screen, absent answers score zero, and a
dropped player gets a quiet badge on the roster rather than a modal on the big screen.

**Applies now:** hold a screen wake lock on the shared display, and persist its state locally so that a refresh does
not end the evening. **Corrected 23 September 2026:** the first draft said both were already in the current design.
Persistence was; the wake lock was in neither document. It is now specified in `../technical-design.md`.

**Degrade deliberately.** Single-screen play is the fallback for any networked version, which is an argument for
building it first in any case. That is what happened.

## The recommendation, if phones return

Static app on GitHub Pages, plus one Cloudflare Worker holding a single SQLite-backed Durable Object per room over
hibernatable WebSockets. The shared screen stays the authority; the object is a message bus, a roster, and an atomic
registry for room codes.

It is free by a wide margin, it behaves identically whether phones are on mobile data, home wifi or an isolated
guest network, and it needs no relay, no third-party signalling and no credential in the bundle.

**The strongest argument against it:** a second deployment surface, a vendor account and a configuration file added
to a party game that usually runs in one room where everyone is on the same wifi. The whole thing can no longer be
tested by opening a file. The free tier is metered daily and can change unilaterally. And the day the account lapses
or the Worker is misconfigured, the game is dead, where a peer-to-peer version has no account to lapse.

## What was not verified

- Whether the free plan requires a payment method on file to create a Durable Object namespace.
- Whether a `wss://` connection from a `github.io` page to a `workers.dev` host needs any content-security-policy
  work. Expected to be fine, since WebSockets are not governed by CORS, but untested.
- The real peer-to-peer success rate for this shape of game. The 15–30% figures are video-conferencing populations.
- Trystero's default relay list, and whether its rate limits would affect one room per evening.
- Rahoot's actual game loop — repository metadata was read, not the code.
- Current mobile Safari background WebSocket behaviour on real devices. Every citation is a bug report, not a test.
- Cloudflare's relay free-tier wording, which read inconsistently across two of its own pages.
