Fluxxed_up [![Build Status](https://travis-ci.org/everplans/fluxxed_up.svg?branch=master)](https://travis-ci.org/everplans/fluxxed_up) [![Code Climate](https://codeclimate.com/repos/57361f9378bbd61943002b6b/badges/59cae8b81ec09ab798fb/gpa.svg)](https://codeclimate.com/repos/57361f9378bbd61943002b6b/feed) [![Dependency Status](https://gemnasium.com/badges/github.com/everplans/fluxxed_up.svg)](https://gemnasium.com/github.com/everplans/fluxxed_up)
===========

- [History](#history)
- [Releasing](#releasing)
- [Build Process](#build-process)
- [What's Included](#whats-included)
  - [Action Prototype](#actionprototype)
  - [Dispatcher](#dispatcher)
  - [jsonStatham](#jsonstatham)

Fluxxed_up is a React.js and Flux utility belt that handles simple patterns around the unidirectional dataflow. It is of medium opinionation: you write less boilerplate and get to focus on the code specific to your application. That said, it will let you write as much code 'by hand' as you want.

The goal of fluxxed_up is to keep most components as stateless as possible by wrapping them in 'controller' components that handle the asynchronous dataflow and share information with child components by passing `props`. The big win of this approach is that the non-controller components are ultimately more testable because they are deterministic and synchronous. In other words, the controller components handle the `state` and any asynchronous data requests so that the rest of the components are blissfully unaware of everything not included in the `props` passed to them.

## History
This is a complete reboot of some earlier ideas that began in a Backbone app. If you look at the original commits you'll see it. We kept this repo as a reminder of our earlier folly. Who knows, maybe this won't be a React framework for long.

## Releasing
Right now, until we get some gulp scripts in place make sure to run the following before packaging and releasing a version:
* `npm run build`
* `npm run build-min`

## Build Process
If you are using fluxxed_up from source, you'll need to have Babel setup in your project since the unbuilt code only exposes an ES6 entry point. If you don't have Babel, you'll need to run `npm run build` every time you want to see your changes.

## What's Included

#### ActionPrototype
Based off of Facebook patterns and intended to be used with flux. It works with a loose $.ajax wrapper to fire
API calls to your server. It supplies a `fireApi` function to the action, so that you can use it when you define your
own actions. You specific a REST actions (`GET`, `POST`, etc), and endpoint, and optional data payload (for a `PATCH`, `POST`, or `PUT`). You can optionally supply action types to dispatch based on a success or failure from the server. Here's an example of how to construct an action with `ActionPrototype`:

```javascript
// AssessmentActions.js
const AssessmentActions = assign(
  ActionPrototype,
  {
    Types: KeyMirror({
      GOT_ASSESSMENT: null
    }),
    fetchUsers() {
      this.fireApi(
        'get',
        'assessment',
        null,
        {
          JSONHead: 'assessment', // Top-level key in the JSON returned by the server.
          successAction: this.Types.GOT_ASSESSMENT // Note that since no failureAction was specified, it will always dispatch this action.
        }
      )
    }
  }
)
```

#### Dispatcher
Lightweight wrapper around the flux dispatcher. It will throw an exception if you try to dispatch an action with an undefined type. (You'd be surprised how many bugs you pre-emptively avoid doing this.)


#### jsonStatham
Lightweight wrapper around jQuery's ajax functionality. It assumes a simple RESTful api on the server side. It will fire success/failure callbacks based on server response. It has some extra settings to specify API keys and other auth.