backwax
===========

[![Build Status](https://travis-ci.org/BJK/backwax.svg?branch=master)](https://travis-ci.org/BJK/backwax)
[![Code Climate](https://codeclimate.com/github/BJK/backwax/badges/gpa.svg)](https://codeclimate.com/github/BJK/backwax)

React.js & Flux utility belt. Handles simple patterns around the uni-directional dataflow. It's of medium opinionation; you know write less boilerplate, and write the code specific to your domain. But it'll let you write as much by hand as you want.

The basic idea is keep your components as stateless as possible, wrapping them in 'controller' components which handle the async dataflow. The big win is that your components are ultimately more testible, because they're deterministic and synchronous.

## History
This is a complete reboot of some earlier ideas that began in a backbone app. If you look at the original commits you'll see it. We kept this repo as a reminder of our earlier folly. Who knows, maybe this won't be a react framework for long.