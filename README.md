## Using a GPG key to auth on Indieweb

* https://indieauth.com/pgp

Handy tips on :

* https://www.digitalocean.com/community/tutorials/how-to-use-gpg-to-encrypt-and-sign-messages
* https://help.github.com/en/articles/generating-a-new-gpg-key
* https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/4/html/Step_by_Step_Guide/s1-gnupg-export.html

In order to generate the key.pub

`gpg --full-generate-key`

Copy the key out to the key.pub file

`gpg --armor --export ID_OF_KEY_JUST_GENERATED > ./static/assets/key.pub`

(Now deploy with `hugo; firebase deploy`

Make a copy of the private key, for signing. Don't put it in the git repo!

`gpg --export-secret-keys ID_OF_KEY_JUST_GENERATED > my-private-key.asc`


## Deploying

You're running this in Firebase, so you'll need the firebase cli

`npm install -g firebase-tools`

and login with the LRG.io account.

