---
inclusion: manual
---

# Starting technology preference

Type `/stack` to load this. Delete the file if your team has its own stack, and delete it without touching
`AGENTS.md`, which holds the rules that matter.

This is one person's preference as of September 2026, not a recommendation for your program. Tooling in this space
turns over fast and this file will age badly. That is fine. It exists so an agent has a default instead of picking
something at random.

## Default to no backend

Start with something that runs in the browser. Static build, local storage, no server, no accounts. Stay there as
long as the problem allows.

For a government agency the governance cost of a backend is enormous. No server means no protected data in transit,
none at rest on agency infrastructure, no data sharing agreement, no new system of record.

Two things that are true anyway. Hosting choice does not remove authorization work, and an application handling
protected data needs its own authority to operate wherever it runs. And "the data never leaves the device" is no
privacy guarantee on a shared or library machine. It is also a records problem, because somebody with no server-side
copy has nothing to bring to a fair hearing, so export and print are part of the design rather than extras.

Progressive web apps fit this population and are underused. Offline, installable, no app store, no backend.

## The stack

TypeScript and React, built with Vite. Tailwind for styling, or a design system if the work needs one. IndexedDB
through Dexie for local storage in a progressive web app.

Files in the two to three hundred line range. Tests as the thing that tells you when to stop.

## When you outgrow the browser

Move when you need multi-user state, real identity, integration with a system of record, or protected data at rest.
Not before.

When you do, keep the domain logic free of vendor-specific code so the infrastructure stays replaceable. That is the
part that protects you, whoever you end up hosting with.

Prefer managed services over machines you have to run. My own default is AWS, serverless first, and the reason is
narrow: the AWS command line driven through an agent is the most productive infrastructure tooling I have used.
Buckets, roles, users, teardown scripts, whole deployments, one command at a time with each command read before it
runs. See the disclosure at the bottom of `README.md` before taking that as neutral advice.

Read each command before it runs rather than generating a large infrastructure module in one go. Generated
infrastructure code is where models are measurably worst, and a command you read is inspectable in a way a module is
not. Build the pipeline that checks the infrastructure first, then let the agent write into it.

Guardrails worth keeping: read-only credentials by default, explicit approval for anything that changes state, a
scoped role rather than an administrator profile, and never production credentials in an agent session.

## Working on the interface

`HOW-TO-WORK.md` covers the screenshot habit, which is the cheap version and the one to start with.

The better version is a browser automation tool connected to the agent, letting it navigate and review the pages
itself. It helps with accessibility work specifically. It needs setting up, so it is not part of these starter files.
Worth doing once the interface matters.

Treat accessibility as a requirement rather than a finish. Several benefit exclusion categories are disability-based,
which turns accessibility into legal exposure. Consensus guidance for Medicaid eligibility work names WCAG 2.2 AA, the ADA and
Section 508, and a non-digital path for people who will not use the thing you built.
