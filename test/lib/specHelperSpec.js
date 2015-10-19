import ActionPrototype from '../../src/lib/ActionPrototype'
import StorePrototype from '../../src/lib/StorePrototype'
import Dispatcher from '../../src/lib/ep-dispatcher'
import assign from 'object-assign'
import KeyMirror from 'keymirror'
//import * as FUHelpers from '../support/ComponentHelpers'
import React from 'react/addons'
import TestRig from '../../src/testUtils/TestRig.react'

var TestUtils = React.addons.TestUtils;

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

var TestComponent = React.createClass({
  getInitialState: function() {
    return {
      value: 'initial value'
    };
  },
  handleSubmit: function() {
    var value = $(this.refs.value.getDOMNode()).val()
    this.setState({value: value})
  },
  render: function() {
    return (
      <div><h1>Test Component</h1>
        <div className='answer'>Form Value: {this.state.value}</div>
        <input ref='value' defaultValue={this.state.value}/>
        <a onClick={this.handleSubmit}>Submit</a>
      </div>
    )
  }
})

describe("Fluxxed up test helpers", function() {

  describe("Action helpers", function() {
    it("dispatches to test store", function(done) {
      expect(TestAction.fetchThing).to.eventually(done).informRegisteredStore(TestStore)
    })

    it("wrong action will not notify the store", function(done) {
      expect(TestAction.fetchWithWrongDispatch).to.not.eventually(done).informRegisteredStore(TestStore)
    })
  })

  describe("Component Helpers", function() {
    var node, domNode, context

    beforeEach(()=> {
      var div = document.createElement('div');
      node = React.render(<TestComponent/>, div)
      domNode = $(node.getDOMNode())
    })

    afterEach(()=> {
      React.unmountComponentAtNode(React.findDOMNode(node).parentNode);
    })

    it("renders", ()=> {
      expect(domNode.find('h1').text()).to.equal('Test Component')
    })

    it("has a value in the text box", ()=> {
      expect(domNode.find('input').val()).to.equal('initial value')
    })

    it("has a value in the page", ()=> {
      expect(domNode.find('.answer').text()).to.match(/initial value$/)
    })

    it("updates the form", (done)=> {

      var div = document.createElement('div');
      var holder = {fire: function() {console.log('hi')}}
      var otherDomNode
      var childContext = {finish: ()=> {
        expect(otherDomNode.find('.answer').text()).to.match(/new thing$/) 
        done()
      } }
      React.withContext(childContext, ()=> {
        otherDomNode = $(React.render(<TestRig><TestComponent/></TestRig>, div, ()=>{holder.fire()}).getDOMNode())
      })

      otherDomNode.find('input').val('new thing')

      TestUtils.Simulate.click(otherDomNode.find('a').get(0))
      window.doIt();

      var button = otherDomNode.find('a')
    })
  })
})

