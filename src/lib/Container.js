class Container {
  constructor() { this.init() }
  init() {
    this.actions = {}
    this.stores = {}
  }
  getAction(name) { return this.actions[name] }
  getStore(name) { return this.stores[name] }
  register(type, name, component) {
    this[type][name] = component
    return component
  }
  registerAction(name, component) { return this.register('actions', name, component) }
  registerStore(name, component) { return this.register('stores', name, component) }
}

export default new Container()
