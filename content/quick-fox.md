---
title: Quick Fox
subtitle: The lazy dog catcheth the early worm or something.
description: "For when you just absotively posolutely need to check what letters you've used in a sentence"
date: 2023-10-20
tags:
 - app
 - wordplay
---

A quick way to check what characters you've used in a sentence or other kind of string. Originally bashed together because of a [dumb thread on Mastodon](https://mathstodon.xyz/@TeaKayB/111264213075996921).


<form id="quickfox" class="inline-app c64">
            <label for="qf-options" id="qf-options-label">26 characters to check</label>
            <input id="qf-options" type="text" value="abcdefghijklmnopqrstuvwxyz" spellcheck="false" />
            <label for="qf-output" id="qf-output-label">Remaining characters</label>
            <output class="failure"></output>
            <br/>
            <label for="qf-input">Enter string to check</label>
            <textarea id="qf-input" spellcheck="false">The quick grown fox, jumps over the lazy doe</textarea>
        </form>
        {{< script >}}
        <script>
console.log("Hello, is it me you're looking for?");
const characterSource = document.querySelector('#quickfox input');
let letters = characterSource.value;
const outp = document.querySelector('#quickfox output');
const srcLabel = document.querySelector('#quickfox #qf-options-label');
const outpLabel = document.querySelector('#quickfox #qf-output-label');
const userInput = document.querySelector('#quickfox textarea');
let performCheck = (str) => {
    let required = letters.split('');
    let remaining = [];
    // loop over chars
    // if char is in input, remove it
    required.forEach(v => {
        // lower case it!
        let phrase = str.toLowerCase();
        if (phrase.indexOf(v) < 0) {
            remaining.push(v);
        }
    })
    if (remaining.length <= 0) {
        outp.className = "success";
    } else {
        outp.className = "failure";
    }
    outpLabel.innerHTML = `${remaining.length} character${remaining.length === 1 ? '' : 's'} not found in string`;
    outp.innerHTML = remaining.join('');
}
characterSource.addEventListener("keyup", (e) => {
    letters = e.target.value;
    srcLabel.innerHTML = `${letters.length} character${letters.length === 1 ? '' : 's'} to check`;
    performCheck(userInput.value);
})
userInput.addEventListener("keyup", (e) => {
    performCheck(e.target.value);
});
performCheck(userInput.value);

        </script>
{{< /script >}}

If you like this, you should try out some of my other dumb JS tools...

This one is [completely free for you to use](https://creativecommons.org/publicdomain/zero/1.0/) - any way you like. It is certainly improvable :smile: