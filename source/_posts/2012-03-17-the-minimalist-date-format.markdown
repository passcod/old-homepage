---
layout: post
title: "The Minimalist Date Format"
date: 2012-03-17 17:17
comments: true
categories: [unblog, checkthis]
---

_Original on [Checkthis.com](http://checkthis.com/7qf4)_

The Minimalist date format is a 5- or 7- digits number which represents a date (no time).
It increases mathematically (i.e. you can compare whether a date precedes another by
comparing if one number is smaller than the other), and it looks cryptic to the ignorant.

It is made of (in that order):

1. the 2- or 4- digit year,
2. the 2-digit ISO week number, and
3. the 1-digit ISO week day number. 

All these are zero padded, thus the resulting number is always 5 or 7 digits long.

I use it in various places, including:

 - Some version numbers
 - Artwork
 - Weechat
 - Here

![Weechat date/time](http://i.imgur.com/h3Ml1.png)