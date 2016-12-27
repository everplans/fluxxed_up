import invariant from 'invariant'
import React from 'react'

import { capitalize } from './tools'
import Container from './Container'
import storePrototype from './StorePrototype'

export default function bindResources(Component, resources, onBoundUpdate = null, resourceId = null) {
  const stores = {}
  function storeNames() { return Object.getOwnPropertyNames(stores) }

  let resourceConfigs = (Array.isArray(resources) ? resources : [resources])  // Handle old, one-resource pattern too.

  let bootObjects = []  // Objects containing all necessary information for firing the bootAction of each resource
    // and the tracking of the loading state of each resource.
    // Example of the bootObject for an 'item' resource:
       // {bootAction: 'fetchClient', actionClass: 'ClientActions', resourceType: 'item', resourceId: '12'}

  // Construct a bootObject for every resource:
  resourceConfigs.forEach(resourceConfig => {
    let resourceType = Object.getOwnPropertyNames(resourceConfig)[0]
    let resourceName = resourceConfig[resourceType]

    // Get the action class--previously registered with the Container--used to fetch the resource data:
    let actionClass = Container.getAction(resourceName)

    // Get or create the store used to hold the resource data:
    let resourceStore = Container.getStore(resourceName)
    if (!resourceStore)
      resourceStore = Container.registerStore(resourceName, storePrototype(actionClass.Types[`GOT_${resourceName.toUpperCase()}`]))

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
    itemLoaders: [],
    getInitialState() {
      return {
        loading: true,
        processing: false
      }
    },
    componentWillMount() {
      // Create a listener for each resource store:
      storeNames().forEach(store => {
        let onChangeHandlerName = `handle${store}Change`
        this[onChangeHandlerName] = this.onChangeFactory(store)
        stores[store].addChangeListener(this[onChangeHandlerName])
      })

      // Fire the bootAction to fetch each resource:
      let loadingStates = {}

      bootObjects.forEach(bootObject => {
        loadingStates[bootObject.loadingName] = true

        // Need to hoist these values when called again from componentWillReceiveProps (BJK):
        let resourceId = bootObject.resourceId
        let loadingName = bootObject.loadingName
        let bootAction = bootObject.bootAction

        /* eslint-disable indent */ // Fix ESLint complaining about our preferred switch syntax.
        // Choose which ID--if any--is passed to the GET request to identify the resource:
        switch (bootObject.resourceType) {
          case 'item':  // One specific item that MUST have an ID included in the GET request.
            const checkId = nextProps => { // Set up a function that reloads the resource if the ID in the params changes
              if (nextProps && nextProps.params[resourceId] === this.props.params[resourceId])
                return

              loadingStates[loadingName] = true
              let idParam = nextProps ? nextProps.params[resourceId] : this.props.params[resourceId]

              if (!idParam) { // Skip bootAction for items requiring ID if no ID URL param is available.
                loadingStates[loadingName] = false
                return
              }
              bootObject.actionClass[bootAction](idParam)

              // Update the previous loading state if it is present:
              if (this.state && typeof this.state[Object.keys(loadingStates)[0]] !== 'undefined')
                this.setState(loadingStates)
            }

            checkId()
            this.itemLoaders.push(checkId)
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
    componentWillReceiveProps(nextProps) { // Reload any resource if the associated route ID changes
      this.itemLoaders.forEach(checkId => checkId(nextProps))
    },
    componentWillUnmount() {  // Kill all listeners when component is unmounting.
      storeNames().forEach(store => stores[store].removeChangeListener(this[`handle${store}Change`]))
    },
    goToThere(targetObject) {  // Push new router path if requested to do so in onBoundUpdate.
      this.context.router.push(targetObject)
    },

    onChangeFactory(store) {  // Create a custom listener identifier so loading states can be tracked independently for each resource.
      let myStore = store
      return () => {
        let newState = {loading: false}  // Backwards-compatability for single-resource bindings.
        let newStoreState = stores[myStore].getState()
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
