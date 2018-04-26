# \<xtal-material\>

Dependency free material design V1 web components, based on Jon Uhlmann's [pure CSS material design form elements](https://codepen.io/jonnitto/pen/OVmvPB). 

The total size of the text input component is ~2kb gzip minified.  Despite being dependency free, the components are able to partake in Polymer's powerful binding mechanisms.

A few things that make this component different (for better or for worse).

These components decouple the markup from the core JavaScript.  That means that, out of the box, the JS is pure JS, and it makes a separate (one-time) fetch request for the markup file, bearing the same name as the element, in the same directory.  So, for example, xtal-material-input.js loads xtal-material-input.html from the same directory.  xtal-material-input.html contains the template definition as well as the CSS, basically the pure CSS markup of the link above.

The base class that helps pair the js file with the html file is xtal-mark.js.  But users of this component can decide they want to add or remove some DOM elements from the base template, by first copying, then modifying their own copy of the markup file.  This can be provided linked to via a template reference:

```html
<template id="xtal_material_input_template" data-src="myApp/myCustomizedVersion/my-neon-lipstick-text-box.html"></template>
```

Or you can directly inline the template, to reduce one http request (at the expense of less granular caching).

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
