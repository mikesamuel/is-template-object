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

/**
 * @fileoverview
 * Complies with github.com/es-shims/es-shim-api#how-to-denote-compliance
 * > require('foo').implementation or require('foo/implementation') is a
 * > spec-compliant JS function, that will depend on a receiver (a
 * > “this” value) as the spec requires.
 */

module.exports = require('./index').implementation;
