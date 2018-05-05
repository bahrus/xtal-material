# \<xtal-material\>

Dependency free material design V1 web components, based on Jon Uhlmann's [pure CSS material design form elements](https://codepen.io/jonnitto/pen/OVmvPB). 

The total size of the text input component is ~3kb gzip minified.  Despite being dependency free, the components are able to partake in Polymer's powerful binding mechanisms.

## The Duality Principle

>It seems as though we must use sometimes JavaScript and sometimes declarative markup, while at times we may use either. We are faced with a new kind of difficulty. We have two contradictory pictures of reality; separately neither of them fully explains the phenomena of good web design, but together they do. -- [Albert Einstein](https://en.wikipedia.org/wiki/Wave%E2%80%93particle_duality)

One thing that makes these components a bit different, perhaps:

These components decouple the markup from the core JavaScript.  That means that, out of the box, the JS is pure JS, and it makes a separate (one-time) fetch request for the markup file, bearing the same name as the element, in the same directory.  So, for example, xtal-text-input-md.js loads xtal-text-input-md.html from the same directory.  xtal-text-input-md.html contains the template definition -- HTML as well as the CSS, basically the "pure CSS" + HTML markup of the link above.

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-material)

Note that the author of the link above emphasizes that his solution is pure CSS (more or less).  The solution here sticks to that principle.

The base class that helps pair the js file with the html file is BraKet, which serves a potentially larger purpose than these material design components (more on that below). 

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

## Preloading templates

The class hierarchy begins with TemplMount, which specializes in loading templates from external URL's.

```html
<templ-mount></templ-mount>
```

does the following:

1)  It searches for template elements outside any Shadow DOM, with attribute data-src.  It preemptively downloads those template references.
2)  It searches for template elements inside the hosting Shadow DOM.
3)  It monitors the document.head element for additional template elements and loads them as they get added.
4)  Once the template is downloaded and inserted into the template, the "loaded" attribute is set.

Size:  790 bytes gzipped / minified.

The class BraKet also defines a custom element, "bra-ket", with two purposes:

1)  It serves as a base class for any web component where the desire is to unite markup together with script, without blending it together in a kind of JavaScript puree.  Not that there's anything wrong with that.

2)  It has two properties:  "bra" which points to a template, and "ket" which is a function property, which applies a function to the bra template.  The ket function could, for example, produce a new custom element, but the sky is the limit. [TODO]

The cost of this standalone ES6 module is only 780 bytes (usual conditions apply).

## adopt-a-child

I encountered an interesting snag when I got the implementing John Uhlman's radio buttons. At first, I thought I would just follow the same pattern I was following for the others (e.g. xtal-checkbox-input-md).

The first issue is that radio buttons with the same name, but in different shadow DOM's, do not apply the "exclusive-or" logic that is the essence of radio buttons.

Clearly, they would need to be grouped into one shadow DOM.  But then we lose all flexibility of defining multiple radio buttons, choosing how they be arranged, etc.

So I opted to improvise a bit.  I used the [xtal-method](https://github.com/bahrus/xtal-method#adoption-services) [component](https://www.webcomponents.org/element/@@npm/xtal-method).

It allows you pass in a markup "promise", which can then get dyanamically added directly into the shadow DOM.

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
