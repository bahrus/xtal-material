import { XtalElement } from "xtal-element/xtal-element.js";
import { define } from "xtal-element/define.js";
import { createTemplate } from "xtal-element/utils.js";
import { newEventContext } from "event-switch/event-switch.js";
const mainTemplate = createTemplate(/* html */ `
<slot></slot>
<div target></div>
<style>
:host {
  display: block; }

.form-radio {
  position: relative;
  margin-top: 2.25rem;
  margin-bottom: 2.25rem;
  text-align: left; }

.form-radio-inline .form-radio-label {
  display: inline-block;
  margin-right: 1rem; }

.form-radio-legend {
  margin: 0 0 0.125rem 0;
  font-weight: 500;
  font-size: 1rem;
  color: #333; }

.form-radio-label {
  position: relative;
  cursor: pointer;
  padding-left: 1.5rem;
  text-align: left;
  color: #333;
  display: block;
  margin-bottom: 0.5rem; }

.form-radio-label:hover i {
  color: #337ab7; }

.form-radio-label span {
  display: block;
  padding-top: 4px;
  padding-left: 4px; }

.form-radio-label input {
  width: auto;
  opacity: 0.0001;
  position: absolute;
  left: 0.25rem;
  top: 0.25rem;
  margin: 0;
  padding: 0; }

.form-radio-button {
  position: absolute;
  left: 0;
  cursor: pointer;
  display: block;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #999; }

.form-radio-button::before,
.form-radio-button::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  margin: 0.25rem;
  width: 1rem;
  height: 1rem;
  transition: transform 0.28s ease, color 0.28s ease;
  border-radius: 50%;
  border: 0.125rem solid currentColor;
  will-change: transform, color; }

.form-radio-button::after {
  transform: scale(0);
  background-color: #337ab7;
  border-color: #337ab7; }

.form-radio-field:checked ~ .form-radio-button::after {
  transform: scale(0.5); }

.form-radio-field:checked ~ .form-radio-button::before {
  color: #337ab7; }

.form-has-error .form-radio-button {
  color: #d9534f; }

</style>
`);
export class XtalRadioGroupMD extends XtalElement {
    constructor() {
        super(...arguments);
        this._renderContext = {};
        this._eventContext = newEventContext({
            slotchange: e => {
                console.log('slotChange');
            }
            // change: e => {
            //   const element = this.inputElement;
            //   if (element && element.matches(".form-element-field")) {
            //     element.classList[element.value ? "add" : "remove"]("-hasvalue");
            //   }
            // },
            // input: e => {
            //   this.emitEvent();
            // }
        });
    }
    static get is() {
        return "xtal-radio-group-md";
    }
    get mainTemplate() {
        return mainTemplate;
    }
    get renderContext() {
        return this._renderContext;
    }
    get eventContext() {
        return this._eventContext;
    }
    get ready() {
        return true;
    }
}
define(XtalRadioGroupMD);
