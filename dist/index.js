'use strict';

exports.__esModule = true;

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libActionPrototype = require('./lib/ActionPrototype');

var _libActionPrototype2 = _interopRequireDefault(_libActionPrototype);

exports.ActionPrototype = _libActionPrototype2['default'];

var _libExtra_storage = require('./lib/extra_storage');

var _libExtra_storage2 = _interopRequireDefault(_libExtra_storage);

exports.ExtraStorage = _libExtra_storage2['default'];

var _libEpDispatcher = require('./lib/ep-dispatcher');

var _libEpDispatcher2 = _interopRequireDefault(_libEpDispatcher);

exports.Dispatcher = _libEpDispatcher2['default'];

var _libJsonFetcher = require('./lib/jsonFetcher');

var _libJsonFetcher2 = _interopRequireDefault(_libJsonFetcher);

exports.JsonFetcher = _libJsonFetcher2['default'];

//export FeatureFlags from './lib/FeatureFlags' -- haven;t quite figured out the singleton pattern here

var _testUtils = require('./testUtils');

_defaults(exports, _interopExportWildcard(_testUtils, _defaults));