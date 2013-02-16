---
layout: post
title: "Building Hotot"
date: 2013-02-16 02:33
comments: true
categories:
  - software
  - OS X
  - twitter
---

A few days ago **@codeofinterest** [tweeted about Hotot][1], enthused
about a “better [alternative] than TweetDeck.” I was intrigued. Hotot has
[an article on ghacks][2], [a GitHub repository][3], and a _defunct_
[website][4] (it answers systematically with a 502). And of course, all the
information and downloads and demos / screens are purportedly on there.
Hidden. Frustrating.

Not content with the [Chrome extension][5] (the only other time I ran Chrome
solely for the purpose of a single application was TweetDeck, and I will not
repeat that experience), I decided to build the software. How hard could it be?

_(tl;dr: I made a [Homebrew formula][6] for it.)_

[1]: https://twitter.com/codeofinterest/status/301268509709705217
[2]: http://www.ghacks.net/2011/03/28/hotot-give-this-new-linux-twitter-client-a-tweet/
[3]: https://github.com/lyricat/Hotot
[4]: http://hotot.org
[5]: https://chrome.google.com/webstore/detail/hotot/cnfkkfleeiooolklkgkmigodkmcopnji?hl=en
[6]: https://gist.github.com/passcod/4966034


<!-- more -->


## Gtk2

Firstly, I had a choice to make: Gtk2, Gtk3, or Qt as a wrapper? I chose Gtk2.
It seemed the easiest option. The README indicates the following dependencies
for Gtk2:

 - __python2__: Easy, there’s one bundled with OS X, if I recall, although I
   have the Homebrew version myself.
 - __pygtk__: That one can be installed through `brew`. It builds cleanly.
 - __python-webkit__: This was the first snag I hit. `pip` finds `pywebkitgtk`,
   but doesn’t even attempt to install it due to a missing `setup.py`. It has
   to be built manually.

PyWebkitGtk has an `INSTALL` file which is rather verbose, but boils down to
the usual `./configure`, `make`, `make install`. Immediately, `./configure`
stopped to ask me about missing dependencies:

 - __gstreamer__: Homebrew took care of that nicely.
 - __pygtk__: Which the previous step took care of.
 - __gthread__: Which is found in glib, which I do have installed (Homebrew).
 - __libxslt__: Which is included with OS X. Huh. It’s complaining quite
   specifically about this one. Why?

I tried to install it through `brew install libxslt`, but Homebrew warned me it
was keg-only, and that linking it _would_ cause problems. Stuck, I nevertheless
tried to, then ran `./configure` again, and when it still didn’t work, I ran a
`brew unlink libxslt` to avoid trouble. I had a problem though: all the deps
were there, but the configure script didn’t want to work. I suspected it was a
path problem, though. So I tried various ways of specifying paths. _(In this
situation, my old trick of using nested shells to preserve the original env and
revert explorations quickly paid off immensely. I’d forgotten it for a while,
moslty due to `tmux` and `popd`, but it’s quite cool.)_ In the end, here’s what
I believed would work:

``` bash
export PYGTK_CFLAGS="-I/usr/local/Cellar/pygtk/2.24.0/include/pygtk-2.0"
export PYGTK_CFLAGS="$PYTHON_CFLAGS -I/usr/local/Cellar/pygobject/2.28.6/include/pygtk-2.0"

export PKG_CONFIG_PATH="/usr/local/Cellar/gstreamer/0.10.36/lib/pkgconfig"
export PKG_CONFIG_PATH="$PKG_CONFIG_PATH:/usr/local/Cellar/pygobject/2.28.6/lib/pkgconfig"
export PKG_CONFIG_PATH="$PKG_CONFIG_PATH:/usr/local/Cellar/pygtk/2.24.0/lib/pkgconfig"
export PKG_CONFIG_PATH="$PKG_CONFIG_PATH:/usr/local/Cellar/libxslt/1.1.28/lib/pkgconfig"

export PATH="$PATH:/usr/local/Cellar/gettext/0.18.2/bin/"

./configure --prefix=/usr/local/Cellar/pywebkitgtk/HEAD
```

Unfortunately, it died with this unhelful error:

``` text
checking for DEPS... no
configure: error: Package requirements (libxslt
                  gthread-2.0
                  pygtk-2.0) were not met:



Consider adjusting the PKG_CONFIG_PATH environment variable if you
installed software in a non-standard prefix.

Alternatively, you may set the environment variables DEPS_CFLAGS
and DEPS_LIBS to avoid the need to call pkg-config.
See the pkg-config man page for more details.
```

That blank space should have details, such as which package is missing,
exactly, but it’s emptiness here it really frustrating. However, it also brings
a new, slightly more tedious, line of trials: setting `DEPS_*` directly and
bypassing pkg-config altogether. But before I tried that, I decided to give one
of the other wrappers a chance.


## Qt

Qt 4.8 is in Homebrew and I already had it installed, so I went on to try and
build Hotot. The instructions are:

``` bash
$ git clone git://github.com/lyricat/Hotot
$ cd Hotot
$ mkcd build
$ cmake ..
$ make
$ sudo make install
```

Cmake complained that it couldn’t find gettext, though, so I ran
`brew link gettext --force` before building, with the intention of unlinking
afterwards. That worked.

As my system is configured using Homebrew, there is no need to run
`make install` as root. Build and installation having proceeded without snag,
I unlinked gettext and went on to the next step: trying it out.

``` bash
$ hotot-qt
```

Easy does it…

![Pretty icon for Hotot](/images/blog/2013-02-16-hotot-icon.png)

![OK, it seems to be alright…](/images/blog/2013-02-16-hotot-first-screen.png)

![Logged in and ready to go!](/images/blog/2013-02-16-hotot-logged-in.png)


Here’s a Gist with a working [Homebrew formula for Hotot][6].