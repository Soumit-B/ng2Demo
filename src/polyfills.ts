// Core-JS

import 'core-js/es5/index';
/*import 'core-js/es6/array';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/string';
import 'core-js/es6/symbol';
import 'core-js/es6/promise';
import 'core-js/es6/function';*/
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/promise';
import 'core-js/es6/index';
import 'core-js/es7/reflect';
import 'core-js/es7/observable';
import 'core-js/es7/index';
import 'core-js/fn/array/includes';
import 'core-js/fn/object/assign';
import 'core-js/shim';
/*import 'core-js/client/shim';*/
// Zone
import 'zone.js/dist/zone';

// Typescript helpers
import 'ts-helpers';


if (process.env.NODE_ENV === 'development') {
    Error.stackTraceLimit = Infinity;
    require('zone.js/dist/long-stack-trace-zone');
}

(function (): any {
  if (typeof window['CustomEvent'] === 'function') return false;
  function CustomEvent (event: any, params: any): any {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    let evt = document.createEvent('CustomEvent');
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }
  CustomEvent.prototype = window['Event'].prototype;
  window['CustomEvent'] = CustomEvent;
}) ();

