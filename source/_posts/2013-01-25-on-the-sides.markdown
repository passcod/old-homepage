---
layout: post
title: "On the sides, really really alpha"
date: 2013-01-25 15:31
comments: true
categories:
  - thesides
  - software
  - api
---

So, [IFTTT sucks][1]. Turns out there's a better IFTTT out there
called [Zapier][2] that has a really easy to use developer interface.
Hence, I created a Zapier service for __On the sides__. Due to my own
UI not being great, though, you'll have to fiddle around with cURL (or
better, [httpie][3], which is what I'll be using below) to make it all
work.

[1]: /2013/01/04/on-ifttt-not-having-an-api-and-on-dot-thesides-v1.html
[2]: https://zapier.com/
[3]: http://httpie.org/


Pre-reqs
--------

 - You'll need a Zapier account. This takes about 20 seconds to create, email
verification isn't even necessary, and they've got a decent free plan.

 - You'll need to log in to [Mozilla Persona][4]. You can actually do that
later on when signing in to __On the sides__, but if emails take a bit of
time to arrive you might want to do it now if you have never done it before.
If you're just playing around, use `some-word@mockmyid.com` instead when
doing the Mozilla Persona thing (but only there!).

 - You'll need something to consume HTTP APIs with ease. I'll use httpie, as
mentioned above, or you can use cURL, or a JS console with jQuery.ajax or
anything else that floats your boat. Whatever. It needs to be able to do
GET and POST (with PUT and DELETE as bonuses), and set custom headers.

 - You'll need to know how to open the JS console. I won't tell you how, just
figure it out and if you can't, well, you probably can't do the rest anyway.

 - You'll need about 15 minutes. More if you're slow. Less if you're da baws.

[4]: https://login.persona.org/

<!-- more -->


On the sides AUTH
-----------------

1. Go to http://box.thesid.es and press the “Login” button. Or the “Start” button.
They do the same thing. If you can't see anything but a jumble of weird text,
click everywhere and you'll eventually hit it.

2. The Persona Login window will open. Follow the intructions.

3. If successful, you should be left with quite a bit less text. Open a JS console
or Firebug or whatever and enter:
  
  ``` javascript ~Console~
  >>> localStorage.session
  ```

4. You should now have your session token. Open a terminal, and run this:
  
  ``` bash ~Terminal~
  $ export SESS=paste-your-session-token-here
  ```

That will perform the double function of letting you easily access it for cURL or
httpie and save it somewhere easy to access for future steps.


Create a job
------------

1. Create a JS script to run on __on the sides__. Make it available somewhere
on the web, like in a [Gist][5] or at some pastebin or in a text file on your
server. It needs to be plain (not in an HTML thingimabob) and accessible with
a simple GET. Redirection (301,302) is ok. You can use [this example script][6]
to start with or if you're lazy.

2. Register the job:

  ``` bash ~Terminal~
  $ http --form POST http://api.box.thesid.es/job/new X-Session:$SESS script="http://example.com/script.js"
  ```

3. That should give a nice 200 with something like this:


  ``` json ~Response~
    {
      "created_at": "2013/01/08 15:03:47 +0000",
      "description": "",
      "hit_url": "",
      "id": "712fd8ff8e294ccae40b25a71e68593e",
      "key": "9a741e29cf49fa3a91a53e2c44de6b1c94048206",
      "script": "http://example.com/script.js"
    }
  ```

[5]: https://gist.github.com
[6]: https://gist.github.com/raw/4516319


Zapier action
-------------

1. Log in to Zapier. Ask me to send you the invite email so you can access
the __On the sides__ service.

2. Press the ‘Create a New Zap’ button.

3. Select a trigger (personally I find that GTalk is a good try/debug trigger).

4. Search for “on” and drag “On the sides” to the action box.

5. You'll need to “Add your On the sides Account”. This requires a `session`
   and `key` field. The `session` one is the value stored in `$SESS` above. The
   `key` one is the one from the JSON you got when creating a job. You can also
   get it back using:

  ``` bash ~Terminal~
  $ http GET api.box.thesid.es/me X-Session:$SESS
  ```

6. At the next step, you'll need the “Job ID”, which you got when creating the job
   above, and can also get back using:

  ``` bash ~Terminal~
  $ http GET api.box.thesid.es/jobs X-Session:$SESS
  ```

7. Skip the rest and just Enable the Zap at the bottom of the page.


Zapier trigger
--------------

1. Create a New Zap again.

2. Select an action. Something like GTalk works.

3. Select __On the sides__ as trigger.

4. You'll need to enter the same Job ID as before.

5. If you're using GTalk as action, you'll probably want to set the message to
something like:

  ``` plain Message
  Job {{id}} has finished.
  ```

6. Enable it.



Test it!
--------

(Hopefully I haven't forgotten anything and it works.)

Now you can trigger the job (using GTalk: just send a message to the zapbot).
When the job finishes, your action will be called (using GTalk: you'll receive
a message). Currently there's no way to give data to a job nor get data back
from it automatically, but it should be a good demo.


Play around
-----------

Get out in the sun once in a while, though.