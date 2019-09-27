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



ID = 77FCA78126C6AF92



echo 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZSI6Imh0dHBzOi8vbHJnLmlvLyIsInByb2ZpbGUiOiJodHRwczovL2xyZy5pby9hc3NldHMva2V5LnB1YiIsInJlZGlyZWN0X3VyaSI6Imh0dHBzOi8vaW5kaWVsb2dpbi5jb20vcmVkaXJlY3QvaW5kaWVhdXRoIiwic3RhdGUiOiI2OThiNDI2ODE5Y2M2MTEyMzFhNjI1MzkiLCJzY29wZSI6IiIsIm5vbmNlIjozMTI4MjQsImNyZWF0ZWRfYXQiOjE1Njg4NzY2NzJ9.IRI-rCvcgfIDCs-ang5qKypYscAPV50IWPYwTTpew0g' | gpg --sign --armor -r leigh@toychicken.co.uk