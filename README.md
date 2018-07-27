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

<!--
```
<custom-element-demo>
  <template>
    <div class="vertical-section-container centered">
    <h3>Basic xtal-material demo</h3>
    <script nomodule src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-bundle.js"></script>
    <link id="xtal_material" rel="preload" as="script" href="https://unpkg.com/xtal-material@0.0.24/xtal-material.js">
    <script type="module" src="https://unpkg.com/xtal-method@0.0.13/xtal-im-ex.js"></script>
    <script type="module" src="https://unpkg.com/xtal-material@0.0.24/xtal-material.js"></script>

    <script nomodule id="_root_lit_html">
      //const root = 'https://unpkg.com/lit-html/';
      const root = 'https://cdn.jsdelivr.net/npm/lit-html/'
    </script>
    <script nomodule id="_lit_html">
      const { html, render } = await import(root + 'lit-html.js');
    </script>
    <script nomodule id="_lit_repeat">
      const { repeat } = await import(root + 'lib/repeat.js');
    </script>
    
    <xtal-radio-group-md name="pronoun">
      <xtal-im-ex disabled input='["He", "She", "They", "Ze", "A pronoun not listed", "No pronoun preference"]'>

        <script nomodule>
            XtalIMEX.insert(_root_lit_html, _lit_html, _lit_repeat);
            const radioButtonListGenerator = items => html`
            <div class="form-radio form-radio-inline">
                <div class="form-radio-legend">Prefered Pronoun</div>
                ${repeat(items, item => Math.random().toString(), item => html`
                  <label class="form-radio-label">
                    <input name=pronoun class="form-radio-field" type="radio" required .value="${item}" />
                    <i class="form-radio-button"></i>
                    <span>${item}</span>
                  </label>`
                )}
            </div>`;
            export const renderer = (list, target) => render(radioButtonListGenerator(list), target);
        </script>
      </xtal-im-ex>
    </xtal-radio-group-md>
    <small class="form-element-hint">Feel free to choose</small>
    <xtal-radio-tabs-md>
      <xtal-im-ex disabled input='["He", "She", "They", "Ze"]'>
        <script nomodule>
          XtalIMEX.insert(_root_lit_html, _lit_html, _lit_repeat);
          const radioButtonListGenerator = items => html`
            <div class="tab-wrap">
              ${repeat(items, item => Math.random().toString(), (item, idx) => html`
                <input type="radio" name="tabs" id="tab${idx}">
                <div class="tab-label-content" id="tab${idx}-content">
                  <label for="tab${idx}">${item}</label>
                  
                </div>
                `
              )}
              <div class="slide"></div>
            </div>
          `;
          export const renderer = (list, target) => render(radioButtonListGenerator(list), target);
        </script>
      </xtal-im-ex>
    </xtal-radio-tabs-md>

    <xtal-text-input-md placeholder="Please fill in your full name">
      <span slot="label">Name</span>
    </xtal-text-input-md>
    <p-d on="value-changed" to="{innerText}"></p-d>
    <div></div>

    <xtal-email-input-md>
      <span slot="label">Email</span>
      <span slot="hint">We will never spam you</span>
    </xtal-email-input-md>
    <div>[[likes_rap]]</div>
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
    </template>
    </dom-bind>
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
      <span slot="title">Hello</span>
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#clients">Clients</a>
      <a href="#contact">Contact</a>
    </xtal-side-nav>
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

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
