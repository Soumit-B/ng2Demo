import 'core-js/es5/index';
import 'core-js/es6/array';
import 'core-js/es6/object';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/string';
import 'core-js/es6/symbol';
import 'core-js/es6/promise';
import 'core-js/es6/function';
import 'core-js/es6/index';
import 'core-js/es7/reflect';
import 'core-js/es7/observable';
import 'core-js/es7/index';
import 'core-js/fn/array/includes';
import 'core-js/fn/object/assign';
import 'core-js/shim';
import 'zone.js/dist/zone';
import 'ts-helpers';
if (process.env.NODE_ENV === 'development') {
    Error.stackTraceLimit = Infinity;
    require('zone.js/dist/long-stack-trace-zone');
}
