---
layout: post
title: "Undo-Version-Control"
date: 2012-03-12 00:00
comments: true
categories: [unblog, checkthis, concept]
---

_Original on [Checkthis.com](http://checkthis.com/l7p8)_


The littlest things tend to get very interesting if you look closely
enough. Take the world, for example: an altogether boring place to be,
for sure, but the little things that make it work are altogether fascinating. Ask Higgs.

I was happily cogitating when my mind came to wonder about the inner
workings of two very different but very similar things: Git and Undo.
If you don't know what I'm talking about, [google “git”](https://www.google.com/search?q=git)
or [look on Wikipedia](https://en.wikipedia.org/wiki/Git_%28software%29) or
[read this book](http://www-cs-students.stanford.edu/%7Eblynn/gitmagic/).
I assume everybody is familiar with the Undo button in ~~all~~ many applications.

Now, the way I see it, Undo works by pushing past actions onto a stack. Imagine you're
typing an #unblog entry in a very primitive text editor. You start a paragraph (0), type
'It' (1), decide against it, press Ctrl-Z twice (2), type 'The' (3), pause for a second,
press Ctrl-Z thrice (4), and type 'I was' (5) then go on writing. In a "classical" undo
mechanism, here's what happens:

<!--more-->

1. 'I', 't' get pushed to the stack
2. 't', 'I' get popped off
3. 'T', 'h', 'e' get pushed on
4. 'e', 'h', 'T' get popped off
5. 'I', '\_', 'w', 'a', 's' and the rest of your entry get pushed on

This is cool, but it's awfully linear. What if you write a paragraph, Ctrl-Z it out,
write another one, then realise the first one was miles better? With this linear stack,
there's nothing you can do other than try to piece back things from your (poor) memory.

I think it would be cool to have git-style version control for your undo history. Actually,
it would be completely mind-blowing and friggin' wonder-inducing, but I'm trying to keep
myself controlled so I can type this up instead of jumping around gleefully.

With undo-version-control, the little scenario above would look like:

1. 'I', 't' get pushed to history
2. The current state (_HEAD_ in git-speak) gets rolled back to 't', then 'I' 
3. 'T', 'h', 'e' get pushed to a new history branch
4. _HEAD_ is rolled back to 'e', 'h', 'T'
5. We are now on the original branch, and go downstream by one step (to 'I'),
   then branch off and '\_', 'w', 'a', 's' and the rest of it get pushed to that new branch.

A bit more complex, for sure. To give you an idea, here's how it would look, tree wise:

![tree-like-structure](https://s3-eu-west-1.amazonaws.com/checkthis.com/asset/4f5f4550dd5de200010013aa/4f5f4550dd5de200010013aa-medium.png)

Now imagine you write a paragraph, Ctrl-Z it, write another worse one, and want to go back. Well: you can. And also...

 - Realise that the second one was _actually_ better, and go back again
 - Merge branches together
 - Tag particular points in the history
 - **Rebase** the fuck out of it all
 - Melt your brains

Way! 