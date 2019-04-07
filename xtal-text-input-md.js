import { XtalElement } from "xtal-element/xtal-element.js";
import { define } from "trans-render/define.js";
import { createTemplate } from "xtal-element/utils.js";
import { newEventContext } from "event-switch/event-switch.js";
import { up } from "trans-render/hydrate.js";
export const baseTemplateGenerator = (type) => /* html */ `
<div class="form-element form-input">
  <input id="input_field" list="options" type="${type}" class="form-element-field" placeholder=" " required />
  <datalist id="options"></datalist>
  <div class="form-element-bar"></div>
  <label class="form-element-label" for="input_field">
    <slot name="label"></slot>
  </label>
  <small class="form-element-hint">
  </small>
</div>
<style>
  :host {
    display: block;
  }

  .form-element {
    position: relative;
    margin-top: 2.25rem;
    margin-bottom: 2.25rem;
  }

  .form-element-hint {
    font-weight: 400;
    font-size: 0.6875rem;
    color: #a6a6a6;
    display: block;
  }

  .form-element-bar {
    position: relative;
    height: 1px;
    background: #999;
    display: block;
  }

  .form-element-bar::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #337ab7;
    height: 2px;
    display: block;
    transform: rotateY(90deg);
    transition: transform 0.28s ease;
    will-change: transform;
  }

  .form-element-label {
    position: absolute;
    top: 0.75rem;
    line-height: 1.5rem;
    pointer-events: none;
    padding-left: 0.125rem;
    z-index: 1;
    font-size: 1rem;
    font-weight: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    color: #a6a6a6;
    transform: translateY(-50%);
    transform-origin: left center;
    transition: transform 0.28s ease, color 0.28s linear, opacity 0.28s linear;
    will-change: transform, color, opacity;
  }

  .form-element-field {
    outline: none;
    height: 1.5rem;
    display: block;
    background: none;
    padding: 0.125rem 0.125rem 0.0625rem;
    font-size: 1rem;
    border: 0 solid transparent;
    line-height: 1.5;
    width: 100%;
    color: #333;
    box-shadow: none;
    opacity: 0.001;
    transition: opacity 0.28s ease;
    will-change: opacity;
  }

  .form-element-field:-ms-input-placeholder {
    color: #a6a6a6;
    transform: scale(0.9);
    transform-origin: left top;
  }

  .form-element-field::placeholder {
    color: #a6a6a6;
    transform: scale(0.9);
    transform-origin: left top;
  }

  .form-element-field:focus~.form-element-bar::after {
    transform: rotateY(0deg);
  }

  .form-element-field:focus~.form-element-label {
    color: #337ab7;
  }

  .form-element-field.-hasvalue,
  .form-element-field:focus {
    opacity: 1;
  }

  .form-element-field.-hasvalue~.form-element-label,
  .form-element-field:focus~.form-element-label {
    transform: translateY(-100%) translateY(-0.5em) translateY(-2px) scale(0.9);
    cursor: pointer;
    pointer-events: auto;
  }

  .form-has-error .form-element-label.form-element-label,
  .form-has-error .form-element-hint {
    color: #d9534f;
  }

  .form-has-error .form-element-bar,
  .form-has-error .form-element-bar::after {
    background: #d9534f;
  }

  .form-is-success .form-element-label.form-element-label,
  .form-is-success .form-element-hint {
    color: #259337;
  }

  .form-is-success .form-element-bar::after {
    background: #259337;
  }

  input.form-element-field:not(:placeholder-shown),
  textarea.form-element-field:not(:placeholder-shown) {
    opacity: 1;
  }

  input.form-element-field:not(:placeholder-shown)~.form-element-label,
  textarea.form-element-field:not(:placeholder-shown)~.form-element-label {
    transform: translateY(-100%) translateY(-0.5em) translateY(-2px) scale(0.9);
    cursor: pointer;
    pointer-events: auto;
  }

  textarea.form-element-field {
    height: auto;
    min-height: 3rem;
  }

  select.form-element-field {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
  }

  .form-select-placeholder {
    color: #a6a6a6;
    display: none;
  }

  .form-select .form-element-bar::before {
    content: "";
    position: absolute;
    height: 0.5em;
    width: 0.5em;
    border-bottom: 1px solid #999;
    border-right: 1px solid #999;
    display: block;
    right: 0.5em;
    bottom: 0;
    transition: transform 0.28s ease;
    transform: translateY(-100%) rotateX(0deg) rotate(45deg);
    will-change: transform;
  }

  .form-select select:focus~.form-element-bar::before {
    transform: translateY(-50%) rotateX(180deg) rotate(45deg);
  }

  .form-element-field[type="number"] {
    -moz-appearance: textfield;
  }

  .form-element-field[type="number"]::-webkit-outer-spin-button,
  .form-element-field[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
`;
const textInputTemplate = createTemplate(baseTemplateGenerator("text"));
/**
 * `xtal-text-input-md`
 *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalTextInputMD extends XtalElement {
    constructor() {
        super(...arguments);
        this._initContext = {};
        this._eventContext = newEventContext({
            change: e => {
                const element = this.inputElement;
                if (element && element.matches(".form-element-field")) {
                    element.classList[element.value ? "add" : "remove"]("-hasvalue");
                }
            },
            input: e => {
                this.emitEvent();
            }
        });
        this._initializedAttrs = false;
    }
    static get is() {
        return "xtal-text-input-md";
    }
    get inputElement() {
        if (this._inputElement === undefined) {
            this._inputElement = this.root.querySelector("input");
        }
        return this._inputElement;
    }
    get mainTemplate() {
        return textInputTemplate;
    }
    get initContext() {
        return this._initContext;
    }
    get eventContext() {
        return this._eventContext;
    }
    get ready() {
        return true;
    }
    get value() {
        return this._value;
    }
    set value(val) {
        this._value = val;
        this.onPropsChange();
    }
    get options() {
        return this._options;
    }
    set options(nv) {
        this._options = nv;
        this.onPropsChange();
    }
    onPropsChange() {
        if (!super.onPropsChange())
            return false;
        if (this._options && this._options !== this._previousOptions) {
            this._previousOptions = this._options;
            const nv = this._options;
            const dl = this.root.querySelector("#options");
            dl.innerHTML = "";
            const textFld = nv.textFld;
            const arr = [];
            nv.data.forEach(item => {
                // const optionTarget = document.createElement("option");
                // optionTarget.setAttribute("value", item[textFld]);
                // dl.appendChild(optionTarget);
                arr.push(/* html */ `<option value="${item[textFld]}">`);
            });
            dl.innerHTML = arr.join('');
        }
        if (!this._initializedAttrs) {
            for (let i = 0, ii = this.attributes.length; i < ii; i++) {
                const attrib = this.attributes[i];
                //const inp = clonedNode.querySelector('input');
                if (attrib.name === "type")
                    continue;
                this.inputElement.setAttribute(attrib.name, attrib.value);
            }
            this._initializedAttrs = true;
        }
        if (this._value !== undefined)
            this.inputElement.value = this._value;
        this.addMutationObserver();
        return true;
    }
    emitEvent() {
        const val = this.inputElement.value;
        this.value = val;
        this.de("value", {
            value: val
        });
        if (this._options) {
            const textFld = this._options.textFld;
            const item = this._options.data.find(item => item[textFld] === val);
            if (item !== undefined) {
                this.selection = item;
                this.de("selection", {
                    value: item
                });
            }
        }
    }
    connectedCallback() {
        this[up](["value", "options"]);
        super.connectedCallback();
    }
    addMutationObserver() {
        const config = { attributes: true };
        this._observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                const attrName = mutation.attributeName;
                const attrVal = this.getAttribute(attrName);
                switch (attrName) {
                    case "options":
                        this.options = JSON.parse(attrVal);
                        break;
                    default:
                        this.inputElement.setAttribute(attrName, attrVal);
                }
                attrName;
            });
        });
        this._observer.observe(this, config);
    }
    disconnectedCallback() {
        this._observer.disconnect();
    }
}
define(XtalTextInputMD);
