[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-material)

<a href="https://nodei.co/npm/xtal-material/"><img src="https://nodei.co/npm/xtal-material.png"></a>

<a href="https://www.webcomponents.org/element/bahrus/xtal-material/demo/demo/index.html">Demo</a>
# \<xtal-material\>

Light weight material design V1 web components, based on Jon Uhlmann's [pure CSS material design form elements](https://codepen.io/jonnitto/pen/OVmvPB).  For tabs we build on Ben Mildren's [Material Design CSS Only Tabs](https://codepen.io/mildrenben/pen/bdGdOb).

NB:  There are a number of [far](https://github.com/material-components/material-components-web-components) [more](https://vaadin.com/components/browse) [robust](https://www.webcomponents.org/collection/PolymerElements/paper-elements) alternative material design web components you should definitely check out.

The total size of the text input component is ~3.5kb gzip minified.  The components do not depend on Polymer, but they are able to partake in Polymer's powerful binding mechanisms.

## The Duality Principle

>It seems as though we must use sometimes JavaScript and sometimes declarative markup, while at times we may use either. We are faced with a new kind of difficulty. We have two contradictory pictures of reality; separately neither of them fully explains the phenomena of good web design, but together they do. -- [Albert Einstein](https://en.wikipedia.org/wiki/Wave%E2%80%93particle_duality)

One thing that makes these components a bit different, perhaps:

These components decouple the markup from the core JavaScript.  That means that, out of the box, the JS is pure JS, and it makes a separate (one-time) fetch request for the markup file, bearing the same name as the element, in the same directory.  So, for example, xtal-text-input-md.js loads xtal-text-input-md.html from the same directory.  xtal-text-input-md.html contains the template definition -- HTML as well as the CSS, basically the "pure CSS" + HTML markup of the link above.


Note that the author of the link above emphasizes that his solution is pure CSS (more or less).  The solution here sticks to that principle.

The base class that helps pair the js file with the html file is [BraKet](https://www.npmjs.com/package/bra-ket), which serves a potentially larger purpose than these material design components (more on that below). The class hierarchy originates with [templ-mount](https://www.npmjs.com/package/templ-mount).

## It's my party

But users of this component can decide, perhaps, that they want to add or remove some DOM elements from the base template, or radically alter the css.  To do this, simply copy, then modify your own copy of the markup file.  This overriding of the default template can be specified via a template reference:

```html
<template id="xtal_text_input_md_template" data-src="myApp/myCustomizedVersion/my-neon-lipstick-text-box.html"></template>
```

Note the use of data-src.  This is meant to emulate the src attribute of the script or iframe tags.  (Note -- no relative resolution of URL's is performed).

Or you can directly inline the template, to reduce one http request (at the expense of less granular caching).

The JS code is organized via ES6 Modules, and the demo will only work on browsers with native support for ES6 Modules built in, and also import.meta.

If you 1) do **not** specify the location of the template as described above, and 2) you use the ES6 Module references,  **this will only work for browsers with support for import.meta**

If you are targeting browsers that don't support either ES6 Modules or import.meta,  a single, bundled file (of the JS), xtal-material.js is also availble. It must be referenced as a classic script (for now).  It uses IIFE so as to not unnecessarily pollute the global namespace.


## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
