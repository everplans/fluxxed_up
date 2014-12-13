backwax
===========

[![Build Status](https://travis-ci.org/BJK/backwax.svg?branch=master)](https://travis-ci.org/BJK/backwax)
[![Code Climate](https://codeclimate.com/github/BJK/backwax/badges/gpa.svg)](https://codeclimate.com/github/BJK/backwax)

Forms widgets, two-way binding, built to test for backbone and marionette.

Still pre-release, but the idea here is to make a forms widget, that allows for interactive testing, while not using Selenium.

## Why not selenium?
Mostly because selenium is not very easy to work with. It makes for artificial build errors, due to timeouts, etc.. The testing approach used here, uses Jquery events and selectors to simulate user activity (much how seleninium would do it). However, the test framework is 'slightly' more aware of the internals, so that it waits for the correct events. More to come...
