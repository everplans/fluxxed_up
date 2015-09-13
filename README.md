Fluxxed_up
===========

[![Build Status](https://travis-ci.org/BJK/fluxxed_up.svg?branch=master)](https://travis-ci.org/BJK/fluxxed_up)
[![Code Climate](https://codeclimate.com/github/BJK/fluxxed_up/badges/gpa.svg)](https://codeclimate.com/github/BJK/fluxxed_up)

Fluxxed_up is a React.js & Flux utility belt that handles simple patterns around the unidirectional dataflow. It is of medium opinionation: you write less boilerplate and get to focus on the code specific to your application. That said, it will let you write as much code 'by hand' as you want.

The goal of fluxxed_up is to keep most components as stateless as possible by wrapping them in 'controller' components that handle the asynchronous dataflow and share information with child components by passing `props`. The big win of this approach is that the non-controller components are ultimately more testable because they are deterministic and synchronous. In other words, the controller components handle the `state` and any asynchronous data requests so that the rest of the components are blissfully unaware of everything not included in the `props` passed to them.

## History
This is a complete reboot of some earlier ideas that began in a Backbone app. If you look at the original commits you'll see it. We kept this repo as a reminder of our earlier folly. Who knows, maybe this won't be a React framework for long.
