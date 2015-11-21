/* global expect */
import ActionPrototype from '../../src/lib/ActionPrototype'
import StorePrototype from '../../src/lib/StorePrototype'
import Dispatcher from '../../src/lib/ep-dispatcher'
import assign from 'object-assign'
import KeyMirror from 'keymirror'
import React from 'react/addons'
import TestRig from '../../src/testUtils/TestRig.react'

var TestAction = assign(ActionPrototype, {
  Types: KeyMirror({
    GOT_THING: null,
    NOTHING: null
  }),
  fetchThing: function() {
    // Actually fire the API:
    Dispatcher.dispatch({
      actionType: TestAction.Types.GOT_THING,
      data: {foo: 'bar'}
    })
  },
  fetchWithWrongDispatch: function() {
    Dispatcher.dispatch({
      actionType: TestAction.Types.NOTHING,
      data: {foo: 'bar'}
    })
  }
})

var TestStore = StorePrototype(TestAction.Types.GOT_THING)

var TestComponent = React.createClass({
  getInitialState: function() {
    return {
      value: 'initial value'
    }
  },
  handleSubmit: function() {
    this.setState({value: $(this.refs.value.getDOMNode()).val()})
  },
  render: function() {
    return (
      <div>
        <h1>Test Component</h1>
        <div className='answer'>Form Value: {this.state.value}</div>
        <input ref='value' defaultValue={this.state.value} />
        <a onClick={this.handleSubmit}>Submit</a>
      </div>
    )
  }
})

describe('Fluxxed up test helpers', function() {
  describe('Action helpers', function() {
    it('dispatches to test store', function(done) {
      expect(TestAction.fetchThing).to.eventually(done).informRegisteredStore(TestStore)
    })

    it('wrong action will not notify the store', function(done) {
      expect(TestAction.fetchWithWrongDispatch).to.not.eventually(done).informRegisteredStore(TestStore)
    })
  })

  describe('Component Helpers', function() {
    var domNode
    var node

    beforeEach(() => {
      // TODO: either expose a method for this OR use old school way.
      node = React.render(<TestComponent/>, document.createElement('div'))
      domNode = $(node.getDOMNode())
    })

    afterEach(() => {
      React.unmountComponentAtNode(React.findDOMNode(node).parentNode)
    })

    it('renders', () => {
      expect(domNode.find('h1')).to.have.text('Test Component')
    })

    it('has a value in the text box', () => {
      expect(domNode.find('input').val()).to.equal('initial value')
    })

    it('has a value in the page', () => {
      expect(domNode.find('.answer').text()).to.match(/initial value$/)
    })
  })

  describe('Test Rig', function() {
    var rig = new TestRig()

    beforeEach(() => {
      rig.boltOn(<TestComponent />)
    })

    afterEach(() => {
      rig.boltOff()
    })

    it('updates the form', (done) => {
      // Manipulate the DOM:
      rig.fillIn('input', 'new thing')
      rig.clickLink('Submit')

      // Set the expectations:
      // (TODO: make these Chai DSL.)
      rig.setExpectationCallback(() => {
        expect(rig.domNode.find('.answer').text()).to.match(/new thing$/)
        done()
      })

      // Signal that test should be finished:
      rig.finish()
    })
  })
})
