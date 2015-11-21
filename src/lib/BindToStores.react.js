import React from 'react'
import StorePrototype from './StorePrototype'

//let's say for now, stores is a dictionary of name and object
export default function bindResources(Component, resourceName) {
  function extractStores() {return Object.getOwnPropertyNames(stores).map(function(o) {return stores[o]})}
  function capitalize(word) {return word.charAt(0).toUpperCase() + word.slice(1)}
  function singularize(word) {return word.slice(-1) === 's' ? word.slice(0, -1) : word}

  var bootAction = 'fetch' + capitalize(resourceName)

  //figure out how to pass in actions
  //import actionClass from `PATH TO ACTIONS/${singularize(capitalize(resourceName))}Actions`

  var actionType = actionClass.Types['GOT_'+ resourceName.toUpperCase()]
  var resourceStore = StorePrototype(actionType)
  var stores = {}
  stores[resourceName] = resourceStore

  const BoundComponent = React.createClass({

      getInitialState() {
        return { loading: true, processing: false}
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
        return <Component {...this.props} {...this.state}/>
      }
  })
  return BoundComponent
}
