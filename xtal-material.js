import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `xtal-material`
 * Dependency Free Material Components
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalMaterial extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'xtal-material',
      },
    };
  }
}

window.customElements.define('xtal-material', XtalMaterial);
