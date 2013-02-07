---
layout: post
title: "Late introduction to libworker.js"
date: 2013-02-07 22:19
comments: true
categories: 
  - software
  - concurrency
---

About 3 weeks ago I tried to reboot [DynWorker][1], my library
to “make web threading fun.” I wanted not only to take advantage
of newer technology, but also to give it a good layer of fresh
paint. I started by manually translating it all in CoffeeScript.

And it was looking good! The straight conversion worked, so I made
a tiny change and tried to use a data:URI to load the worker code.
Which turned out to be impossible. I essentially wanted to take the
entire library, stringify it, base64-encode it, and put it in a
variable… preferably at run-time. Y’know, so I didn't have to dupe
my entire code in the source!

One of the best (!) solutions I found went like this:

``` coffeescript JS in Coffee, ah-yup
var src = "
(function () {
  ...
  do something
  ...
}())"

@DynWorker.src = "data:text/javascript;base64," + btoa src
eval src
```

_Don’t do that, kids._

Besides, I had looked at the list of features I had to test, the list
of features I had thought of, the list of features I probably needed
to implement, and daaamn, boy, ah wasn’ gonna be done with it sooner.
So I tanked it.

Instead, I created [libworker.js][2]. DynWorker has a line in the readme
saying it pretty low-level. That ain’t true no more. Libworker.js is to
DynWorker what Assembly is to C++ : a completely different level.

Here is the entirety of the source. You can take that and paste
it in your console and it’ll work. Promise.

``` javascript libworker.min.js
(function(b){
"use strict";
b.addEventListener("message",function(a){a=String(a.data);
if(!(5>a.length)&&"eval:"===a.slice(0,5))return b.eval.call(b,
a.slice(5))});function c(a){this.metal=null!=a?a:new Worker(c.src)}
c.prototype.send=function(a){this.metal.postMessage(a)};
c.prototype.eval=function(a){this.send("eval:"+a)};
c.src='data:text/javascript;base64,dmFyIGI7Yj10aGlzO'+
'3RoaXMuYWRkRXZlbnRMaXN0ZW5lcigibWVzc2FnZSIsZnVuY3Rp'+
'b24oYSl7YT1TdHJpbmcoYS5kYXRhKTtpZighKDU+YS5sZW5ndGg'+
'pJiYiZXZhbDoiPT09YS5zbGljZSgwLDUpKXJldHVybiBiLmV2YW'+
'wuY2FsbChiLGEuc2xpY2UoNSkpfSk7';
b.libworker=c;
}(this));
```

(It’s actually [written in CoffeeScript][3], don’t you worry, this
is not the source source, it’s not completely unmantainable. Although
I actually “hand-compile” this thing.)

If you can’t read minified JavaScript, there’s [a page with examples][4]
available, albeit quite short. I just can’t justify too many words on this
little code!

This library can be included directly in any project that needs to use
WebWorkers, like **Dyno.js**, my upcoming Actor framework for browsers,
for which there is little source available in very non-obvious places.  
You’ll just have to wait ;-)

[1]: https://passcod.name/DynWorker
[2]: https://github.com/passcod/libworker.js
[3]: https://github.com/passcod/libworker.js/blob/master/libworker.coffee
[4]: https://passcod.name/libworker.js
