# is-template-object

provides an [ES Shim](https://github.com/es-shims/es-shim-api) for the
[Array.isTemplateObject](https://github.com/tc39/proposal-array-is-template-object)
proposal.

```js
const { isTemplateObject } = require('is-template-object');

// Here's a use of a tagged template literal.
let y =  tag`rawText ${ expr } rawText`
// This tagged template literal calls tag like
//    tag(['rawText ', ' rawText'], expr)
// but the array it passes is a special array called a template object.

// Define a function that we can use with tagged templates.
function tag(templateObject, expr) {
  // Sometimes the tag function would like to know if it got a template object.

  if (// True if templateObject contains strings from a literal instead of
      // strings from a trusted author instead of strings that might be
      // controlled by an attacker
      isTemplateObject(templateObject)
      // and the template object came from this realm.
      && templateObject instanceof Array) {

    // Do something that treats the strings in templateObject as content
    // from a trusted author, but which treats expr as possibly
    // attacker-controlled.
  } else {
    // Do not trust templateObject's content or maybe treat as a non-tag call.
  }
}

// We don't know whether `x` and `y` came from an attacker or from a trusted source.
// tag does not to take the trusting path.
tag([ x, y ], expr);
```
