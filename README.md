# \<xtal-material\>

Dependency free material design V1 web components, based on Jon Uhlmann's [pure CSS material design form elements](https://codepen.io/jonnitto/pen/OVmvPB). 

The total size of the text input component is ~3kb gzip minified.  Despite being dependency free, the components are able to partake in Polymer's powerful binding mechanisms.

## The Duality Principle

One thing that makes these components a bit different, perhaps:

These components decouple the markup from the core JavaScript.  That means that, out of the box, the JS is pure JS, and it makes a separate (one-time) fetch request for the markup file, bearing the same name as the element, in the same directory.  So, for example, xtal-text-input-md.js loads xtal-text-input-md.html from the same directory.  xtal-text-input-md.html contains the template definition as well as the CSS, basically the pure CSS markup of the link above.

Note that the author of the link above emphasizes that his solution is pure CSS (more or less).  The solution here sticks to that principle.

The base class that helps pair the js file with the html file is bra-ket.js, which serves a potentially larger purpose than these material design components (more on that below). 

## It's my party

But users of this component can decide, perhaps, that they want to add or remove some DOM elements from the base template, or radically alter the css.  To do this, simply copy, then modify your own copy of the markup file.  This overriding of the default template can be specified via a template reference:

```html
<template id="xtal_text_input_md_template" data-src="myApp/myCustomizedVersion/my-neon-lipstick-text-box.html"></template>
```

Note the use of data-src.  This is meant to remind you of the src attribute of the script or iframe tags.  (Note -- no relative resolution of URL's is performed).

Or you can directly inline the template, to reduce one http request (at the expense of less granular caching).

The JS code is organized via ES6 Modules, and the demo will only work on browsers with native support for ES6 Modules built in, and also import.meta.

If you 1) do **not** specify the location of the template as described above, and 2) you use the ES6 Module references,  **this will only work for browsers with support for import.meta**


If you are targeting browsers that don't support either ES6 Modules or import.meta,  a single, bundled file (of the JS), xtal-material.js is also availble. It must be referenced as a classic script (for now).  It uses IIFE so as to not unnecessarily pollute the global namespace.

## Preloading templates

The base class, BraKet, also defines a custom element, "bra-ket", which searches for template elements outside any Shadow DOM, with attribute data-src.  It preemptively downloads those template files.  Kind of a [link preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) feature for HTML/CSS markup.  (For now, I find that preload only works well for JavaScript, and, from what I hear, fonts.  I've not had much luck with HTML, CSS, or (pre)fetch).

The base class is designed to serve as a base class for any web component where the desire is to unite markup together with script, without blending it together in a kind of JavaScript puree.  Not that there's anything wrong with that.

The cost of this standalone ES6 module is only 999 bytes (usual conditions apply).

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
