# \<xtal-material\>

Dependency free material design V1 web components, based on Jon Uhlmann's [pure CSS material design form elements](https://codepen.io/jonnitto/pen/OVmvPB). 

The total size of the text input component is ~2kb gzip minified.  Despite being dependency free, the components are able to partake in Polymer's powerful binding mechanisms.

One thing that makes these components a bit different, perhaps:

These components decouple the markup from the core JavaScript.  That means that, out of the box, the JS is pure JS, and it makes a separate (one-time) fetch request for the markup file, bearing the same name as the element, in the same directory.  So, for example, xtal-material-input.js loads xtal-material-input.html from the same directory.  xtal-material-input.html contains the template definition as well as the CSS, basically the pure CSS markup of the link above.

The base class that helps pair the js file with the html file is bra-ket.js.  But users of this component can decide, perhaps, that they want to add or remove some DOM elements from the base template.  To do this, simply copy, then modify your own copy of the markup file (HTML as well as CSS).  This overriding of the default template can be specified via a template reference:

```html
<template id="xtal_text_input_md_template" data-src="myApp/myCustomizedVersion/my-neon-lipstick-text-box.html"></template>
```

Or you can directly inline the template, to reduce one http request (at the expense of less granular caching).

The JS code is organized via ES6 Modules, and the demo will only work on browsers with native support for ES6 Modules built in. **It also requires support for import.meta**

If you are targeting browsers that don't support either of these, and don't want to introduce an additional depenendency (like require.js), a single, bundled file (of the JS), xtal-material.js which must be referenced as a classic script.  It uses IIFE so as to not unnecessarily pollute the global namespace.



## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
