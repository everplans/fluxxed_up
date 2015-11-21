import React from 'react'
import StorePrototype from './StorePrototype'

// let's say for now, stores is a dictionary of name and object
export default function bindResources(Component, resourceName) {
  function extractStores() { return Object.getOwnPropertyNames(stores).map(store => stores[store]) }
  function snakeToCamel(input) {
    return (input.charAt(0).toUpperCase() +
            input.slice(1).replace(/(\_\w)/g, function(match) { return match[1].toUpperCase() })
           )
  }
  function singularize(word) { return (word.slice(-1) === 's' ? word.slice(0, -1) : word) }

  var bootAction = `fetch${snakeToCamel(resourceName)}`

  // figure out how to pass in actions
  // import actionClass from `PATH TO ACTIONS/${singularize(snakeToCamel(resourceName))}Actions`

  var actionType = actionClass.Types[`GOT_${resourceName.toUpperCase()}`]
  var resourceStore = StorePrototype(actionType)
  var stores = {}
  stores[resourceName] = resourceStore

  const BoundComponent = React.createClass({
    getInitialState() {
      return {loading: true, processing: false}
    },
    componentWillMount() {
      extractStores().forEach(store =>
        store.addChangeListener(this.handleStoresChanged)
      )
      actionClass[bootAction]()
    },
    componentWillUnmount() {
      extractStores().forEach(store =>
        store.removeChangeListener(this.handleStoresChanged)
      )
    },
    handleStoresChanged() {
      var state = {processing: false, loading: false}
      Object.getOwnPropertyNames(stores).map(function(store) {
        state[store] = stores[store].getState()
      })
      this.setState(state)
    },
    render() {
      return <Component {...this.props} {...this.state} />
    }
  })
  return BoundComponent
}

// TODO: consider implementing a resourceNameCleaner that strips whitespace, calls `.replace(/_{2,}/g, '_')` to
// ensure multiple underscores do not appear in a row, etc.
