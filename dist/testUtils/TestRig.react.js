'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestRigComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _addons = require('react/addons');

var _addons2 = _interopRequireDefault(_addons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var TestUtils = _addons2.default.addons.TestUtils;

var TestRigComponent = exports.TestRigComponent = function (_React$Component) {
  _inherits(TestRigComponent, _React$Component);

  function TestRigComponent(props) {
    _classCallCheck(this, TestRigComponent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TestRigComponent).call(this, props));

    _this.state = { keyVal: Math.random(), testComplete: false };
    return _this;
  }

  _createClass(TestRigComponent, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.state.testComplete === true) this.state.expectationCallback();
    }
  }, {
    key: 'triggerFinalRender',
    value: function triggerFinalRender() {
      this.setState({ testComplete: true });
      // this.setState({keyVal: Math.random()}) -- probably don't need this anymore, but holding onto just in case it's useful again
    }
  }, {
    key: 'setExpectationCallback',
    value: function setExpectationCallback(expectationCallback) {
      this.setState({ expectationCallback: expectationCallback });
    }
  }, {
    key: 'render',
    value: function render() {
      return _addons2.default.createElement(
        'div',
        { key: this.state.keyval },
        this.props.children
      );
    }
  }]);

  return TestRigComponent;
}(_addons2.default.Component);

var TestRig = function () {
  function TestRig(TestComponent) {
    _classCallCheck(this, TestRig);

    if (TestComponent) this.boltOn(TestComponent);

    this.screwOn = this.boltOn;
    this.screwOff = this.boltOff;
  }

  _createClass(TestRig, [{
    key: 'boltOn',
    value: function boltOn(TestComponent) {
      this.div = document.createElement('div');
      this.component = _addons2.default.render(_addons2.default.createElement(
        TestRigComponent,
        null,
        TestComponent
      ), this.div);
      this.domNode = $(_addons2.default.findDOMNode(this.component));
    }
  }, {
    key: 'boltOff',
    value: function boltOff() {
      _addons2.default.unmountComponentAtNode(this.div);
    }
  }, {
    key: 'setExpectationCallback',
    value: function setExpectationCallback(expectationCallback) {
      this.component.setState({ expectationCallback: expectationCallback });
    }
  }, {
    key: 'finish',
    value: function finish() {
      this.component.triggerFinalRender();
    }
  }, {
    key: 'clickButton',
    value: function clickButton(buttonText) {
      var element = this.domNode.find('button:contains(\'' + buttonText + '\')')[0];
      this.clickElement(element);
    }
  }, {
    key: 'clickLink',
    value: function clickLink(label) {
      var element = this.domNode.find('a:contains(\'' + label + '\')')[0];
      this.clickElement(element);
    }
    // In the event of a gnarly css selector, just pass the element:
  }, {
    key: 'clickElement',
    value: function clickElement(element) {
      TestUtils.Simulate.click(element);
    }
  }, {
    key: 'fillIn',
    value: function fillIn(selector, value) {
      var element = this.domNode.find(selector);
      this.fillInElement(element, value);
    }
  }, {
    key: 'toggleCheckbox',
    value: function toggleCheckbox(selector) {
      var element = this.domNode.find(selector); // Selector should be specific to the checkbox
      $(element).prop('checked', !$(element)[0].checked);
      TestUtils.Simulate.change(element[0]);
    }
  }, {
    key: 'fillInElement',
    value: function fillInElement(element, value) {
      element.val(value);
      var rawElement = element.jquery ? element[0] : element; // React doesn't like dealing with a jQuery wrapper.
      TestUtils.Simulate.change(rawElement);
    }
  }]);

  return TestRig;
}();

/*
TODOS:
  1. Figure out to fire an error if the expecation callback block is never fired.
  2. Be able to add expectations in a chain, and then fire them all at once.
  3. Make firing the expectations an explicit thing, so that an accidental re-render doesn't mess things up.
*/


exports.default = TestRig;