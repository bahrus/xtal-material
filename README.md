[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-material)

<a href="https://nodei.co/npm/xtal-material/"><img src="https://nodei.co/npm/xtal-material.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-material">

File size of xtal-test-input-md.js:  <img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/xtal-material@0.0.36/dist/xtal-text-input-md.iife.min.js?compression=gzip">

File size of all js: <img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/xtal-material@0.0.36/dist/xtal-material.min.js?compression=gzip">

Light weight material design V1 web components, based on Jon Uhlmann's [pure CSS material design form elements](https://codepen.io/jonnitto/pen/OVmvPB).  For tabs we build on Ben Mildren's [Material Design CSS Only Tabs](https://codepen.io/mildrenben/pen/bdGdOb).

NB:  There are a number of [far](https://github.com/material-components/material-components-web-components) [more](https://vaadin.com/components/browse) [robust](https://www.webcomponents.org/collection/PolymerElements/paper-elements) alternative material design web components you should definitely check out.


The text input also supports autocomplete / combobox functionality.  It has a property, options, which expects the following interface:

```TypeScript
export interface IXtalInputOptions {
    data: any[],
    textFld: string,
    keyFld: string,
}
```

It utilizes the [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist).

## The Duality Principle

>It seems as though we must use sometimes JavaScript and sometimes declarative markup, while at times we may use either. We are faced with a new kind of difficulty. We have two contradictory pictures of reality; separately neither of them fully explains the phenomena of good web design, but together they do. -- [Albert Einstein](https://en.wikipedia.org/wiki/Wave%E2%80%93particle_duality)

If you look at the codepen examples these components derive from, one observes they do not contain any JavaScript.  Unfortunately, lack of support for importing HTML kind of forces these components to adopt a slower, more complex, and less risk-free format -- JavaScript.  But xtal-material is well-positioned to adopt HTML format when HTML modules land.

<!--
```
<custom-element-demo>
  <template>
    <div style="height:600px">
        <template id="radio-group">
          <xtal-radio-group-md name="pronoun">
            <datalist>
              <option value="He"></option>
              <option value="She"></option>
              <option value="They"></option>
              <option value="Ze"></option>
              <option value="A pronount not listed"></option>
              <option value="No pronoun preference"></option>
            </datalist>
          </xtal-radio-group-md>
        </template>
    
        <template id="radio-tabs">
          <xtal-radio-tabs-md>
            <datalist>
              <option value="Tab1"></option>
              <option value="Tab2"></option>
              <option value="Tab3"></option>
              <option value="Tab4"></option>
            </datalist>
          </xtal-radio-tabs-md>
    
    
        </template>
    
        <template id="text-demos">
          <xtal-text-input-md value="Alfred E. Neuman" placeholder="Please fill in your full name">
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
          <xtal-text-input-md value="Narcos" aria-placeholder="Pick your favorite Netflix series" placeholder="Pick your favorite Netflix series"></xtal-text-input-md>
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
        <!-- Use experimental import maps -->
        <script defer src="https://cdn.jsdelivr.net/npm/es-module-shims@0.2.1/dist/es-module-shims.js"></script>
        <script type="importmap-shim">
          {
            "imports": {
              "trans-render/": "https://cdn.jsdelivr.net/npm/trans-render@0.0.75/",
              "xtal-element/": "https://cdn.jsdelivr.net/npm/xtal-element@0.0.29/",
              "xtal-material/":  "https://cdn.jsdelivr.net/npm/xtal-material@0.0.49/",
              "event-switch/":  "https://cdn.jsdelivr.net/npm/event-switch@0.0.12/"            
            }
          }
          </script>
          
        <script  type="module-shim">
          import 'xtal-material/xtal-text-input-md.js';
          import 'xtal-material/xtal-email-input-md.js';
          import 'xtal-material/xtal-checkbox-input-md.js';
          import 'xtal-material/xtal-radio-group-md.js';
          import 'xtal-material/xtal-text-area-md.js';
          import 'xtal-material/xtal-radio-tabs-md.js';
          import 'xtal-material/xtal-side-nav.js';
        </script>
        <script type="module" src="https://unpkg.com/carbon-copy@0.1.43/carbon-copy.js"></script>
        <script type="module" src="https://unpkg.com/p-d.p-u@0.0.100/dist/p-d.p-u.iife.js"></script>
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
