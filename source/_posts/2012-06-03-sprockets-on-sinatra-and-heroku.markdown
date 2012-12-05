---
layout: post
title: "Sprockets on Sinatra (&amp; Heroku)"
date: 2012-06-03 00:00
comments: true
categories: [unblog, checkthis, software, ruby]
---

_Original on [Checkthis.com](http://checkthis.com/biye)._

In the world of ruby, there exists this framework called Rails, which I'm
sure you've heard about. I happen not to like it very much. One of the
reasons is that I've read maybe 2% of Rails' code, whereas for most of the
other gems I use this is more like 40%. With Rails, I rely on magic (and,
yea, it's nice) and with the other stuff, I rely on my own knowledge. I
prefer the latter.

There's also that Rails is an MVC framework, which is best buds with
ActiveRecord and is a pain to manage as soon as you separate them. If you
don't want or need the MVC pattern, or ActiveRecord, you're in for trouble.
If you are unfortunate enough to need a gem which is incompatible with a Rails
component, even if said component is supposed to be optional, you have my sympathies.

In the world of Ruby, there also exists a little wonder called Sinatra. Sinatra
is just the dispatcher part of Rails, plus the templating, plus a few other nifty
features, but done right. It's small, sharp, lean, and mean. And it does exactly as
advertised, no more, no less. When building an application with Sinatra, you get to
pick and choose. DataMapper vs. ActiveRecord vs. Sequel? A single line in the Gemfile.
Not MVC? No problem. Custom directory structure? We wouldn't have it any other way.

There's __no magic__ in Sinatra (or just plain Rack, if that's your fancy). It's all
__just code__. And chances are you'll have written or read a lot of it.
[Wordpress says code is poetry](http://wordpress.org/), and I agree, but given that
Wordpress is written in PHP, I feel that with ruby... _code is art_.

![Code is art](https://s3-eu-west-1.amazonaws.com/checkthis.com/asset/4fca9c0855a70a00030025d7/4fca9c0855a70a00030025d7-medium.png)

In the world of ruby, there happens to be another wonder called Sprockets. Sprockets
is what powers Rails' 3.1+ asset pipeline. And therein lies the problem.

Sprockets is an awesome tool, and adding it to a Rack application makes things even
sparklier than pink unicorns. But it's relatively under-documented and Googling for
solutions returns Rails-related stuff 99% of the time. Annoying. That's due to a little
something called sprockets-rails, which takes sprockets, adds magic, and transforms it
into the asset pipeline. Trying to use asset pipeline know-how with standalone Sprockets
is frustrating.

So how do you do it?

<!--more-->

``` ruby Gemfile
source :rubygems
ruby "1.9.3"

gem "sinatra"

group :app do
  gem "haml"
  gem "json"
  gem "sprockets-helpers"
end

group :rackup do
  gem "rack"
  gem "unicorn"
end

group :assets do
  gem "sprockets"
  gem "sprockets-helpers"
  gem "stylus"
  gem "coffee-script"
  gem "yui-compressor"
  gem "uglifier"
end

group :development do
  gem "heroku", require: false
  gem "foreman", require: false
  gem "shotgun", require: false
  gem "thin", require: false
  gem "rake", require: false
end
```

First, you'll need most of these. You don't need [Unicorn](http://unicorn.bogomips.org/)
nor [Shotgun](https://github.com/rtomayko/shotgun) nor [Stylus](http://learnboost.github.com/stylus/)
nor [CoffeeScript](http://coffeescript.org/), pick and choose these.

Some gems are duplicated in groups. That's normal. I make use of Bundler's auto-require
facility to keep code simple, and that happens.

Finally, the ruby "1.9.3" declaration is a new feature in Bundler 1.2, so you might need
to install the `--pre` version of the gem. I use 1.9.3, and I think some stuff breaks in
1.9.2, so beware. If you really need 1.9.2, you'll need to fix these yourself. _(Note:
no longer relevant.)_

``` ruby start.rb
require 'bundler'
Bundler.require :default, :app
require './config/sprockets'

configure do
  set :production, ENV['RACK_ENV'] == 'production'
  set :app_root, File.realdirpath('.')
  set :assets, YourApp::Assets::Environment.get(settings.app_root, settings.production)
  
  Sprockets::Helpers.configure do |config|
    config.environment = settings.assets
    config.prefix      = '/assets'
    config.digest      = true
    config.public_path = settings.public_folder
  end
end

# ...
```

This is the Sinatra main app file. Some like to call it app.rb, I ~~don't~~ didn't
like that because the app is much more than just this file.

The top 2 first lines load everything in the `:app` and `:default`
Gemfile groups. That includes Sinatra and sprocket-helpers. This file is mostly
bootstrapping the live side of things, and I'll come back to it later.

Most of the meat of the problem is contained in the "./config/sprockets" file
we require at the top, which looks like this:

``` ruby config/sprockets.rb
require 'bundler'
Bundler.require :default, :assets

module YourApp
  module Assets
    class Environment
      def self.get(root_path, preprocess = false)
        assets = Sprockets::Environment.new root_path
        
        # Application assets
        assets.append_path 'assets/stylesheets'
        assets.append_path 'assets/javascripts'
        
        # Vendor assets
        assets.append_path 'vendor/assets/stylesheets'
        assets.append_path 'vendor/assets/javascripts'
        
        Stylus.setup assets
        
        if preprocess
          assets.css_compressor = YUI.CssCompressor.new
          assets.js_compressor = Uglifier.new
        end
        
        return assets
      end
    end
  end
end
```

Meat indeed, but pretty straightforward. That could actually just be a function,
but I was too lazy to refactor it again after battling with it for hours. Or, it
could be duck-typed. That could work too.

There's a call to Stylus, there, if you want don't want Stylus and prefer Sass or
Less, just remove that and modify the Gemfile appropriately.

There's no lib/assets paths because I don't feel the need for them.

The compressors have to be passed as instances. That's one of the differences with
the Rails magic way, but it's no hassle.

Going back to start.rb above, you'll see that we get the Sprockets environment,
and set up the helpers, but never actually set up the serving of said assets.
That's done in two ways:

``` ruby config.ru
require 'bundler'
Bundler.require :default, :rackup

if ENV['RACK_ENV'] == 'production'
  require './config/sprockets'
  assets = YourApp::Assets::Environment.get File.realdirpath('.')
  map('/assets') { run assets.index }
end

require './start'
map('/') { run Sinatra::Application }
```

Here we go. If we're in development (use [the .env and Foreman](http://ddollar.github.com/foreman/#RUNNING)),
run the live Sprockets server. Otherwise, don't. For production, we do this: 

``` ruby Rakefile
require './config/sprockets'
require './config/precompiler'
require 'fileutils'
require 'json'
require 'yaml'

namespace :assets do
  root = File.realdirpath('.')
  
  desc 'Precompile assets for production'
  task :precompile => :clean do
    assets = YourApp::Assets::Environment.get root, ENV['RACK_ENV'] == 'production'
    precompiler = YourApp::Assets::Compiler.new sprockets: assets, precompile: [ /\./ ]
    
    print 'Precompiling assets... '
    precompiler.compile
    puts 'DONE'
    
    print 'Generating asset manifests... '
    asset_list = {}
    assets.each_logical_path do |logical_path|
      if asset = assets.find_asset(logical_path)
        asset_list[logical_path] = '/assets/' + asset.digest_path
      end
    end
    IO.write File.join(root, '/public/asset_manifest.json'), JSON.generate(asset_list)
    IO.write File.join(root, '/public/asset_manifest.js'), 'ASSETS='+JSON.generate(asset_list)
    IO.write File.join(root, '/public/asset_manifest.yml'), asset_list.to_yaml
    puts 'DONE'
  end
  
  desc 'Clean assets folder'
  task :clean do
    print 'Destroying public/assets... '
    FileUtils.rm_rf File.join(root, '/public/assets')
    puts 'DONE'
  end
end
```

The Rakefile takes care of the precompilation. This works with Heroku so long as the
task is named `assets:precompile`, so we're covered there.

I precompile everything, which might be too much, but adjust the Regexp as you want.
And then we write the asset manifests. These are to do with a pretty bad caveat which
I'll detail later. For now, we need to have a look the meat of the compiler,
in "./config/precompiler":

``` ruby config/precompiler.rb
module YourApp
  module Assets
    # Adapted from: https://github.com/stevehodgkiss/guard-sprockets2
    class Compiler
      def initialize(options = {})
        configure(options)
        @target = Pathname.new(@assets_path)
      end
  
      def clean
        FileUtils.rm_rf @assets_path, :secure => true
      end
  
      def compile
        @sprockets.send(:expire_index!)
        success = true
        @precompile.each do |path|
          @sprockets.each_logical_path do |logical_path|
            next unless path_matches?(path, logical_path)

            if asset = @sprockets.find_asset(logical_path)
              success = compile_asset(asset)
              break unless success
            end
          end
        end
        success
      end

      protected

      def compile_asset(asset)
        filename = @digest ? @target.join(asset.digest_path) : @target.join(asset.logical_path)
    
        FileUtils.mkdir_p filename.dirname
        asset.write_to(filename)
        asset.write_to("#{filename}.gz") if @gz && filename.to_s =~ /\.(css|js)$/
        true
      rescue => e
        puts unless ENV["GUARD_ENV"] == "test"
        UI.error e.message.gsub(/^Error: /, '')
        false
      end
  
      def path_matches?(path, logical_path)
        if path.is_a?(Regexp)
          path.match(logical_path)
        else
          File.fnmatch(path.to_s, logical_path)
        end
      end
  
      def configure(options)
        @sprockets = options[:sprockets]
        @assets_path = options[:assets_path]
        @precompile = options[:precompile]
        @digest = options[:digest]
        @gz = options[:gz]
        set_defaults
      end
  
      def set_defaults
        if defined?(Rails)
          @sprockets ||= Rails.application.assets
          @assets_path ||= File.join(Rails.public_path, Rails.application.config.assets.prefix)
          @precompile ||= Rails.application.config.assets.precompile
        else
          @assets_path ||= "#{Dir.pwd}/public/assets"
          @precompile ||= [ /\w+\.(?!js|css).+/, /application.(css|js)$/ ]
        end
        @digest = true if @digest.nil?
        @gz = true if @gz.nil?
      end
    end
  end
end
```

It's really just a straight copy-paste from the [guard-sprockets2](https://github.com/stevehodgkiss/guard-sprockets2)
code. See that compile function? That's where the code to make the asset manifests comes from.

Speaking of which, when we're in development, we also need those manifests, so add this to your routes:

``` ruby routes.rb
# ...

if !settings.production
  get '/asset_manifest.:format' do
    asset_list = {}
    settings.assets.each_logical_path do |logical_path|
      if asset = settings.assets.find_asset(logical_path)
        asset_list[logical_path] = '/assets/' + asset.digest_path
    end
  end
  
  if params[:format] == 'json'
    JSON.generate asset_list
  elsif params[:format] == 'yml'
    asset_list.to_yaml
  else
    'ASSETS='+JSON.generate(asset_list)
  end
end

# ...
```

And you should also set up your helpers: 

``` ruby helpers.rb
helpers do
  # ...
  
  def meta_charset
    '<meta charset="UTF-8">'
  end
  
  def stylesheet(s)
    s = asset_path(s+'.css') unless s =~ /^(https?:\/)?\//
    "<link rel=\"stylesheet\" href=\"#{s}\">"
  end
  
  def javascript(s)
    s = asset_path(s+'.js') unless s =~ /^(https?:\/)?\//
    "<script src=\"#{s}\"></script>"
  end
  
  include Sprockets::Helpers
end
```

## Caveats

There's two biggies here:

1. __No image assets.__
   I don't think that's too much bad, because unless you want to use automated
   sprite generation, you can safely relocate your images to public/ and fix your
   paths. Apart from that, you'll also have to say goodbye to Sprockets' cache-busting,
   but I'm sure you'll survive. Or find an alternative.

2. __No asset_path helpers in assets__
   Slightly more annoying, and the reason for the manifests. You can't use erb nor eco
   nor ejs, and therefore, you can't use asset_path helpers in assets. You still have
   them in your views, though.


## The Code

The _original_ code samples above were all images, and that was mostly intentional. It was
so you couldn't copy-paste stuff. Learn, sheeple!

More seriously, checkthis.com doesn't support code listings, so that was all I could do at
the time. I had also provided a link to the original project of mine that implemented this,
but I destroyed this a while back.

For this reason, when I did the migration over to Octopress, I _manually copied and typed_
all the code samples. Thus there might be typos, so if it doesn't work, look around. And don't
forget to comment back so I can fix it here, too!