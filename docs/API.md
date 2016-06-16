# API Reference

- [Testing](#testing)

## Testing

### `TestRig`
Primary way to deterministicly test React components. You bolt a component onto the rig (set up), test it; and when you're done, you bolt it off (clean up/teardown).

#### Lifecycle Methods
##### `boltOn(<TestComponent/>)`
Set up a component for testing. This literally calls `ReactDOM.render` under the hood, and renders it to a detached DOM element. Do this first, usually in a `beforeEach` kind of block.

```js
import SomeComponent from 'components/foo'
let rig = new TestRig()
rig.boltOn(<SomeComponent/>)
```

##### `boltOff()`
Remove the test component from the DOM. You must call this cleanup to avoid React warnings, and potetial non-idempotent side-effect failures. Usually called in a `afterEach` kind of block.

```js
rig.boltOff()
```

##### `setExpectationCallback(expectationCallback)`
Set a callback to be called when the DOM has finished it's final render. You can trigger the final render by calling the `finish` method. Here you would wrap your test expectations/assertions in a function. You'll want to use a framework that can handle async testing, and most likely you would call your test framework's `done` callback and the end, so that test framework knows to expect the final assertions and move on to the next test. See example below for usage.

```js
<Router createElement={createElement} />

// default behavior
function createElement(Component, props) {
  // make sure you pass all the props in!
  return <Component {...props} />
}

// maybe you're using something like Relay
function createElement(Component, props) {
  // make sure you pass all the props in!
  return <RelayContainer Component={Component} routerProps={props} />
}
```

##### `finish()`
Trigger the final render/DOM update, and call the callback specified in `setExpectationCallback`. Make sure to set the callback before calling finish, and you will ensure that the DOM is in it's expected state.

#### 'screwOn(<TestComponent/>)'
Alias for `boltOn`, because PUNs.

#### 'screwOff()'
Alias for `boltOff`, because PUNs.

#### DOM Manipulation Methods

##### `clickButton(buttonText)`
Helper method to click an HTML `<button>` with a specific button text. Uses css selector `button:contains`. If you need to be more precise, try using `clickElement`.

```js
rig.clickButton('Login')
```

##### `clickLink(label)`
Helper method to click an HTML link with specific text. Uses css selector `a:contains`. If you need to be more precise, try using `clickElement`.

##### `clickElement(element)`
Will simulate the React click event on the `element`. Note, this should be a raw DOM element, if you use something like jQuery in your test environment, be sure to de-reference it. 

```js
var el = $('.some .crazy .selector')
var element = el[0] // deference the jQuery wrapper
rig.clickElement(element)
```

##### `fillIn(selector, value)`
Helper method to enter some value into a form input elememnt, and simluate the React change event. Finds the element via a css selector.

```js
rig.fillIn('input.firstName', 'Steve')
```

##### `fillInElement(element, value)
The same as `FillIn`, but with an explicit DOM elememnt instead of a selector. (Note, this actually expects a jquery wrapped element. This is inconsistent with the rest of the API, and in a follow release it will expect a raw DOM element.)

```js
rig.fillInElement($('input.firstName'), 'Steve')
```

##### `setValue(selector, value)`

##### `toggleCheckbox(selector)`
##### `toggleElement(element)`
##### `toggleRadioButton(selector)`

#### Examples


