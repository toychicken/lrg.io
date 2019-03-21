---
title: "Guided evolution"
date: 2019-03-20T07:16:59Z
description: ""
draft: true
author: "Leigh Garland"
mainImage:
  src: "/images/profile.gif"
  title: "Innovation Hub Tech Principles"
images:
- "/assets/profile@600x600.gif"
##### Note - The title in the Front matter above is replayed at the top of the rendered article
---

One problem for innovation departments is that of 'mixing' with corporate IT. For _very_ good reasons, most IT departments are risk-averse where it comes to security, stability and spending.

However, in the innovation hub it's a slightly different story. Security should still be paramount, but in the world of early-stage propositions, there are advantages in spending (you can do a lot with 'Free' tier software) and stability (set expectations with customers early).

The flip side to this is that we then have an expectation that the propositions will need to merge into the main business at the point their value has been proven.

With this in mind, working for a big UK retailer, I have recently come up with some "principles for guided evolution" aimed squarely at innovation hubs. The purpose is to help tech folks manage the tension between being lean and agile AND getting ready for transition back into the business. [foot](#footnotes)

## The laboratory

It's important that we remember what the function of most innovation hubs is. Typically, it can be summed up like this:

> "A laboratory for generating validated learning. A place to identify and develop new opportunities and capabilities for the main business."

With this in mind, our principles must balance the needs of the lab, with the needs of the business.

Ideally, the main business wants the lab to use existing contracted products. Salesforce, Oracle, Omniture and many more. In practice, many of those services are limited to specific domains, require teams of people with specialist product skills, have inter-dependent needs and most of all, cost a _lot_ of money.

A start-up however, can achieve a lot with a free-tier Cloud server, Mailchimp and Google analytics.

So how do we reconcile the cautious parent with fast-moving child?

## Principle 1 : "Think big, do small"

I use what I call the big-brother approach. When we add a new service to a proposition, I imagine what it's 'big-brother' analog would be in the main business. A good example is Mailchimp.

For our innovation hub, Mailchimp is a godsend. It's powerful enough to be a very competent Marketing CRM for our propositions. However, for the main business, it's probably a little unmanageable, and may lack some of the 'enterprise' functionality it requires. So the main business uses Salesforce.[*](#mailchimp)

In implementing Mailchimp for a proposition, I ask our teams to make an integration layer, preferably something that can be reused, to abstract the commands to the Mailchimp API.

### Footnotes

<a name="mailchimp" /> - Obviously, I know that Salesforce and Mailchimp are _not_ necessarily a direct comparison, and that many large businesses use Mailchimp with great success.
