import assign from 'object-assign'
import React from 'react'

export default (Component, props, stubs) => {
  const RouterStub = assign(
    {
      createHref() {},
      getCurrentParams () {},
      getCurrentPath () {},
      getCurrentPathname () {},
      getCurrentQuery () {},
      getCurrentRoutes () {},
      goBack () {},
      isActive () {},
      makePath () {},
      push () {},
      replace () {}
    },
    stubs  // Pass additional empty functions as necessary.
  )

  return React.createClass({
    childContextTypes: {router: React.PropTypes.func},
    getChildContext () { return {router: RouterStub} },

    render () { return <Component {...this.props} /> }
  })
}
