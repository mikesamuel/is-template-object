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

/* eslint "global-require": off */

'use strict';

const getDescriptors = require('object.getownpropertydescriptors');
const { expect } = require('chai');
const { describe, it } = require('mocha');

function doesNotModifyArray(action) {
  const arrayBits = getDescriptors(Array);
  const result = action();
  expect(getDescriptors(Array)).to.deep.equals(arrayBits);
  return result;
}

function temporarilyPatch(withOld) {
  const old = Array.isTemplateObject;
  const hasOld = Object.hasOwnProperty.call(Array, 'isTemplateObject');
  delete Array.isTemplateObject;
  try {
    withOld(old);
  } finally {
    if (hasOld) {
      Array.isTemplateObject = old;
    } else {
      delete Array.isTemplateObject;
    }
  }
}

describe('es-shim-api compatibility', () => {
  const base = '..';

  const defaultExport = doesNotModifyArray(() => require(base));

  // https://github.com/es-shims/es-shim-api

  // require('foo') is a spec-compliant JS or native
  // function. However, if the function’s behavior depends on a
  // receiver (a “this” value), then the first argument to this
  // function will be used as that receiver. The package should
  // indicate if this is the case in its README.
  it('exports compliant function', () => {
    doesNotModifyArray(() => {
      expect({
        name: defaultExport.name,
        type: typeof defaultExport,
      }).to.deep.equal({
        name: 'isTemplateObject',
        type: 'function',
      });
    });
    // We test spec-compliance elsewhere.
  });

  describe('implementation', () => {
    // require('foo').implementation or require('foo/implementation') is
    // a spec-compliant JS function, that will depend on a receiver (a
    // “this” value) as the spec requires.
    it('.implementation', () => {
      doesNotModifyArray(() => {
        expect(require(base).implementation).to.equal(defaultExport);
      });
    });
    it('/implementation', () => {
      doesNotModifyArray(() => {
        expect(require(`${ base }/implementation`)).to.equal(defaultExport);
      });
    });
  });

  describe('polyfill', () => {
    // require('foo').getPolyfill or require('foo/polyfill') is a
    // function that when invoked, will return the most compliant and
    // performant function that it can - if a native version is
    // available, and does not violate the spec, then the native
    // function will be returned - otherwise, either the implementation,
    // or a custom, wrapped version of the native function, will be
    // returned. This is also the result that will be used as the
    // default export.
    it('.getPolyfill', () => {
      doesNotModifyArray(() => {
        expect(require(base).getPolyfill()).to.equal(Array.isTemplateObject || defaultExport);
      });
    });
    it('/polyfill', () => {
      doesNotModifyArray(() => {
        expect(require(`${ base }/polyfill`)()).to.equal(Array.isTemplateObject || defaultExport);
      });
    });
  });

  describe('shim', () => {
    // require('foo').shim or require('foo/shim') is a function that
    // when invoked, will call getPolyfill, and if the polyfill doesn’t
    // match the built-in value, will install it into the global
    // environment.
    it('.shim', () => {
      doesNotModifyArray(() => {
        const { shim } = require(base);
        expect({
          name: shim.name,
          length: shim.length,
          type: typeof shim,
        }).to.deep.equal({
          name: 'shim',
          length: 0,
          type: 'function',
        });
      });
    });

    it('/shim', () => {
      doesNotModifyArray(() => {
        const shim = require(`${ base }/shim`);
        expect({
          name: shim.name,
          length: shim.length,
          type: typeof shim,
        }).to.deep.equal({
          name: 'shim',
          length: 0,
          type: 'function',
        });
      });
    });

    it('does not clobber', () => {
      // does nothing if the polyfill doesn't match the built-in value.
      temporarilyPatch((old) => {
        function isTemplateObject(x) {
          throw new Error(`placeholder that should not be called ${ x }`);
        }
        if (!old) {
          Array.isTemplateObject = isTemplateObject;
        }
        require(base).shim();
        expect(Array.isTemplateObject).equals(old || isTemplateObject);
      });
    });
  });

  // require('foo/auto') will automatically invoke the shim method.
  it('/auto', () => {
    temporarilyPatch(() => {
      require(`${ base }/auto`);
      const { isTemplateObject } = Array;
      const {
        writable,
        enumerable,
        configurable,
      } = Object.getOwnPropertyDescriptor(Array, 'isTemplateObject');

      expect({
        name: isTemplateObject.name,
        length: isTemplateObject.length,
        type: typeof isTemplateObject,
        writable,
        enumerable,
        configurable,
      }).to.deep.equal({
        name: 'isTemplateObject',
        length: 1,
        type: 'function',
        writable: true,
        enumerable: false,
        configurable: true,
      });
    });
  });
});
