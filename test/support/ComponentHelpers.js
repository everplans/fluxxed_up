import ReactDOM from  'react-dom'

export function bla() {}

export class TestContext {
  constructor(component, done) {
    this.component = component
    this.done
  }
  render() {
    this.div = document.createElement('div');
    this.node = ReactDOM.render(this.component, this.div, this.renderCallback.bind(this))
    return this.node
  }
  renderCallback() {
    this.done()
  }
}
