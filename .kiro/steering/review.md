---
inclusion: manual
---

# Review protocol

Type `/review` in chat to run this.

Send several reviewers at the work in parallel. Give each one a different job and a different source to check
against. The different source is the part that makes this work. Several agents reviewing the same text against the
same shared opinion produces four versions of one opinion.

Models are bad at finding errors in their own reasoning and good at fixing errors once somebody points at the spot.
That asymmetry is the whole reason to do this.

## Running it

Invoke reviewers two at a time so they run in parallel, then the second pair. Give each one the file paths it needs.
A reviewer that has to go looking will review the wrong thing. Cap each one's reply so it stays readable.

Four mandates that have earned their place:

Against the source. Check every citation, figure and factual claim against the thing it cites. Does the source say
what the text claims? Is the number characterized correctly? Flag anything stated more strongly than its source
supports. Search for evidence published since that would change a conclusion.

Against the mechanism. Check whether the tools, commands and configuration actually behave the way the work assumes.
Read the current documentation. Where the documentation is ambiguous or contradicts itself, say so rather than
picking the reading that is convenient.

Cold, as the reader. Read it as the person it is for, with their knowledge and not yours. Where would they stop
reading? Which words are undefined? Where does it sound reasonable and leave them unable to act? Name the sticking
points concretely.

Red team. Attack the plan. Is the order defensible? What does it claim to deliver and not deliver? What is missing
entirely? Where is a research question wearing a delivery date?

For code specifically, add a fifth: would a senior engineer be comfortable with this, looking at the whole
repository rather than the diff? No constants, no tests on a critical path, a 900-line file, a type stuffed with
data. The thing this is really guarding against is a future person having to debug something nobody understood when
it was written.

## Then do the hard part

Every finding is a lead, not a fact. Open the file. Confirm it yourself. Reviewers hallucinate line numbers and
occasionally invent the problem.

Report by severity: blocking, should fix, note. Each with the file, the quoted text, and the source or rule it
violates.

Say what you could not verify, explicitly.

Report counts you actually computed. If you did not compute it, write "roughly" or leave it out.

Say which findings you rejected and why, and how many you dropped. This step gets skipped and it is the one that
keeps the practice honest.

Report. Do not fix. Ask what to change.

## Why it is a command and not automatic

A hook could run this on a trigger, but a hook cannot make the fan-out happen. It can only put a request in front of
the agent, which then decides. Running it deliberately is the honest version, and one command is cheaper to
understand than automation that sometimes does nothing.

The cost is real. This uses a lot of tokens and a lot of context. It is still the highest-value thing in these
files.
