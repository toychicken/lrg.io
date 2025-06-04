---
title: Failing at web components
subtitle: What even is web component?
subheading: An LRG keeping his eye in project
description: What happened when I tried to learn a new thing
date: 2024-12-04T11:39:00
tags:
  - web-components
  - html
  - css
  - javascript
  - skills
application: <a href="https://obsidian.md" rel="nofollow">Obsidian.md</a>
draft: false
images:
  - /images/web-component-failure.svg
category: 
style: layout-vintage experiments
cover:
  alt: "Illustration of someone violently destroying a desktop computer with some kind of bat. It probably deserved it."
---
I think I should know about Web Components&trade; I have no idea how this is going to work, but I have used Vue & React components in the past. I personally feel like Web Components should be the way forward, but my lazy self has not spent any serious time trying to get to grips with them

but here's what I imagine a web component might look like. Absolute pseudo-code. I know nothing.

```html
<script>
	// some JS goes in here to make things work
</script>
<template>
	<!-- some HTML goes in here -->
</template>
<style>
	/* some scoped CSS go in here */
</style>
```

This is probably a reflection of how much time I've spent in Vue.js recently, but it's _conceptually_ what I'm imagining is required to build something as a Web Component.

<!--more-->

### Quick aside

So, I guess the first thing is 'what' to build. Something that doesn't require a dynamic backend (at the moment) as I can't be bothered to set something up. Perhaps something that can take 'properties' from the parent page, or from the url?

I'm going to try to replicate my [Quick Fox](/quick-fox) pangram tester as a web component. It's graphically pretty simple, but distinctive (so I'll know if I get weird style bleed-through) and can take values from the page queryString, to pre-populate form fields.

![Quick Fox pangram checker](quickfox.png)

It _should_ look something like this ☝

---
### Step one - what is a Web Component?

I shall start with my usual searches... MDN, CSS-tricks and Google

MDN, as ever has a pretty [comprehensive set of docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) but... perhaps a little overwhelming for a first step.

CSS-tricks.com has an [introduction from 2019](https://css-tricks.com/an-introduction-to-web-components/), which looks handy, but immediately looks like it's missing stuff that's extended the API in the last 5 years. Oh, but there's this likely looking article from 2024 that talks about [progressive enhancement with web components](https://css-tricks.com/html-web-components-make-progressive-enhancement-and-css-encapsulation-easier/) and that sounds like someone that is coming from the same place as me. Bonus points for linking to a [Jeremy Keith article](https://adactio.com/journal/20618) that actually gives me a  lot  of inspiration to continue this quest.

I suppose, given Adactio's advice, QuickFox is not an ideal candidate for Web Componentification, but it's only my first pass. So, let's go. I'm actually going to use Dave Rupert's ['html with superpowers'](https://daverupert.com/2021/10/html-with-superpowers/) article as a starting point, as it seems very easy to follow.

Let's see if I can embed his sample `<two-up>` component here...

Here's what it looks like in the body of this page:

```html
<two-up>
  <div><img src="/images/wrestlemania@600x600.jpg" alt="before"></div>
  <div><img src="/images/embiggening_the_nest@600x600.jpg" alt="after"></div>
</two-up>

<script src="/js/two-up.js"></script>
```

And here's how it shows up...

<two-up>
  <div><img src="/images/wrestlemania@600x600.jpg" alt="before"></div>
  <div><img src="/images/embiggening_the_nest@600x600.jpg" alt="after"></div>
</two-up>

<script src="/js/two-up.js"></script>

Well, okay, that's surprisingly easy, although quite some way from how I'd expected to incorporate it into my page... I think  I'd imagined a more 'React-y' way of doing things. Like importing a js module, e.g. `<script type="module" src="/js/two-up.js"></script>` and then putting the `<two-up />` element in, perhaps passing in some values.

OK, so first expectations  were wrong. I defer to Jeremy Keith

> "I have a suggestion for you if you find yourself in this position. Try not to bring React’s mindset with you."

Ahhh, got it.

So let's try my first pass at a web component... `<quick-fox/>`

Oh wait, I'm still thinking like a React dev, back in the 2010's... It should be:

```html
<quick-fox>
	<form id="quickfox" class="inline-app c64">
		<label for="qf-options" id="qf-options-label">26 characters to check</label>
		<input id="qf-options" type="text" value="abcdefghijklmnopqrstuvwxyz" spellcheck="false" />
		<label for="qf-output" id="qf-output-label">Remaining characters</label>
		<output id="qf-test-output" class="main-output failure"></output>
	<br/>
		<label for="qf-input">Enter string to check</label>
		<textarea id="qf-input" spellcheck="false">The quick grown fox, jumps over the lazy doe</textarea>
		<output id="qf-user-char-count" class="labelish"></output>
	</form>
	
	<p id="qf-sharelink">
	You can <a href="?charset=abcdefghijklmnopqrstuvwxyz&userstring=pack+my+box+with+five+dozen+liquor+jugs">share your shortest sentence</a>
	</p>
</quick-fox>


```

... but this is literally what I did with the actual quick-fox page - just HTML in the page. It's not portable, at least as I expect it. 

<quick-fox>
	<form id="quickfox" class="inline-app c64">
		<label for="qf-options" id="qf-options-label">26 characters to check</label>
		<input id="qf-options" type="text" value="abcdefghijklmnopqrstuvwxyz" spellcheck="false" />
		<label for="qf-output" id="qf-output-label">Remaining characters</label>
		<output id="qf-test-output" class="main-output failure"></output>
	<br/>
		<label for="qf-input">Enter string to check</label>
		<textarea id="qf-input" spellcheck="false">The quick grown fox, jumps over the lazy doe</textarea>
		<output id="qf-user-char-count" class="labelish"></output>
	</form>
	<p id="qf-sharelink">
	You can <a href="?charset=abcdefghijklmnopqrstuvwxyz&userstring=pack+my+box+with+five+dozen+liquor+jugs">share your shortest sentence</a>
	</p>
</quick-fox>

 Ohhh, it inherits style from the parent page... I think I'd  assumed it somehow wouldn't...

No  JS is executing though, because _that's_ inline on the original page.


----
### Step two - frustration

Dave Rupert's article drops the ball at "styling", so I'm heading back to CSS-tricks to see if I can learn what to do here... Feels like I should be able to encapsulate the style _somehow_ but is it really just like this?:

```css
quick-fox {
	/* styles go here */
}
```

In which case, again, I'm wondering how this is different from just writing the CSS and including inline, or in the `head` element as normal?

Let's try...

```html
<quick-fox id="n2-try">
	<form id="quickfox" class="inline-app wc-test">
		<label for="qf-options" id="qf-options-label">26 characters to check</label>
		<input id="qf-options" type="text" value="abcdefghijklmnopqrstuvwxyz" spellcheck="false" />
		<label for="qf-output" id="qf-output-label">Remaining characters</label>
		<output id="qf-test-output" class="main-output failure"></output>
	<br/>
		<label for="qf-input">Enter string to check</label>
		<textarea id="qf-input" spellcheck="false">The quick grown fox, jumps over the lazy doe</textarea>
		<output id="qf-user-char-count" class="labelish"></output>
	</form>
	<p id="qf-sharelink">
	You can <a href="?charset=abcdefghijklmnopqrstuvwxyz&userstring=pack+my+box+with+five+dozen+liquor+jugs">share your shortest sentence</a>
	</p>
	
	<style>
	quick-fox {
			font-family:monospace;
			display:block;
			width:auto;
			box-shadow:0 .2em 1em 0 #333;
		form.wc-test {
			background:pink;
	}
	</style>
</quick-fox>
```

<quick-fox id="n2-try">
	<form id="quickfox" class="inline-app wc-test">
		<label for="qf-options" id="qf-options-label">26 characters to check</label>
		<input id="qf-options" type="text" value="abcdefghijklmnopqrstuvwxyz" spellcheck="false" />
		<label for="qf-output" id="qf-output-label">Remaining characters</label>
		<output id="qf-test-output" class="main-output failure"></output>
	<br/>
		<label for="qf-input">Enter string to check</label>
		<textarea id="qf-input" spellcheck="false">The quick grown fox, jumps over the lazy doe</textarea>
		<output id="qf-user-char-count" class="labelish"></output>
	</form>
	<p id="qf-sharelink">
	You can <a href="?charset=abcdefghijklmnopqrstuvwxyz&userstring=pack+my+box+with+five+dozen+liquor+jugs">share your shortest sentence</a>
	</p>
	<style>
	quick-fox#n2-try {
			font-family:monospace;
				display:block;
				width:auto;
			box-shadow:0 .2em 1em 0 #333;
		form.wc-test {
			background:pink;
		}
	}
	</style>
</quick-fox>

OK - so no panicking about the dreaded "Shadow DOM"... but also no advantage _yet_ over doing this inline. It literally _is_ inline.  (Note to self, it looks like you have to explicitly give the outer element a display property and width to get it to render some styles)

Lol CSS-tricks led me back to Dave Rupert again - this time, it's [HTML with Superpowers](https://htmlwithsuperpowers.netlify.app/get-started/) this is what I needed. Not least because Dave actually makes some attempt to describe WHY you would want to use Web Components.

----
### Step three - realisation

I think I've jumped too soon. I'm guessing Quick Fox  isn't _really_ the ideal candidate for a web component. I'll read a bit of HTML with Superpowers, and get back to you...

\[Frantic reading ensues...]

Yep...

\[More reading]

... Ohhhhhhhhh...

\[banging head on desk]

OK - I'm still not 100% sure I see _how_ web components are going to revolutionise what I do, but it seems perhaps I have got a bit of direction for further exploration.

* **Focus on progressive enhancement**. The best use cases have a 'naked' html application. For instance Jake Archibald's `<two-up>` component will, at worst, show a pair of images if the web-componenty bits fail for some reason. This is way better than the 'This app fails if Javascript is turned off' option that most frameworks have as default.
* **Do things that make use of `<template>` and `<slot>` elements**, as this is how you 'mix' your component into the static parts of the page.
* **Don't try to be like \[FRAMEWORK]** - Web components are their own thing, with a specific use case. It doesn't feel (to me) that you'd use Web components to build a monolithic SPA, more like augmenting static sites like this with pockets of useful interactive bits, or swapping out parts of your existing SPA to use more web-friendly parts (until, like Trigger's broom, it's all just web-friendly).
* **Don't fear the shadow DOM**. It's just 'the bit that is entirely under the control of the component'. Sits side-by-side with the light DOM - which inherits stuff from the parent like normal HTML.

 Perhaps, rather than try to recreate an entire tiny applet inside a single component, pick a utility function that does something... like pulling in a bunch of replies from Mastodon, or making a progressively enhanced audio player...

On reflection,  I bet Hugo (or any other static site generator) is probably a great companion to Web components. Using the [Hugo shortcode syntax](https://gohugo.io/content-management/shortcodes/) to throw in the most basic info, to generate neat, web-friendly, progressively enhanced components. I might give it a try.

**But not today.**

----

### Postscript

If you have any thoughts on this, please do put them in a comment here -[https://mastodon.social/@toychicken/113601422843650747]()