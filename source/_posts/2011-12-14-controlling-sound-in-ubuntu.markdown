---
layout: post
title: "Controlling Sound in Ubuntu"
date: 2011-12-14 18:41
comments: true
categories:
  - linux
  - ubuntu
---

I’ve had problems with sound before in Ubuntu (and variants: Mint, Elementary).
Basically, when you plug in headphones, the sound comes of both the speakers
and the headphones! Not really what I want… although I have found this to be
useful sometimes.

There might be a solution meddling with the config files of alsa and sound
drivers, but I wasn’t particularly interested in this: my problem was that I
couldn’t control the volume of the headphones and speakers separately.
Alsamixer does just that.

```
$ alsamixer
```

Even better, on Oneiric, you can add it to the Unity dash by putting this into
__/usr/share/applications/alsamixer.desktop__:

``` text alsamixer.desktop
[Desktop Entry]
Exec=alsamixer
Name=AlsaMixer
GenericName=Sound Controller
X-GNOME-FullName=Alsamixer
Comment=Control the sound. All of it.
Icon=audio-headset
StartupNotify=true
Terminal=true
Type=Application
Categories=GNOME;Audio;Music;
```

You can change the name, icon, and comment to your liking, of course.
