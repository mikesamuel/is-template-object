/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/* eslint "no-var": off, "prefer-destructuring": off */

// TODO: should I use es-abstract here instead?
var isArray = Array.isArray;
var nativeImpl = Array.isTemplateObject;
var defineProperty = Object.defineProperty;
var hasOwnProperty = Object.hasOwnProperty;
var isFrozen = Object.isFrozen;
var apply = Reflect.apply;
var implementationName = 'isTemplateObject';

function isFrozenStringArray(arr, allowUndefined) {
  if (isArray(arr) && isFrozen(arr)) {
    for (var i = 0, length = arr.length; i < length; ++i) {
      var type = typeof arr[i];
      if (!(type === 'string' || (allowUndefined && type === 'undefined'))) {
        return false;
      }
    }
    return length !== 0;
  }
  return false;
}

function isTemplateObject(x) {
  // TODO: actually implement this properly
  if (!isFrozenStringArray(x, true)) {
    return false;
  }
  var raw = x.raw;
  if (!isFrozenStringArray(raw, false)) {
    return false;
  }
  // TODO: ideally we would not sample length here and in isFrozenStringArray
  // to avoid double hitting proxies.
  if (raw.length !== x.length) {
    return false;
  }
  return true;
}

defineProperty(
  isTemplateObject,
  'implementation',
  { value: isTemplateObject });

defineProperty(
  isTemplateObject,
  'getPolyfill',
  {
    // eslint-disable-next-line func-name-matching
    value: function getPolyfill() {
      return nativeImpl || isTemplateObject;
    },
  });

defineProperty(
  isTemplateObject,
  'shim',
  {
    // eslint-disable-next-line func-name-matching
    value: function shim() {
      var Array = [].constructor;
      if (!apply(hasOwnProperty, Array, [ implementationName ])) {
        defineProperty(
          Array,
          implementationName,
          {
            writable: true,
            configurable: true,
            value: isTemplateObject,
          });
      }
    },
  });

module.exports = isTemplateObject;
