---
layout: page
title: "GPG keys and signatures"
date: 2013-03-25 08:13
footer: true
---

I generate GPG keys that have an expiry date. Hence, new keys are signed using
old keys and and old keys are signed using new keys to ensure trust is kept
continuous. Keys are named `passcodNN`, where `NN` is the number of the key.
Keys `00` to `02` were lost in a previous disk disaster.  
Here are all keys, signatures, and fingerprints:

- __passcod03__:
  
  [Key][k03]: [signed by 04][ks04].  
  [Revocation][r03]: [signed by 04][rs04].
  
      pub   4096R/C2C15214 2012-09-26 [expired: 2013-03-25]
            Key fingerprint = FE31 5C83 9FC5 0618 A49B  AEE3 8487 3386 C2C1 5214
      uid                  Felix Saparelli (:passcod) <me@passcod.net>

- __passcod04__: (current)
  
  [Key][k04]: [signed by 03][ks03].  
  
      pub   4096R/3C51B6EB 2013-03-27 [expires: 2014-03-27]
            Key fingerprint = 0417 E9C8 3281 CB17 E7CB  B0EA AE48 6FBE 3C51 B6EB
      uid                  Felix Saparelli (:passcod) <me@passcod.name>


[k03]: /gpg/passcod03.asc
[k04]: /gpg/passcod04.asc

[ks04]: /gpg/passcod03.asc.sig
[ks03]: /gpg/passcod04.asc.sig

[r03]: /gpg/passcod03.revok

[rs04]: /gpg/passcod03.revok.sig
