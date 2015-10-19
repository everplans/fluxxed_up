import React from 'react'

var TestRig = React.createClass({
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
  componentDidMount: function() {
    window.doIt = this.triggerFinalRender
  },
  triggerFinalRender: function() {
    this.setState({keyVal: Math.random()})
  },
  render() {
    return <div key={this.state.keyval}>{this.props.children}</div>
  }
})

export default TestRig
