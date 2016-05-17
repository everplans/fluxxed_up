/* global expect */
import ActionPrototype from '../../src/lib/ActionPrototype'
import StorePrototype from '../../src/lib/StorePrototype'
import Dispatcher from '../../src/lib/fu-dispatcher'
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

class TestComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: 'initial value', formVal: []}
  }
  getVal(e) {
    e.preventDefault()
    this.setState({formVal: this.state.formVal.concat(e.target.value)})
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
        <input name='text-input' ref='value' onChange={this.getVal.bind(this)} defaultValue={this.state.value} />
        <input id='checkbox-input' onChange={this.getVal.bind(this)} type='checkbox' ref='checkValue' />
        <input className='radio-input' onChange={this.getVal.bind(this)} type='radio' />
        <select className='select-input' onChange={this.getVal.bind(this)}>
          <option name='month'>Month</option>
          <option value='1'>January</option>
          <option value='2'>February</option>
        </select>
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

  describe('Test Rig', function() {
    var rig = new TestRig()

    beforeEach(() => {
      rig.screwOn(<TestComponent />)
    })

    afterEach(() => {
      rig.screwOff()
    })

    it('renders', () => {
      expect(rig.domNode.find('h1').text()).to.equal('Test Component')
    })

    it('has a value in the text box', () => {
      expect(rig.domNode.find('input').val()).to.equal('initial value')
    })


    it('has a value in the page', () => {
      expect(rig.domNode.find('.answer').text()).to.match(/initial value/)
    })

    it('updates the form', (done) => {
      // Manipulate the DOM:
      rig.fillIn('input[name="text-input"]', 'new thing')

      rig.toggleCheckbox('#checkbox-input')
      rig.setValue('.select-input', '1')

      rig.clickLink('Submit')
      // Set the expectations:
      // (TODO: make these Chai DSL.)
      rig.setExpectationCallback(() => {
        expect(rig.domNode.find('.answer').text()).to.match(/new thing/)
        expect(rig.domNode.find('.answer').text()).to.match(/on/)
        expect(rig.domNode.find('.answer').text()).to.match(/1/)
        done()
      })

      // Signal that test should be finished:
      rig.finish()
    })

    it('updates the form when radio button is clicked', (done) => {
      rig.toggleRadioButton('.radio-input')
      rig.clickLink('Submit')

      rig.setExpectationCallback(() => {
        expect(rig.domNode.find('.answer').text()).to.match(/on/)
        done()
      })

      rig.finish()
    })

    it('changes dom state of elements', (){
      rig.toggleCheckbox('#checkbox-input')
      rig.setValue('.select-input', '1')
      rig.toggleRadioButton('.radio-input')

      expect(rig.domNode.find('#checkbox-input')[0].checked).to.match(/true/)
      expect(rig.domNode.find('.select-input')[0].value).to.equal('1')
      expect(rig.domNode.find('.radio-input')[0].checked).to.equal(true)

    })
  })
})
