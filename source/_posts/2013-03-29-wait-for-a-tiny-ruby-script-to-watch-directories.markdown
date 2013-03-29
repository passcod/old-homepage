---
layout: post
title: "wait-for: a tiny Ruby script to watch directories"
date: 2013-03-29 14:35
comments: true
categories:
  - software
  - ruby
---

I was pretty tired of [`when-changed`][1]’s inability to watch
directories, so I made this using the [`listen`][2] Ruby gem:

``` ruby ~/bin/wait-for
#!/usr/bin/env ruby

require 'listen'
cmd = ARGV.pop

Signal.trap "INT" do
  puts "\b\bStopping..."
  exit
end

Listen.to *ARGV do
  puts "\n$ #{cmd}\n"
  out = `#{cmd}`
  pro = $?
  puts out
  puts "=> Exited: #{pro.exitstatus}"
  puts "\a" unless pro.success?
end
```

It can only watch directories, though, so I might keep using `when-changed` for
some things. However, it does so using kernel features (kqueue on OS X, inotify
on Linux), so it’s a much leaner alternative. _(You’ll need, of course, to have
`$HOME/bin` in your path, or to put this somewhere else. ;)_

[1]: https://github.com/joh/when-changed
[2]: https://github.com/guard/listen
