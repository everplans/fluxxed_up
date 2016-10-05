Fluxxed_up
===========

[![Build Status](https://travis-ci.org/everplans/fluxxed_up.svg?branch=master)](https://travis-ci.org/everplans/fluxxed_up)
[![Code Climate](https://codeclimate.com/repos/57361f9378bbd61943002b6b/badges/59cae8b81ec09ab798fb/gpa.svg)](https://codeclimate.com/repos/57361f9378bbd61943002b6b/feed)
[![Dependency Status](https://gemnasium.com/badges/github.com/everplans/fluxxed_up.svg)](https://gemnasium.com/github.com/everplans/fluxxed_up)

Fluxxed_up is a React.js & Flux utility belt that handles simple patterns around the unidirectional dataflow. It is of medium opinionation: you write less boilerplate and get to focus on the code specific to your application. That said, it will let you write as much code 'by hand' as you want.

The goal of fluxxed_up is to keep most components as stateless as possible by wrapping them in 'controller' components that handle the asynchronous dataflow and share information with child components by passing `props`. The big win of this approach is that the non-controller components are ultimately more testable because they are deterministic and synchronous. In other words, the controller components handle the `state` and any asynchronous data requests so that the rest of the components are blissfully unaware of everything not included in the `props` passed to them.

## History
This is a complete reboot of some earlier ideas that began in a Backbone app. If you look at the original commits you'll see it. We kept this repo as a reminder of our earlier folly. Who knows, maybe this won't be a React framework for long.

## Releasing:
Right now, until we get some gulp scripts in place make sure to run the following before packaging and releasing a version:
* `npm run build`
* `npm run build-min`

## Using:
* If you are using fluxxed_up from source, you'll need to have babel setup in your project, since the non-built code only exposes an es6 entry point. If you'd don't have babel, you'll need to run `npm run build` everytime you want to see your changes.

## What's included:

* Action Prototype
Based of off facebook patterns and intended to be used with flux. It works with a loose $.ajax wrapper to fire
API calls to your server. It supplies a `fireApi` function to the action, so that you can use it when you define your
own actions. You specific a REST actions (get, post, etc), and endpoint, and optional data payload (for a put or a post). You can optionally supply action types to dispatch based on a success or failure from the server. Here's an example of how to use:

```
//in MyActions.js
var TestAction = assign(ActionPrototype, {
  Types: KeyMirror({
    GOT_USERS: null
  }),
  fetchUsers: function() {
     this.fireApi('get', 'assessment', null,
      {successAction: this.Types.GOT_ASK_DOCUMENT_GROUPS, //Note that since no failureAction was specified, it will dispatch this action always. 
      JSONHead: 'assessment'}) //head of the json coming back from the server. 
  }
})
```

* Dispatcher
Lightweight wrapper around the flux dispatcher. It will throw an exception if you try to dispatch an action with an undefined type. (You'd be surprised how many bugs you pre-emptively avoid doing this).

* jsonStatham
Lightweight wrapper around jQuery's ajax functionality. It assumes a simple RESTful api on the server side. It will fire success/failure callbacks based on server response. I has some extra settings to specific API keys and other auth.

* FeatureFlags
Little helper class to query if a feature flag is on or off based on some JSON config. We fetch this from the server and turn on/off features for a user based on the config. A flag not specified in the config will auto default to disabled. Example:
```
FeatureFlags.init({[{flag:'new_thing', status: 'ENABLED'}]})
FeatureFlags.isEnabled('new_thing') //true
```

* ExtraStorage
This is a little module that wraps default browser local storage behavior. It has a small wrapper to simulate behavior for when a browser is in incognito mode.
