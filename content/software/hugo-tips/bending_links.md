---
title: Bend links to your will
subtitle: Using render hooks to make links more flexible
subheading: Wiggle it, just a little bit
description: Using Hugo's Render hooks to make links appear how you want them to.
date: 2024-10-04T12:28:00
tags:
  - hugo
  - coding
application: <a href="https://obsidian.md" rel="nofollow">Obsidian.md</a>
draft: false
images:
  - /images/bender-as-pimp.jpg
category: hugo
style: layout-classic experiments
cover:
  alt: Bender in his pimp era, pointing aggressively.
---
This all began with a post on my socials... 

![CSS nerds, I need your help, please. I can style a link to an external site with the full URL path in text after it using a[href]=:not([href^=l'https://neilzone.co.uk'i]):after{content:'('attr(href)')';} I don't think that there is a CSS-only (i.e. no Javascript, no extra element/attribute in the html) way of limiting this to just the domain of the external link, rather than the full href link. Am I wrong?](/images/neil-brown-css-nerd-callout.png)

[https://mastodon.neilzone.co.uk/@neil/113244632967157645](https://mastodon.neilzone.co.uk/@neil/113244632967157645 "Original post")

The consensus certainly seemed to be that it's not possible to do this solely with CSS (which is a shame), but Neil did mention that they were investigating using Hugo to solve this.

My advice was to use Render Hooks, but I couldn't stop thinking about how  _I_ might do this, as it seemed like a neat way to present those long external links...

<!--more-->

## This is where I started 

You can jump straight to the [solution](#solution)  if you want. Otherwise, read on.

I spun up a standard Hugo quickstart project, and added some links to my site index page:

```markdown
Here is a variety of links to test Hugo and/or CSS to show just the domain for external links...

**Internal links**

* [Custom text](/i_love_cats)
* [Custom text, with title](/i_love_cats "I love cats")
* [Custom text, absolute path](http://localhost:1313/i_love_cats)

**External links**

* Top-level domain, auto-generated text https://cats.org
* Deep link, auto-generated text https://www.cats.org.uk/help-and-advice/lost-found-and-feral-cats/lost-found-and-feral-cats
* [Custom text, Top-level domain](https://cats.org)
* [Custom text, Top-level domain, with title ](https://cats.org "I love rescue cats")
* [Custom text, deep link](https://www.cats.org.uk/help-and-advice/lost-found-and-feral-cats/lost-found-and-feral-cats)
* [Custom text, deep link, with title](https://www.cats.org.uk/help-and-advice/lost-found-and-feral-cats/lost-found-and-feral-cats "Lost & found cats")
```

I wanted to account for all the ways you can present links in markdown, in Hugo. It looks something like this:

![Example render of all the links rendered with no manipulation](/images/hugo-bending-links-starting-point.png "Unchanged render")
I think it's those pesky auto-generated deeplinks that Neil wants to make a little prettier.

The rendered link looks like:

```go-html-template
<a href="https://www.cats.org.uk/help-and-advice/lost-found-and-feral-cats/lost-found-and-feral-cats">
	https://www.cats.org.uk/help-and-advice/lost-found-and-feral-cats/lost-found-and-feral-cats
	</a>
```

Which doesn't give you much to hook into with CSS.

This is where Hugo's render hooks come in. For a certain selection of commonly used html elements, Hugo gives you the chance to override the default rendering, and define how you want it to render yourself using the Hugo template system. Hugo provides you with 3 variables for a link.

```markdown
[Post 1](/posts/post-1 "My first post")
 ------  -------------  ------------- 
  text    destination      title
```

My first step was to add a `data-domain` attribute to see if I could use it to replace the content. I created a `render-link.html` file in 

```
layouts/
	_default/
		_markup/
			render-link.html
```

This now overrides the default markdown rendering for links. I started with:

```go-html-template
{{ $u := urls.Parse .Destination }}

<a href="{{ .Destination | safeURL }}" 
data-domain="{{ $u.Hostname }}">{{ .Text | safeHTML }}
</a>
```

It uses Hugo's [urls.Parse](https://gohugo.io/functions/urls/parse/) function to take the destination and convert to an object of the various parts of a url. In our case, we just need the `Hostname` . I added it to the `data-domain` attribute, and our deep link now looks like

```go-html-template
<a href="https://www.cats.org.uk/help-and-advice/lost-found-and-feral-cats/lost-found-and-feral-cats" data-domain="www.cats.org.uk">https://www.cats.org.uk/help-and-advice/lost-found-and-feral-cats/lost-found-and-feral-cats</a>
```

Then I added a bit to the CSS for links, to show the data-domain attribute as extended content for the link, like this:

```css
a[data-domain]::after {
	content: ' - ' attr(data-domain);
}
```

But, this was a bit messy, as the `data-domain` was missing for relative links, and rendered some odd dashes at the end of lines. Also, where the markdown had infered the link test from the url, it looked even messier. I couldn't find a neat way to reliably style out the _actual_ link text leaving only the shorter hostname.

![Sample render of links only showing the top level domain](/images/hugo-bending-links-data-domain-approach.png "data-domain approach")

Given I had the `urls.Parse` method, I now realised I could do something a little more fancy-schmancy, and build up some additional elements, easily styled by CSS. Something like this:

```go-html-template
{{ $u := urls.Parse .Destination }}
<a href="{{ .Destination | safeURL }}"
data-domain="{{ $u.Hostname }}">
	<span class="link-text">{{ .Text | safeHTML }}</span>
	<span class="hostname-text">{{ $u.Hostname }}</span>
</a>
```


Which didn't really change the output, but now I had some CSS selectors to work with.

I created this monstrosity (you would swap out `localhost` for your site's domain)

```css
a[href]:not([href*="://localhost"]) .link-text {
	display: none;
}
```

Thinking this would pretty much do the trick, but... it fails on relative links,  because they too don't match the `://localhost` domain. Looks like:

![Sample render, links with relative paths don't show up at all](/images/hugo-bending-links-weird-selector-hell.png)

Oops 😦

I needed to provide a few more class names for the CSS to be able to hook into.

First up - is this a relative link? For this I need to check if the hostname is empty.

```go-html-template
{{ if not (strings.ContainsNonSpace $u.Hostname )}}
```

Basically this checks if the hostname is empty using the [strings.ContainsNonSpace](https://gohugo.io/functions/strings/containsnonspace/) functionality.

So I added a `$class` variable to store some output, and our template looks like this:

```go-html-template
{{ $u := urls.Parse .Destination }}
{{ $class := "" }}

{{ if not (strings.ContainsNonSpace $u.Hostname)}}
	{{ $class = "relative" }}
{{ end }}

<a href="{{ .Destination | safeURL }}" 
class="{{ $class }}"
data-domain="{{ $u.Hostname }}">
    <span class="link-text">{{ .Text | safeHTML }}</span>
    <span class="hostname-text">{{ $u.Hostname }}</span>
</a>
```

the monster css selector looks like:

```css
a[href]:not([href*="://localhost"]):not(.relative) .link-text {
	display: none;
}
```

And this renders like this:

![Sample render, most things are working but the explicit text doesn't show up on the last four links.](/images/hugo-bending-links-relatively-solved.png)

Which is looking _loads_ better, but has nixed the explicit text on the last four of those links 😢 _and_  is still showing the domain for the absolute link too.

I tried a few variations with the CSS, but this is the best it got. 

I needed to make sure I could also explicitly detect an external link AND / OR one with explicit text.

For this, I needed some more template magic.

```go-html-template
{{ $u := urls.Parse .Destination }}
{{ $yourDomain := "localhost" }}
{{ $class := "" }}

{{ if not (strings.ContainsNonSpace $u.Hostname)}}
	{{ $class = "relative" }}
{{ else }}
	{{ if not (compare.Eq $u.Hostname $yourDomain) }}
		{{ $class = "external" }}
		{{ if (compare.Eq $u.String .Text) }}
		    {{ $class = "external implied"}}
		{{ end }}
	{{ end }}
{{ end }}

<a href="{{ .Destination | safeURL }}" 
class="{{ $class }}" 
data-domain="{{ $u.Hostname }}">
	<span class="link-text">{{ .Text | safeHTML }}</span>
	<span class="hostname-text">{{ $u.Hostname }}</span>
</a>
```

Now we have a way, by comparing the `$u.Hostname` to a `$yourDomain` variable, to see if it explicitly external

```go-html-template
{{ if not (compare.Eq $u.Hostname $yourDomain) }}
```

AND we subsequently check to see if the url is the same as the `.Text`

```go-html-template
{{ if (compare.Eq $u.String .Text) }}
```

And change the class appropriately. Now we're getting closer! Our rendered deeplink looks like this:

```go-html-template
<a href="https://www.cats.org.uk/help-and-advice/lost-found-and-feral-cats/lost-found-and-feral-cats" 
   class="external implied" 
   data-domain="www.cats.org.uk">
	<span class="link-text">https://www.cats.org.uk/help-and-advice/lost-found-and-feral-cats/lost-found-and-feral-cats</span>
	<span class="hostname-text">www.cats.org.uk</span>
</a>
```

We can update our CSS now, to be a little more readable:

```css
a.relative {
  .hostname-text {
    display: none;
  }
}

a.external:not(.implied) {
  .hostname-text { display:none }
}

a.external.implied {
  .link-text { display: none; }
}
```

And this renders like this. Pretty much nails it... 

![Sample render, looks like it's working as expected](/images/hugo-bending-link-almost-nailed-it.png)

## Bingo!

Grr, then I noticed the absolute link is not accounted for. A simple default on the `$class` variable, and an additional definition in the CSS, and it's fixed.

```go-html-template
{{ $u := urls.Parse .Destination }}
{{ $yourDomain := "localhost" }}
{{ $class := "internal" }}

{{ if not (strings.ContainsNonSpace $u.Hostname)}}
	{{ $class = "relative" }}
{{ else }}
	{{ if not (compare.Eq $u.Hostname $yourDomain) }}
		{{ $class = "external" }}
		{{ if (compare.Eq $u.String .Text) }}
		    {{ $class = "external implied"}}
		{{ end }}
	{{ end }}
{{ end }}

<a href="{{ .Destination | safeURL }}" 
class="{{ $class }}" 
data-domain="{{ $u.Hostname }}">
	<span class="link-text">{{ .Text | safeHTML }}</span>
	<span class="hostname-text">{{ $u.Hostname }}</span>
</a>
```

And the CSS...

```css
a.internal,
a.relative {
  .hostname-text {
    display: none;
  }
}

a.external:not(.implied) {
  .hostname-text { display:none }
}

a.external.implied {
  .link-text { display: none; }
}
```

...and bingo.

![Sample render, working nicely](/images/hugo-bending-links-bingo.png)

## Over-engineering

Yep, that's it. I think this meets the needs of what we wanted in the first place. Namely that it only shows the top-level domain for those implied-text, deeplink urls, and everything else looks as expected...

But there's a little more...

Don't forget, Hugo allows us to pass in a 'title' into our markdown, like this:

```markdown
[Custom text, deep link, with title](https://www.cats.org.uk/help-and-advice/lost-found-and-feral-cats/lost-found-and-feral-cats "Lost & found cats")
```

But that title attribute is _not_ currently rendered by our customer render hook. Let's fix that:

```go-html-template
{{ $u := urls.Parse .Destination }}
{{ $yourDomain := "localhost" }}
{{ $class := "internal" }}

{{ if not (strings.ContainsNonSpace $u.Hostname)}}
	{{ $class = "relative" }}
{{ else }}
	{{ if not (compare.Eq $u.Hostname $yourDomain) }}
		{{ $class = "external" }}
		{{ if (compare.Eq $u.String .Text) }}
		    {{ $class = "external implied"}}
		{{ end }}
	{{ end }}
{{ end }}

<a href="{{ .Destination | safeURL }}" 
{{ with .Title}}title="{{ . }}"{{ end }} 
class="{{ $class }}" 
data-domain="{{ $u.Hostname }}">
	<span class="link-text">{{ .Text | safeHTML }}</span>
	<span class="hostname-text">{{ $u.Hostname }}</span>
</a>
```

We've simply tested to see if the `.Title` variable exists, and if it does, add the title attribute. Our link now renders like:

```go-html-template
<a href="https://www.cats.org.uk/help-and-advice/lost-found-and-feral-cats/lost-found-and-feral-cats" 
   title="Lost &amp; found cats" 
   class="external" 
   data-domain="www.cats.org.uk">
	<span class="link-text">Custom text, deep link, with title</span>
	<span class="hostname-text">www.cats.org.uk</span>
</a>
```

Not a big deal, but what's nice is that you can use the existence of the title attribute to give some of those deeplinks a bit more context, without showing the whole URL. We add this to the end of our CSS:

```css
a[title]::after {
  content: '(' attr(title) ')';
}
```

and we _get_ titles. Which you can style if you want. It also gives you the title on when the mouse hovers over the link. 

![Sample render, with a little extra work, it now shows a title with the native on-hover](/images/hugo-bending-links-adding-titles.png) 

## One more thing

Last of all, I want my external links to always open in a new tab, so we can add a `target` attribute to our link. And that is the solution!
## Solution

`/layouts/_default/_markup/render-link.html`
```go-html-template
{{ $u := urls.Parse .Destination }}
{{ $yourDomain := "localhost" }}
{{ $class := "internal" }}
{{ $target := "" }}

{{ if not (strings.ContainsNonSpace $u.Hostname)}}
	{{ $class = "relative" }}
{{ else }}
	{{ if not (compare.Eq $u.Hostname $yourDomain) }}
		{{ $class = "external" }}
		{{ $target = "_blank" }}
		{{ if (compare.Eq $u.String .Text) }}
		    {{ $class = "external implied"}}
		{{ end }}
	{{ end }}
{{ end }}

<a href="{{ .Destination | safeURL }}" 
{{ with .Title}}title="{{ . }}"{{ end }} 
target="{{ $target }}"
class="{{ $class }}" 
data-domain="{{ $u.Hostname }}"><span class="link-text">{{ .Text | safeHTML }}</span> <span class="hostname-text">{{ $u.Hostname }}</span></a>
```

And the final CSS...

```css

a.internal,
a.relative {
  .hostname-text {
    display: none;
  }
}

a.external:not(.implied) {
  .hostname-text { display:none }
}

a.external.implied {
  .link-text { display: none; }
}

a[title]::after {
  content: '(' attr(title) ')';
}
```

Obviously, this is a little over-engineered, but it gives you a lot of flexibility to display links however you like.

Enjoy!

If you found this useful, or have feedback please drop me a line [@toychicken](https://mastodon.social/@toychicken/113249975233953921)

Finally, if you too love cats, make a donation to the [Cats protection league](https://www.cats.org.uk/donate) today. 🐈‍⬛