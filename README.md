# \<xtal-material\>

Dependency free material design V1 web components, based on Jon Uhlmann's pure [CSS material design form elements](https://codepen.io/jonnitto/pen/OVmvPB). 

The total size of the text input component is ~2kb gzip minified.  Despite being dependency free, the components are able to partake in Polymer's powerful binding mechanisms.

A few things that make this component different (for better or for worse).

I normally have a very strong preference to be able to reference a web component with a single reference.  However, that isn't the case here.  It requires two references:

```html
<template id="xtal_material_input_template" data-src="../xtal-material-input.html"></template>
<script async type="module" src="../xtal-material-input.js"></script>
```

## What gives?

I'm excited to see the [HTML Modules](https://github.com/PolymerLabs/hd-html) initiative get off the ground, hopefully quickly.  Until it reaches maturity, we must either use the deprecated HTML Imports, or encode everything in JavaScript, or develop an alternative (temporary?) solution, which is what I did.

Jon Uhlmann obviously put in some tender loving care in order to produce a beautiful, 99% markup-based solution.  Performance wise, I suspect nothing could beat it.  Unfortunately, the failure of the web component "working" (slothing?) group to adopt a sensible import mechanism for markup, including [css](https://github.com/Polymer/polymer/issues/4865) means taking elegant solutions like this, and totally trashing the philosophy behind it.  I tried to embrace this new paradigm that the development community is adopting [en masse](https://www.youtube.com/watch?v=xMZlr5Gf9yY ), but my heart just wasn't in it, so I decided that requiring two references is the lesser of two evils.

Another factor in the decision, is the developer now has total control of the markup, and can easily create an infinite number of variations on this particular user interface.  When HTML Modules and theme/parts are a thing (shipping in multiple browsers) I  will happily update this so only a single reference will be required.

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
