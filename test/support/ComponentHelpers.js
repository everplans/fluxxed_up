import React from  'react/addons'



  export function bla() {}

  export class TestContext {
    constructor(component, done) {
      this.component = component
      this.done
    }
    render() {
      this.div = document.createElement('div');
      this.node = React.render(this.component, this.div, this.renderCallback.bind(this))
      return this.node
    }
    renderCallback() {
      this.done()
    }
  }