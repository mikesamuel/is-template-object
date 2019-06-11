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

const { expect } = require('chai');
const { describe, it } = require('mocha');

const isTemplateObject = require('../.');

function addraw(
  arr,
  {
    freeze = true,
    freezeRaw = true,
    raw = 'copy',
  } = {}) {
  if (raw === 'copy') {
    raw = [ ...arr ];
  }
  if (typeof raw === 'function') {
    raw = raw();
  }
  arr.raw = raw;

  if (freezeRaw && raw && typeof raw === 'object') {
    Object.freeze(raw);
  }
  if (freeze) {
    Object.freeze(arr);
  }
  return arr;
}

describe('impl', () => {
  describe('negative', () => {
    it('empty', () => {
      expect(isTemplateObject(addraw([]))).to.equal(false);
    });
    it('numbers not recognized', () => {
      expect(isTemplateObject(addraw([ 1 ]))).to.equal(false);
    });
    it('unfrozen strings', () => {
      expect(isTemplateObject(addraw([ 'a', 'b' ], { freeze: false }))).to.equal(false);
    });
    it('unfrozen raw', () => {
      expect(isTemplateObject(addraw([ 'a', 'b' ], { freezeRaw: false }))).to.equal(false);
    });
    it('mismatched lengths', () => {
      expect(isTemplateObject(addraw([ 'a', 'b' ], { raw: [ 'a' ] }))).to.equal(false);
    });
    it('missing raw not null', () => {
      // eslint-disable-next-line no-undefined
      expect(isTemplateObject(addraw([ 'a', 'b' ], { raw: () => undefined }))).to.equal(false);
    });
  });
  describe('positive', () => {
    it('a, b', () => {
      expect(isTemplateObject`a ${ null } b`).to.equal(true);
    });
    it('bad escape', () => {
      // These uses of eval let eslint parse most of this file while still testing
      // isTemplateObject against an input that was problematic in earlier versions
      // of EcmaScript but which is valid in modern versions.
      try {
        // eslint-disable-next-line no-eval
        eval(' (function () {})`\\x` ');
      } catch (exc) {
        // On old JS engine
        return;
      }
      // eslint-disable-next-line no-eval
      expect(eval(' isTemplateObject`\\x` ')).to.equal(true);
    });
  });
});
