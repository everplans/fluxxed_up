Fluxxed_up
===========

[![Build Status](https://travis-ci.org/BJK/fluxxed_up.svg?branch=master)](https://travis-ci.org/BJK/fluxxed_up)
[![Code Climate](https://codeclimate.com/github/BJK/fluxxed_up/badges/gpa.svg)](https://codeclimate.com/github/BJK/fluxxed_up)

React.js & Flux utility belt. Handles simple patterns around the uni-directional dataflow. It's of medium opinionation; you write less boilerplate, and write the code specific to your domain. But it'll let you write as much by hand as you want.

The basic idea is keep your components as stateless as possible, wrapping them in 'controller' components which handle the async dataflow. The big win is that your components are ultimately more testable, because they're deterministic and synchronous.

## History
This is a complete reboot of some earlier ideas that began in a Backbone app. If you look at the original commits you'll see it. We kept this repo as a reminder of our earlier folly. Who knows, maybe this won't be a react framework for long.