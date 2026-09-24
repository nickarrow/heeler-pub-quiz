# How to work

It is one person's practice, about a year in, self-taught. The evidence behind the parts that have evidence is listed
at the bottom. Read this at the start of hour two, not during setup. Ten minutes.

The single most useful habit is the one nobody tells you: when you do not know a word or a concept, ask. "What is a
constant." "What does a design system mean here." "Why would I want a branch." It is faster than looking it up and it
is how most of this got learned in the first place.

## Starting something new

Do not start by building. Start by talking.

Open a fresh session and describe the idea. What is it for, who uses it, what would count as working. Then ask the agent
to go and research it. Has anyone built this. Is there open source to pull in. What is the state of the art. Send
sub-agents out to crawl and come back. Chase a tangent, read what comes back, come out again.

This takes an hour, sometimes three. It feels like wasted time and it is the most valuable hour of the project.

At some point it will offer to scaffold something, meaning generate the empty skeleton of a project. It will sound
reasonable and you should say no. That offer arrives at the exact moment you have enough context to feel productive and
not enough to be right. Say yes and two hours of research turns into a folder structure with the reasoning gone.

`AGENTS.md` tells it not to make that offer, so if it does, the rules are not reaching it and check one in the README
is worth running again.

Instead, ask for the writing up:

> Take this whole conversation, the research, the decisions, and the things we ruled out, and put it in a design
> document we can anchor the project to. Do not scaffold anything yet.

Then ask for the order of work as a separate document, in coarse increments, each one leaving something that works.
Two documents, because the first says what and why and the second says in what sequence. Keeping them apart is what
stops a task list becoming the place a stale assumption hides.

Then review it before any code exists. Type `/review`. Several reviewers go out, each checking a different source, and
they come back with findings. Work through them. Take some, argue with others. Not every finding is right.

Then, optionally, have it dry-run the first increment:

> Pretend you are executing increment one. Do not change anything. Tell me what you hit.

On one project that caught a plan whose first step needed a tool a later step was going to install. One prompt.

Then hand off deliberately. By now the session is nearly full. Do not start the next one yourself:

> Give me the ideal prompt to hand your successor for this work.

Open a new window, paste it, go. Otherwise it auto-compacts and you are talking to something working from a summary
that quietly dropped things.

`missions/build-something-you-need.md` walks this whole sequence with something you actually want.

## Coming back to something you left

Different pattern, and this is the one with the most evidence against doing it casually. Published work found
experienced developers were slower with AI in large codebases they knew well, which is exactly this situation.

Open a fresh session and hold the task back:

> Become the expert in this repository. Read the documentation, send your sub-agents, work out what this is and how it
> runs. Do not change anything. Then I will give you a task.

Hold it back deliberately. Tell it your goal first and you get a tour of whatever relates to your question instead of
an understanding of the system. If it finds a defect while looking, have it write the defect down and keep going.

Then ask what it could not work out. That answer is usually the most useful thing you get all day.

Then give it the task, and go back to the conversation-first pattern above for whatever the task is.

`missions/document-a-system.md` walks this one.

## While you are working

Fire `/review` before anything substantial ships. It costs a lot of context and tokens and it is worth it every time.
The reason it works is that each reviewer checks against a different source. Four agents checking one shared opinion
gives you that opinion four times.

Treat every finding as a lead. Open the file and confirm it yourself before you act. Reviewers invent line numbers and
occasionally invent the problem. Say how many you threw out.

When the interface is wrong, take a screenshot and paste it into the chat. Describing a layout problem in words fails
and the agent sees it immediately in a picture. This works in a cloud console too when you do not know what a field
wants.

Let it write commit messages and read them before committing. Let it make branches and open pull requests. It is good
at all of that.

One feature per pull request. Die on that hill. Get into the habit of piling six features into one and nobody will ever
review your work properly, including you in six months.

Watch file sizes. Two to three hundred lines is what a person will actually read, and `AGENTS.md` sets that target.
Agents append rather than refactor, so files grow quietly, and by the time one is nine hundred lines the refactor is
already overdue.

When you need a starting technology choice, type `/stack`. It is one opinion as of this year and it says so. Ignore it
entirely if your team has a mandated stack, and delete the file if you find it in the way.

## When it goes sideways

Context fills up. Hand off with the successor prompt above rather than letting it compact on its own.

Documents start disagreeing. Five increments in you have pivoted, updated the one you were working on, and left the
plan above it alone. Write a dated note recording what changed and what you got wrong, rather than editing the history
to look like you knew all along. The direction of an error matters as much as the fact of it.

It is confidently wrong. That is what `/review` is for, and it is why findings get confirmed rather than believed.

It starts changing things you did not ask it to. Stop it and say so plainly. `AGENTS.md` tells it to change only what
it was asked to change, so this happening means the rules are not reaching it. Run check one in the README again.

You inherit something vibe-coded and unreadable. Sometimes the answer is a new repository with the old one as a
reference, carrying only what is currently true. That is fine for a prototype. It is not available for anything
operational or federally funded, where records retention and the software conditions at 42 CFR 433.112 apply.

## What not to do

Do not spend three days configuring hooks and automation instead of building your thing. The tooling is genuinely
useful and it is also the easiest place in this whole practice to let the tail wag the dog. Automate something once it
has annoyed you twice.

Do not put a model in the path that decides something about a person. That one is not a preference. `AGENTS.md` has it.

## Where this comes from

The practice above is mine. Most of the reasons for it are not. This section exists so that when somebody asks why you
work this way, you have something to point at other than me.

One thing to be clear about before the numbers, because out of context they look worse than they are. None of this
measures how often an agent will be wrong at the thing you are about to do. These are studies of narrow tasks under
controlled conditions, and each one is here because it is the argument for a specific habit above. Read them as reasons
the practice has a review step in it. They are not a verdict on the tool.

On speed, the practice promises none. A randomised trial found experienced developers about 19% slower with
early-2025 tools in repositories they already knew well, while believing they had been 20% faster: *Measuring the
Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*
([METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)). The same team ran it again on
late-2025 tools and the returning group came out faster, on a range that crosses zero, with their own warning that the
result is hard to interpret ([follow-up](https://github.com/METR/Measuring-Late-2025-AI-on-OSS-Devs)). Nobody should
be selling you a speed number, including me. It is also why the "coming back to something" pattern above slows down
deliberately at the start.

On small pieces and version control. Autonomous coding agents raised commits around 240% and actual releases
around 30%, so the work piles up at review rather than at writing: *Writing Code vs. Shipping Code*
([NBER](https://www.nber.org/papers/w35275)). Working in small batches and strong version control practices are two of
the seven capabilities DORA found decide whether AI helps a team or amplifies its problems
([DORA AI Capabilities Model](https://cloud.google.com/blog/products/ai-machine-learning/introducing-doras-inaugural-ai-capabilities-model)).

On why `/review` sends several rather than asking once. Models struggle to find their own reasoning errors while
correcting them reliably once somebody points at the location, so the weakness is in the finding: *LLMs cannot find
reasoning errors, but can correct them given the error location*
([arXiv 2311.08516](https://arxiv.org/abs/2311.08516)). One benchmark measured a 64.5% blind spot across fourteen
models, where a model fails on its own error and fixes the identical error when it is attributed to somebody else:
*Self-Correction Bench* ([arXiv 2507.02778](https://arxiv.org/abs/2507.02778)). Those were non-reasoning models, so
treat it as suggestive. And self-correction with no outside input often turns correct answers into wrong ones
([Huang et al., 2023](https://arxiv.org/abs/2310.01798)).

On confirming a finding rather than believing it. In a study of automated program repair, manual analysis of 812
sampled repairs found unsupported claims in 72.7% of them, with wrong identification of the cause accounting for 45.9%
of those, including patches that passed every test: *Better Understanding, Better Fixes?*
([arXiv 2609.04909](https://arxiv.org/abs/2609.04909)). That is one narrow task on one benchmark, not a general error
rate, and it is the reason for opening the file yourself.

On writing things down without building a pipeline. One practitioner ran a spec-driven toolkit across a feature in his
own application and recorded 2,577 lines of generated markdown and three and a half hours of his own review time. The
comparable work his usual way, in small increments with simple prompts, took fifteen minutes of code review and nine
minutes of functional testing, produced more working code, and generated no markdown at all
([Scott Logic](https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html)).

Two failure modes have names, in case you meet them. Context explosion, where the agent reasons over a whole
repository until quality degrades, and silent spec-code drift, where code moves and the document does not: *The Spec
Growth Engine* ([arXiv 2606.27045](https://arxiv.org/abs/2606.27045)).

The older ideas this borrows. The dated decision record is Michael Nygard's, from
[November 2011](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions.html). A thin first increment
that touches every layer is Alistair Cockburn's walking skeleton. Planning work as increments that each ship goes back
to Tom Gilb. None of it is new, and I reinvented most of it before finding out it had names.
