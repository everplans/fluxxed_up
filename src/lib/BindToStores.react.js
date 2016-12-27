import invariant from 'invariant'
import React from 'react'

import { capitalize } from './tools'
import Container from './Container'
import storePrototype from './StorePrototype'

export default function bindResources(Component, resources, onBoundUpdate = null, resourceId = null) {
  const stores = {}
  function storeNames() { return Object.getOwnPropertyNames(stores) }

  var resourceConfigs = (Array.isArray(resources) ? resources : [resources])  // Handle old, one-resource pattern too.

  var bootObjects = []  // Objects containing all necessary information for firing the bootAction of each resource
    // and the tracking of the loading state of each resource.
    // Example of the bootObject for an 'item' resource:
       // {bootAction: 'fetchClient', actionClass: 'ClientActions', resourceType: 'item', resourceId: '12'}

  // Construct a bootObject for every resource:
  resourceConfigs.forEach(resourceConfig => {
    const resourceType = Object.getOwnPropertyNames(resourceConfig)[0]
    const resourceName = resourceConfig[resourceType]

    // Get the action class--previously registered with the Container--and action Type used to fetch the resource data:
    const actionClass = Container.getAction(resourceName)
    const actionType = actionClass.Types[`GOT_${resourceName.toUpperCase()}`]

    // Get or create the store used to hold the resource data:
    var resourceStore = Container.getStore(resourceName)
    if (!resourceStore)
      resourceStore = Container.registerStore(resourceName, storePrototype(actionType))

    // Add the store to the list of store the BoundComponent will listen to:
    stores[resourceName] = resourceStore

    bootObjects.push({
      actionClass,
      bootAction: `fetch${capitalize(resourceName)}`,
      loadingName: `loading${capitalize(resourceName)}`,
      resourceId: (resourceId ? resourceId : `${capitalize(resourceName, false)}Id`),
      resourceType
    })
  })

  const BoundComponent = React.createClass({
    contextTypes: {router: React.PropTypes.object},
    getInitialState() {
      return {
        loading: true,
        processing: false
      }
    },
    componentWillMount() {
      // Create a listener for each resource store:
      storeNames().forEach(store => {
        const onChangeHandlerName = `handle${store}Change`
        this[onChangeHandlerName] = this.onChangeFactory(store)
        stores[store].addChangeListener(this[onChangeHandlerName])
      })

      // Fire the bootAction to fetch each resource:
      var loadingStates = {}
      bootObjects.forEach(bootObject => {
        loadingStates[bootObject.loadingName] = true

        /* eslint-disable indent */
        // Choose which ID--if any--is passed to the GET request to identify the resource:
        switch (bootObject.resourceType) {
          case 'item':  // One specific item that MUST have an ID included in the GET request.
            var idParam = this.props.params[bootObject.resourceId]
            if (!idParam) { // Skip bootAction for items requiring ID if no ID URL param is available.
              loadingStates[bootObject.loadingName] = false
              break
            }

            bootObject.actionClass[bootObject.bootAction](idParam)
            break
          case 'itemAllParams':  // One specific item with a more-complex API endpoint URL as constructed in the action.
            bootObject.actionClass[bootObject.bootAction](this.props.params)
            break
          case 'itemNoId':  // Single item that requires no ID (e.g., global config). Separate from list only to make it clear that it is only one item.
          case 'list':  // List of items accessible at a single endpoint that does not require any resource ID.
            bootObject.actionClass[bootObject.bootAction]()
            break
          default:  // Do not allow any resources of any other type to be requested--mainly a dev sanity check.
            invariant(bootObject.resourceType, '`bootObject.resourceType` is unknown or undefined.')
        }
        /* eslint-enable indent */
      }, this)
      this.setState(loadingStates)
    },
    componentWillUnmount() {  // Kill all listeners when component is unmounting.
      storeNames().forEach(store => stores[store].removeChangeListener(this[`handle${store}Change`]))
    },
    goToThere(targetObject) {  // Push new router path if requested to do so in onBoundUpdate.
      this.context.router.push(targetObject)
    },

    onChangeFactory(store) {  // Create a custom listener identifier so loading states can be tracked independently for each resource.
      var myStore = store
      return () => {
        var newState = {loading: false}  // Backwards-compatability for single-resource bindings.
        var newStoreState = stores[myStore].getState()
        newState[myStore] = newStoreState
        newState[`loading${capitalize(store)}`] = false

        // NOTE: it is the responsibility of the onBoundUpdate function to set the state if onBoundUpdate is included.
        if (onBoundUpdate && typeof onBoundUpdate === 'function')
          onBoundUpdate.apply(this, [newStoreState])
        else
          this.setState(newState)
      }
    },

    render() { return <Component {...this.props} {...this.state} /> }
  })
  return BoundComponent
}
