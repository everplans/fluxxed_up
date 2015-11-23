import ActionPrototype from '../../src/lib/ActionPrototype'
import StorePrototype from '../../src/lib/StorePrototype'
import Dispatcher from '../../src/lib/ep-dispatcher'
import assign from 'object-assign'
import KeyMirror from 'keymirror'
//import * as FUHelpers from '../support/ComponentHelpers'
import React from 'react/addons'
import TestRig from '../../src/testUtils/TestRig.react'

var TestAction = assign(ActionPrototype, {
  Types: KeyMirror({
    GOT_THING: null,
    NOTHING: null
  }),
  fetchThing: function() {
    //actually fire API
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

class TestComponent  extends React.Component{
  constructor(props) {
    super(props)
    this.state = {value: 'initial value'}
  }
  getVal(e) {
    e.preventDefault()
    this.setState({formVal: e.target.value})
  }
  handleSubmit() {
    //not that this is simulating some other side effect of clicking the button (like server response after a click)
    //but this just shows something already set in state
    this.setState({value: this.state.formVal})
  }
  render() {
    return (
      <div><h1>Test Component</h1>
        <div className='answer'>Form Value: {this.state.value}</div>
        <input ref='value' onChange={this.getVal.bind(this)} defaultValue={this.state.value}/>
        <a onClick={this.handleSubmit.bind(this)}>Submit</a>
      </div>
    )
  }
}

describe("Fluxxed up test helpers", function() {

  describe("Action helpers", function() {
    it("dispatches to test store", function(done) {
      expect(TestAction.fetchThing).to.eventually(done).informRegisteredStore(TestStore)
    })

    it("wrong action will not notify the store", function(done) {
      expect(TestAction.fetchWithWrongDispatch).to.not.eventually(done).informRegisteredStore(TestStore)
    })
  })

  describe("Test Rig", function() {
    var rig = new TestRig()
    beforeEach(()=>{
      rig.boltOn(TestComponent)
    })
    afterEach(()=>{
      rig.boltOff()
    })

    it("renders", ()=> {
      expect(rig.domNode.find('h1').text()).to.equal('Test Component')
    })

    it("has a value in the text box", ()=> {
      expect(rig.domNode.find('input').val()).to.equal('initial value')
    })

    it("has a value in the page", ()=> {
      expect(rig.domNode.find('.answer').text()).to.match(/initial value$/)
    })

    it("updates the form", (done)=> {

      //manipulate the dom
      rig.fillIn('input', 'new thing')
      rig.clickLink('Submit')

      //set up your expectations (TODO, make these chai dsl)
      rig.setExpectationCallback(()=> {
        expect(rig.domNode.find('.answer').text()).to.match(/new thing$/)
        done()
      })

      //signal test to be finished
      rig.finish()

    })
  })
})

