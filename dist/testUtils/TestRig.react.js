'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var TestUtils = _reactAddons2['default'].addons.TestUtils;

var TestRigComponent = (function (_React$Component) {
  _inherits(TestRigComponent, _React$Component);

  function TestRigComponent(props) {
    _classCallCheck(this, TestRigComponent);

    _React$Component.call(this, props);
    this.state = { keyVal: Math.random(), testComplete: false };
  }

  TestRigComponent.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (this.state.testComplete === true) this.state.expectationCallback();
  };

  TestRigComponent.prototype.triggerFinalRender = function triggerFinalRender() {
    this.setState({ testComplete: true });
    // this.setState({keyVal: Math.random()}) -- probably don't need this anymore, but holding onto just in case it's useful again
  };

  TestRigComponent.prototype.setExpectationCallback = function setExpectationCallback(expectationCallback) {
    this.setState({ expectationCallback: expectationCallback });
  };

  TestRigComponent.prototype.render = function render() {
    return _reactAddons2['default'].createElement(
      'div',
      { key: this.state.keyval },
      this.props.children
    );
  };

  return TestRigComponent;
})(_reactAddons2['default'].Component);

exports.TestRigComponent = TestRigComponent;

var TestRig = (function () {
  function TestRig(TestComponent) {
    _classCallCheck(this, TestRig);

    if (TestComponent) this.boltOn(TestComponent);

    this.screwOn = this.boltOn;
    this.screwOff = this.boltOff;
  }

  /*
  TODOS:
    1. Figure out to fire an error if the expecation callback block is never fired.
    2. Be able to add expectations in a chain, and then fire them all at once.
    3. Make firing the expectations an explicit thing, so that an accidental re-render doesn't mess things up.
  */

  TestRig.prototype.boltOn = function boltOn(TestComponent) {
    this.div = document.createElement('div');
    this.component = _reactAddons2['default'].render(_reactAddons2['default'].createElement(
      TestRigComponent,
      null,
      TestComponent
    ), this.div);
    this.domNode = $(_reactAddons2['default'].findDOMNode(this.component));
  };

  TestRig.prototype.boltOff = function boltOff() {
    _reactAddons2['default'].unmountComponentAtNode(this.div);
  };

  TestRig.prototype.setExpectationCallback = function setExpectationCallback(expectationCallback) {
    this.component.setState({ expectationCallback: expectationCallback });
  };

  TestRig.prototype.finish = function finish() {
    this.component.triggerFinalRender();
  };

  TestRig.prototype.clickButton = function clickButton(buttonText) {
    var element = this.domNode.find('button:contains(\'' + buttonText + '\')')[0];
    this.clickElement(element);
  };

  TestRig.prototype.clickLink = function clickLink(label) {
    var element = this.domNode.find('a:contains(\'' + label + '\')')[0];
    this.clickElement(element);
  };

  // In the event of a gnarly css selector, just pass the element:
  TestRig.prototype.clickElement = function clickElement(element) {
    TestUtils.Simulate.click(element);
  };

  TestRig.prototype.fillIn = function fillIn(selector, value) {
    var element = this.domNode.find(selector);
    this.fillInElement(element, value);
  };

  TestRig.prototype.toggleCheckbox = function toggleCheckbox(selector) {
    var element = this.domNode.find(selector); // Selector should be specific to the checkbox
    $(element).prop('checked', !$(element)[0].checked);
    TestUtils.Simulate.change(element);
  };

  TestRig.prototype.fillInElement = function fillInElement(element, value) {
    element.val(value);
    var rawElement = element.jquery ? element[0] : element; // React doesn't like dealing with a jQuery wrapper.
    TestUtils.Simulate.change(rawElement);
  };

  return TestRig;
})();

exports['default'] = TestRig;