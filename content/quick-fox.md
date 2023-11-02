---
title: Quick Fox
subtitle: The lazy dog catcheth the early worm or something.
description: "For when you just absotively posolutely need to check what letters you've used in a sentence"
date: 2023-10-20
images: 
    - "/images/quickfox.png"
tags:
 - app
 - wordplay
 - language
 - heuristics
---
Ever wondered "What is the shortest sentence in english that uses all the letters of the alphabet"? Perhaps. 

Did you know that "[A Quick brown fox jumps over the lazy dog](?userstring=A+Quick+brown+fox+jumps+over+the+lazy+dog#quickfox)", although often cited, is _not_ [the shortest](?charset=abcdefghijklmnopqrstuvwxyz&userstring=Cwm%20fjord%20bank%20glyphs%20vext%20quiz#quickfox)? 

Could you train an AI to find a shorter sentence? Would anyone care? Pangram adventurers, start here!

I wrote a quick way to check what characters you've used in a sentence or other kind of string. It does seem to work with most european languages, but doesn't appear to like emoji. _Sorry_. 


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
        <p id="qf-sharelink">You can <a href="?charset=abcdefghijklmnopqrstuvwxyz&userstring=pack+my+box+with+five+dozen+liquor+jugs">share your shortest sentence</a></p>
        {{< script >}}
        <script>
            console.log("Hello, is it me you're looking for?");
const characterSource = document.querySelector('#qf-options');
const outp = document.querySelector('#qf-test-output');
const srcLabel = document.querySelector('#qf-options-label');
const outpLabel = document.querySelector('#qf-output-label');
const userInput = document.querySelector('#qf-input');
const charCount = document.querySelector('#qf-user-char-count');
const shareLink = document.querySelector('#qf-sharelink a');
//
const urlParams = new URLSearchParams(window.location.search);
const charset = urlParams.get('charset');
const userstring = urlParams.get('userstring');
if(!!charset) {
    characterSource.value = charset;
}
if(!!userstring) {
    userInput.value = userstring;
}
let letters = characterSource.value;
const countChars = () => {
    let counter = userInput.value.length;
    charCount.innerHTML = `${counter} character${counter === 1 ? '' : 's'} in string`;
}
const updateShareLink = () => {
    let link = `?charset=${encodeURIComponent(letters)}&userstring=${encodeURIComponent(userInput.value)}#quickfox`;
    shareLink.setAttribute('href', link);
}
const performCheck = (str) => {
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
        outp.className = "main-output success";
    } else {
        outp.className = "main-output failure";
    }
    outpLabel.innerHTML = `${remaining.length} character${remaining.length === 1 ? '' : 's'} not found in string`;
    outp.innerHTML = remaining.join('');
    updateShareLink();
}
characterSource.addEventListener("keyup", (e) => {
    letters = e.target.value;
    srcLabel.innerHTML = `${letters.length} character${letters.length === 1 ? '' : 's'} to check`;
    performCheck(userInput.value);
})
userInput.addEventListener("keyup", (e) => {
    performCheck(e.target.value);
    countChars();
});
performCheck(userInput.value);
countChars();

        </script>
{{< /script >}}

Originally bashed together because of an [odd thread on Mastodon](https://mathstodon.xyz/@TeaKayB/111264213075996921). Now, however, presented in the form of a page on this very site.

The Quick Fox is [completely free for you to use](https://creativecommons.org/publicdomain/zero/1.0/) - any way you like. It is certainly improvable :smile: