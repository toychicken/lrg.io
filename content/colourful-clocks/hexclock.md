---
title: HexClock 2.0
subtitle: A colour-change clock
subheading: An LRG waste timing project
description: Inspired by colourclock, sadly now defunct
date: 2024-11-11T12:22:00
tags:
  - clocks
  - time
  - css
  - gradients
application: <a href="https://obsidian.md" rel="nofollow">Obsidian.md</a>
draft: false
images:
  - /images/hexclock-02.jpg
category: 
style: layout-classic experiments
---

Another clock experiment, this time a direct successor to my original Hexclock from 10+ years ago. I wanted to update it a little, to use multiple gradients and improve the way that they were calculated. As with the [TV ident clock](/colourful-clocks/tv-ident-clock-01) I'm not using any libraries, frameworks or stuff like that, with the aim of keeping my JS & CSS skills up to scratch.

<!--more-->

<iframe src="/clocks/hexclock/" width="100%
" height="400px"></iframe>

[Full screen here](/clocks/hexclock)

In my original, I'd done a fairly crude calculation converting HH:MM:SS to pairs of hex values, then used CSS transitions to smooth out the bumps. The problem was that when the value ticked over, you got an ugly jump from one colour range to another.

This time, I decided that we'd actually do the colour transition using HSL. In case you're unfamiliar, HSL colour values are based on Hue, Saturation, and Lightness. The first is measured as a continuous 360º range from red, through yellow, green, cyan, blue, magenta and back to red. There's an [exhaustive article on Wikipedia](https://en.wikipedia.org/wiki/HSL_and_HSV)

{{< shape "/images/hexclock-02_0000.png" "left" "Clock at midnight shows minimum saturation, but maximum lightness" >}}

I decided to reflect the 360º of the hue with the seconds of the current time. This means it's 'reddish' at the top of the minute, 'greenish' at :20s, 'blueish' at :40s and back to red at :00 - but the actual output colour depends on the other two values.

Saturation and Lightness both work on a percentage scale (0-100%). Saturation is represented by the minute in the hour, and lightness by the hour in the day. So, maximum saturation is at the top of the hour e.g. 16:00 , and maximum lightness is at 12:00 and 00:00.

{{< /shape >}}

To create the banded effect, I had another colour value with the same hue, but flipped saturation and lightness. I also use this flipped value for the shadow on the text. I put stops on a gradient at 0%, 50% and 100%.

These two colours (A & B) are converted to their CSS hex values and put on screen.

Last of all, I needed to _move_ the bands so created an array of stops for the gradient, from color a, to b and back again. This means I actually need 4 stops, to account for the 'off-screen' stop. Each stop moves outward by 50 points per minute.

In order to make it look continuous, for the first 30 seconds, the colour order is `[a,b,a,b]`

Then, just as it's about to go out of range, I flip the order of the stops in the gradient to `[b,a,b,a]`

It's not strictly following the stops that are off-screen, as the gradient algorithm seems to treat out of band numbers with a ceiling of 100 or floor of 0. But it does give a pleasing pulsing effect, so I'm happy 😙

I hope you like it!

---

