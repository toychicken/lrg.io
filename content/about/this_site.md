---
title: "This site"
date: 2019-03-08T11:00:11Z
description: "How did I build it? Why did I build it? Who is it for? Why should I read this?"
draft: false
author: "Leigh Garland"
mainImage:
  src: ""
  title: ""
##### Note - The title in the Front matter above is replayed at the top of the rendered article
---

## Why?

I have started many personal blogs over the years, and almost none of them have materialised into anything very useful. Or even beyond the first excitable 'Hello world' post.

However, in the past few years, I've written a few short Medium posts and they've got a little traction. I'm also having a bit of a mid-career pivot from a 'pure' web-developer / manager caterpillar into a product management / business transformation butterfly, and thought it might be useful (if only to me) to capture some of this process.

## How?

Woohoo - I get to geek out a little here...

I'm old-school. :floppy_disk:  I learned HTML back in 97, then some Perl CGI, PHP, and later CSS, JS and am now dabbling in the worlds of Python, Go and who knows what else.

That said, as a professional web developer (as I have been since 1999) I've recently spent a _lot_ of time with some of the bigger web 'frameworks'. They're great, and make perfect sense if you're working in a team on bigger things that what is essentially a personal blog.

So, partly as an exercise in flexing some old HTML muscle-memory, I thought I'd dive into the world of static site generators for this project.

I write _everything_ in markdown. I love the flexibility and immediacy of being able to keep my hands on the keyboard. So, requirement one was that whichever static site generator _had_ to accept markdown as a first-class authoring approach.

I'm pretty happy writing CSS, but have got quite used to some of the luxuries of using SASS. Requirement two was that it should enable me to use SASS.

At this point, I didn't really have many more requirements. However, I did foolishly start trying to write my _own_ static site generator in Node.js. It worked, but ooooooh boy was it slow to render the site. So, requirement three was that it should have a _fast_ development environment (and preferably have some bells and whistles like it's own server, hot reload etc. etc.)

I tried a few, like Octopress, Jekyll and I even tried running Ghost locally to create a CMS to generate static files :grimacing: - I ran into limitations quite quickly - and nearly each time there was something intractable, there was nearly always someone saying "I switched to Hugo..."

So I tried Hugo.

I'll be honest. The first time I tried it, it was a bit of a steep learning curve. I've done a few enterprise CMS integrations in my time, and a lot of the language was horrifyingly similar to those kind of systems (nobody say 'Vignette'). It was pretty off-putting. I was expecting "Hey, just put your markdown here, and images here, and it'll all be magic". Not the case.

As it happened, around this time, I needed to setup a small static site for a project with work. I 'chose' Hugo for this, because I _knew_ it was capable of doing what they needed, and honestly I knew it'd be the impetus for me to get to know it a bit better.

I dived in, and boy is the water lovely. I'm now a complete Hugo convert. It has everything I need. Markdown and SASS sitting in a tree, K.I.S.S.I.N.G - it has image processing (nice) and partial templates. It has shortcodes for inserting common embeds like YouTube and Spotify playlists. It even has category and tagging capabilities.

There are still a few things about Hugo that could use a little more consideration. The documentation is comprehensive, but a bit light on examples (unless you want to sit through the videos). Working with responsive images feels like hard work compared to the slickness elsewhere. Lastly, I'll be honest, I don't really understand the purpose of the leaf bundle stuff. However, I have a feeling as this site grows, it may become apparent.

Did I mention that it's _really_ fast? It renders the entire site (as I write this) in _34 ms_ and it serves it, and has hot reload! :fire:

 Finally, although I don't use it for _this_ site, I also found [Forestry CMS](https://forestry.io/) is a really good counterpart (and their support articles helped me get to grips with some of Hugo's gnarlier bits).

## What

Overall, I'm keen to keep the look of the site quite lightweight. Use of typography rather than graphic elements, as it's primarily a reading experience (for the moment). That said, I'm still a developer at heart, so there may be some little tweaks and silly code bits lying around for you to trip over. It's a personal site, so it's probably not going to get cleaned up. Sorry :wink:

I want to make sure that it's as accessible as I can make it, and use a few different tools.

I'm currently hosting on good old-fashioned managed box (thanks [PipeTen](http://pipeten.com) but for a few reasons, I'm probably going to move hosting over to


### Useful stuff

* [Making a CSS post-it note](https://mentormate.com/blog/css-postit-note/)
