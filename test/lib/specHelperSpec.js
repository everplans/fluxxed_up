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

class TestComponent  extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: 'initial value'}
  }
  getVal(e) {
    e.preventDefault()
    this.setState({formVal: e.target.value})
  }
  handleSubmit() {
    // Not that this is simulating some other side effect of clicking the button (like server response after a click),
    // but this just shows something already set in state
    this.setState({value: this.state.formVal})
  }
  render() {
    return (
      <div>
        <h1>Test Component</h1>
        <div className='answer'>Form Value: {this.state.value}</div>
        <input ref='value' onChange={this.getVal.bind(this)} defaultValue={this.state.value} />
        <input id='checkboxInput' type='checkbox' ref='checkValue' onChange={this.getVal.bind(this)} />
        <a onClick={this.handleSubmit.bind(this)}>Submit</a>
      </div>
    )
  }
}

describe('Fluxxed up test helpers', function() {
  describe('Action helpers', function() {
    it('dispatches to test store', function(done) {
      expect(TestAction.fetchThing).to.eventually(done).informRegisteredStore(TestStore)
    })

    it('wrong action will not notify the store', function(done) {
      expect(TestAction.fetchWithWrongDispatch).to.not.eventually(done).informRegisteredStore(TestStore)
    })
  })
  describe("Test Rig", function() {
    var rig = new TestRig()

    beforeEach(() => {
      rig.boltOn(<TestComponent />)
    })

    afterEach(() => {
      rig.boltOff()
    })

    it("renders", () => {
      expect(rig.domNode.find('h1').text()).to.equal('Test Component')
    })

    it("has a value in the text box", () => {
      expect(rig.domNode.find('input').val()).to.equal('initial value')
    })

    it("has a value in the page", () => {
      expect(rig.domNode.find('.answer').text()).to.match(/initial value$/)
    })

    it('updates the form', (done) => {
      // Manipulate the DOM:
      rig.fillIn('input', 'new thing')
      rig.clickLink('Submit')
      rig.toggleCheckbox('#checkboxInput')

      // Set the expectations:
      // (TODO: make these Chai DSL.)
      rig.setExpectationCallback(() => {
        expect(rig.domNode.find('.answer').text()).to.match(/new thing$/)
        expect(rig.domNode.find('#checkboxInput')[0].checked).to.match(/true/)
        done()
      })

      // Signal that test should be finished:
      rig.finish()
    })
  })
})
