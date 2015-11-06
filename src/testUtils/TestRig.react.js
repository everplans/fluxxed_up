import React from 'react/addons'
var TestUtils = React.addons.TestUtils

export class TestRigComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { keyVal : Math.random(), testComplete: false }
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.testComplete=== true)
      this.state.expectationCallback()
  }

  triggerFinalRender() {
    this.setState({testComplete: true})
    //this.setState({keyVal: Math.random()}) -- probably don't need this anymore, but holding onto just in case it's useful again
  }

  render() {
    return <div key={this.state.keyval}>{this.props.children}</div>
  }

  setExpectationCallback(expectationCallback) {
    this.setState({expectationCallback})
  }
}

export default class TestRig {
  constructor(TestComponent) {
    if (TestComponent) this.boltOn(TestComponent)
  }

  boltOn(TestComponent) {
    this.div = document.createElement('div');
    this.component = React.render(<TestRigComponent><TestComponent/></TestRigComponent>, this.div)
    this.domNode = $(React.findDOMNode(this.component))
  }

  boltOff() {
    React.unmountComponentAtNode(this.div)
  }

  setExpectationCallback(expectationCallback) {
    this.component.setState({expectationCallback})
  }

  finish() { this.component.triggerFinalRender() }

  clickButton(label) {
    var element = this.domNode.find("button:contains('" + label + "')")[0]
    this.clickElement(element);
  }

  clickLink(label) {
    var element = this.domNode.find("a:contains('" + label + "')")[0]
    this.clickElement(element)
  }
  //in the event of a gnarly css selector, just pass the element
  clickElement(element) {
    TestUtils.Simulate.click(element)
  }

  fillIn(selector, value){
    var element = this.domNode.find(selector)
    this.fillInElement(element, value)
  }

  fillInElement(element, value) {
    element.val(value)
  }
}


/*
//TODOS:
1--Figure out to fire an error if the expecation callback block is never fired. 
2--be able to add expecatoins in a chain, and then fire them all at once
3--make firing the expectations an explicity thing, so that an accidenttal re-render doesn't mess things up
*/