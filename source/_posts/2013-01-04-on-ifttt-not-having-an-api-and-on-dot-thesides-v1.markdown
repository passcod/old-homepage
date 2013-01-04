---
layout: post
title: "On IFTTT not having an HTTP ‘this’ nor ‘that’"
date: 2013-01-04 18:20
comments: true
categories:
  - software
  - go
  - onthesides
---

So, [IFTTT] is cool. It's a nitfy little service that glues various
services together, pipe-style, and makes the realtime web just that
much more useful. Only, I thought they'd have the decency of including
HTTP triggers and channels so we could do whatever we damn well wanted
instead of being stuck with the handful of services we're actually using.

[IFTTT]: https://ifttt.com

So I need something to:

 - Trigger an IFTTT recipe,
 - get triggered by a recipe,
 - and be able to send and receive arbitrary data through that.

My first thought was: let's create a service that translates HTTP calls
to something IFTTT can handle and vice-versa. Woo! Boo! Not so easy.
Here are a few options:


Email
------

Possibly the easiest one to work with, albeit with a few serious caveats.
You can send emails to trigger@ifttt.com and it can also send you emails
as actions. The data is free-form and not really length-limited, and you
can even send a file through for binary data support.

Unfortunately, IFTTT only supports a single email channel per account, so
that means you'd have to give up on the email channel for other purposes.
(This ain't so bad: you could always plug the HTTP calls into a 3rd-party
email service.)


Feed
-----

*Trigger only*

Probably the best solution for triggers, this has the same advantages as email
minus the file attachment, but with better-structured data (more fields).


Gmail
------

Like email, but a bit better. Notably, you can send an email from your Gmail
account as an action, and trigger a recipe when a new email arrives, optionally
tagged. This could be a bit nicer as it allows you to still use both Email and
Gmail as channels. However, if you've got a Gmail account linked to IFTTT, there's
no reason to use Email at all except for proxying things through as shown above.