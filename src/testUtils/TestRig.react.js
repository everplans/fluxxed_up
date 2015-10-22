import React from 'react'

export var TestRigComponent = React.createClass({
  contextTypes: {
    triggerComplete: React.PropTypes.func.isRequired,
    finish: React.PropTypes.func
  },
  getInitialState: function() {
    return { keyVal : Math.random()};
  },
  componentDidUpdate: function(prevProps, prevState) {
    this.context.finish()
  },
  triggerFinalRender: function() {
    this.setState({keyVal: Math.random()})
  },
  render() {
    return <div key={this.state.keyval}>{this.props.children}</div>
  }
})

export default class TestRig {
  constructor(TestComponent, afterRender) {
    if (TestComponent) this.boltOn(TestComponent, afterRender)
    if (!afterRender) this.childContext = { finish: ()=>{console.log("No expectations")} }
  }

  boltOn(TestComponent, afterRender) {
    this.div = document.createElement('div');
    var domNode, component

    if (afterRender) this.childContext = {finish: afterRender }
    //TODO use the parent context thign since this is deprecated
    React.withContext(this.childContext, ()=> {
      component = React.render(<TestRigComponent ><TestComponent/></TestRigComponent>, this.div)
    })
    this.component = component
    this.domNode = $(component.getDOMNode())
  }

  finish() { this.component.triggerFinalRender() }
}




