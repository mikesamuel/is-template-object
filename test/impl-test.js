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
    raw = [...arr];
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
      expect(isTemplateObject(addraw([]))).to.be.false;
    });
    it('numbers not recognized', () => {
      expect(isTemplateObject(addraw([1]))).to.be.false;
    });
    it('unfrozen strings', () => {
      expect(isTemplateObject(addraw(['a', 'b'], { freeze: false }))).to.be.false;
    });
    it('unfrozen raw', () => {
      expect(isTemplateObject(addraw(['a', 'b'], { freezeRaw: false }))).to.be.false;
    });
    it('mismatched lengths', () => {
      expect(isTemplateObject(addraw(['a', 'b'], { raw: ['a'] }))).to.be.false;
    });
    it('missing raw not null', () => {
      expect(isTemplateObject(addraw(['a', 'b'], { raw: () => undefined }))).to.be.false;
    });
  });
  describe('positive', () => {
    it('a, b', () => {
      expect(isTemplateObject`a ${ null } b`).to.be.true;
    });
    it('bad escape', () => {
      expect(isTemplateObject`\x`).to.be.true;
    });
  });
});
