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

// TODO: should I use es-abstract here instead?
const { isArray, isTemplateObject: nativeImpl } = Array;
const { defineProperty, hasOwnProperty, isFrozen } = Object;
const { apply } = Reflect;
const implementationName = 'isTemplateObject';

function isFrozenStringArray(arr) {
  if (isArray(arr) && isFrozen(arr)) {
    const { length } = arr;
    for (let i = 0; i < length; ++i) {
      if (typeof arr[i] !== 'string') {
        return false;
      }
    }
    return true;
  }
  return false;
}

function isTemplateObject(x) {
  // TODO: actually implement this properly
  return isFrozenStringArray(x) && isFrozenStringArray(x.raw);
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
      const Array = [].constructor;
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
