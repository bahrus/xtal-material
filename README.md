[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-material)

<a href="https://nodei.co/npm/xtal-material/"><img src="https://nodei.co/npm/xtal-material.png"></a>

File size of xtal-test-input-md.js:  <img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/xtal-material@0.0.36/dist/xtal-text-input-md.iife.min.js?compression=gzip">

File size of all js: <img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/xtal-material@0.0.36/dist/xtal-material.min.js?compression=gzip">

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

<!--
```
<custom-element-demo>
  <template>
    <div style="height:600px">
        <litter-g></litter-g>
        <template id="radio-group">
          <xtal-radio-group-md name="pronoun">
            <div data-lit disabled data-input='["He", "She", "They", "Ze", "A pronoun not listed", "No pronoun preference"]'
              target>
              <script nomodule>
                html`
                      <div class="form-radio form-radio-inline">
                        <div class="form-radio-legend">Prefered Pronoun</div>
                          ${input.map(item => html`
                              <label class="form-radio-label">
                                <input name=pronoun class="form-radio-field" type="radio" required value="${item}" />
                                <i class="form-radio-button"></i>
                                <span>${item}</span>
                              </label>
                          `)}
                    `
              </script>
            </div>
          </xtal-radio-group-md>
        </template>
    
        <template id="radio-tabs">
          <xtal-radio-tabs-md name="pronoun">
            <div disabled data-lit data-input='["He", "She", "They", "Ze"]'>
              <script nomodule>
                html`
                  <div class="tab-wrap">
                      ${input.map((item, idx) => html`
                      <input type="radio" name="tabs" id="tab${idx}">
                        <div class="tab-label-content" id="tab${idx}-content">
                            <label for="tab${idx}">${item}</label>
                            
                          </div>
                      `)}
                      <div class="slide"></div>
                        </div>
                    `
              </script>
    
            </div>
          </xtal-radio-tabs-md>
    
    
        </template>
    
        <template id="text-demos">
          <xtal-text-input-md placeholder="Please fill in your full name">
            <span slot="label">Name</span>
          </xtal-text-input-md>
    
    
          <xtal-email-input-md>
            <span slot="label">Email</span>
            <span slot="hint">We will never spam you</span>
          </xtal-email-input-md>
          <div>Which type of music do you like?</div>
          <xtal-checkbox-input-md checked="{{likes_rap}}">
            <span slot="label">Rap</span>
          </xtal-checkbox-input-md>
          <xtal-checkbox-input-md checked="{{likes_pop}}">
            <span slot="label">Pop</span>
          </xtal-checkbox-input-md>
          <xtal-checkbox-input-md checked="{{likes_rock}}">
            <span slot="label">Rock</span>
          </xtal-checkbox-input-md>
          <xtal-checkbox-input-md checked="{{likes_metal}}">
            <span slot="label">Metal</span>
          </xtal-checkbox-input-md>
          <xtal-checkbox-input-md checked="{{likes_r_and_b}}">
            <span slot="label">R&amp;B</span>
          </xtal-checkbox-input-md>
          <xtal-text-area-md>
            <span slot="label">Your Message</span>
          </xtal-text-area-md>
          <div>Favorite Netflix Series</div>
           <xtal-deco><script nomodule>
            ({
              options:{
                data: [
                  {txt: 'House of Cards', id:1},
                  {txt: 'Orange is the New Black', id:2},
                  {txt: 'Marco Polo', id:3},
                  {txt: 'Narcos', id:4},
                  {txt:  'The Crown', id:5},
                  {txt:'Ozark', id: 6}
                ],
                textFld: 'txt',
                keyFld: 'id'
              }
            })
          </script></xtal-deco>
          <xtal-text-input-md aria-placeholder="Pick your favorite Netflix series" placeholder="Pick your favorite Netflix series">
          <span slot="label">Netflix Series</span>
          </xtal-text-input-md>
        </template>
    

        <xtal-side-nav>
          <style>
            a {
              padding: 8px 8px 8px 32px;
              text-decoration: none;
              font-size: 25px;
              color: #818181;
              display: block;
              transition: 0.3s;
            }
    
            a:hover {
              color: #f1f1f1;
            }
          </style>
          <span slot="title">xtal-material Catalog</span>
          <a href="#radio-group" data-template="radio-group">Radio Group</a>
          <a href="#radio-tabs" data-template="radio-tabs">Tabs</a>
          <a href="#text-demos" data-template="text-demos">Text Demos</a>
        </xtal-side-nav>
        <p-d on="click" if="a" prop="from" val="target.dataset.template"></p-d>
        <b-c-c noshadow copy></b-c-c>
    
    
        <script nomodule src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-bundle.js"></script>
        <script type="module" src="https://unpkg.com/xtal-material@0.0.39/dist/xtal-material.js"></script>
        <script type="module" src="https://unpkg.com/carbon-copy@0.1.43/carbon-copy.js"></script>
        <script type="module" src="https://unpkg.com/p-d.p-u@0.0.100/dist/p-d.p-u.iife.js"></script>
        <script type="module" src="https://unpkg.com/litter-g@0.0.18/dist/litter-g.iife.js?module"></script>
        <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-decorator@0.0.33/dist/xtal-decorator.iife.js"></script>
      </div>
  </template>
</custom-element-demo>
```
-->

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

WIP
