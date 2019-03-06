---
title: "Spikes, POCs, Prototypes and the MVP"
date: 2014-09-30T14:24:13Z
description: "Here I attempt to provide some clarity around what I consider the differences between Spikes, POCs, Prototypes and the MVP. Mainly so I never have to hear the phrase “Let’s just knock up a quick MVP to see if the client likes it” again…"
draft: false
author: "Leigh Garland"
mainImage:
  src: "/images/pocs.jpg"
  title: ""
##### Note - The title in the Front matter above is replayed at the top of the rendered article
---

Here I attempt to provide some clarity around what I consider the differences between Spikes, POCs, Prototypes and the MVP. Mainly so I never have to hear the phrase “Let’s just knock up a quick MVP to see if the client likes it” again…

## Spikes

A spike is a reconnaissance mission. The objective is to take something that you know almost nothing about (like using a new technology or language) and getting enough information about that thing to make planning more predictable. For instance :

> Sushma and Karen have been asked to plan a project that requires them to integrate with a third party library for sending messages to users’ phones. Neither of them has done this before so, they agree to do a spike to establish how complex they think related tasks will be.

A spike must:

* Have a clearly defined objective e.g. “Investigate complexity of integrating our system with X library”
* Be timeboxed e.g. “Two days”
* Be focussed on establishing complexity of a future task, not actually doing the work

It’s often tempting to go for ‘big’ spikes and actually do some of the work. However, the result is usually that part of the puzzle may get ‘done’ but that others are left uninvestigated.

Some of the answers you should be looking for from a spike are:

* Is there any documentation? Is it up to date? Is it readable?
* What are the relevant licensing issues?
* Does integration require inclusion of any new technology?
* How do you get support? Do you have to pay for it? How responsive are they?
* Does the development team understand the core concepts?
* Does the UX team understand any potential limitations?
* Do stakeholders understand any business restrictions?
* Is it tried and tested? Have others done it before?

Don’t forget, the objective is not to _do_ work, but find out _how much_ work might be required.

## Proof-of-concept (POC)

A Proof-of-concept (POC) is another activity to gain greater understanding, prior to planning. However, whereas a spike is about understanding the complexity of something you have to do, a POC is about evaluating whether an idea is worth pursuing. For instance :

> Taryn and Chris have an idea to use an unconventional navigation system in the product. They believe it will save space on the page, and leave more room for other key functions. They are asked to do a POC to prove it. They’re given 2 days, and they produce some very basic paper prototypes to show to the team

A POC should :

* Have key objective about what it’s trying to prove e.g. “This will give the user more space for key functions without breaking the navigation”
* Be timeboxed. It’s easy to just keep going and going and going…
* Be small — what’s the least amount of work required to get the job done?

There’s a hint in the name here. The objective is to prove that your concept can work. Don’t undersell your POC though. If it needs high-fidelity production to prove it’s worth, go for it!

## Prototype

A prototype is not an activity, it’s a thing with quite a wide variety of shapes and sizes. It can range from a simple paper prototype for a POC, a design slideshow for clients or a fully interactive prototype for user testing.

* You should not expect your prototype to provide you with production-ready code / engineering.
* You should not expect your prototype to be tested, or work on devices it’s not designed for.
* You should not expect all the parts of your prototype to work, if it’s not being discussed.

Don’t fall into the trap of building your product by iterating on a single prototype. It can be done this way, but is often plagued by the ghosts of shortcut code that was never intended to go into production.

## Minimum Viable Product (MVP)

I was slightly horrified recently, to overhear someone saying “We’ll just knock out a quick MVP to see what the client thinks” — talking as if an MVP is a POC. Fundamentally, Spikes, POCs and Prototypes are all about overcoming technical and design challenges, but (in the words of Eric Ries)

> Unlike a prototype or concept test, an MVP is designed not just to answer product design or technical questions. Its goal is to test fundamental business hypotheses.

For me, the others are tools to build your product, whereas an MVP _is_ your product.

---

This article originally appeared on [Medium](https://medium.com/studio-zero/spikes-pocs-prototypes-and-the-mvp-5cdffa1b7367)