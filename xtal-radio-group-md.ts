import { XtalElement } from "xtal-element/xtal-element.js";
import { define } from "xtal-element/define.js";
import { createTemplate } from "xtal-element/utils.js";
import { newEventContext } from "event-switch/event-switch.js";

const mainTemplate = createTemplate(/* html */ `
<slot></slot>
<div class="form-radio form-radio-inline" target></div>
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
    static get is() {
        return "xtal-radio-group-md";
    }
    get mainTemplate() {
        return mainTemplate;
    }
    _initContext = {};
    get initContext() {
      return this._initContext;
    }

    _eventContext = newEventContext({
        slotchange: e =>{
            (e.target as HTMLSlotElement).assignedNodes().forEach((node: HTMLElement) =>{
                if(node.localName === 'datalist'){
                    const buttons = [];
                    Array.from(node.children).forEach((option: HTMLOptionElement, idx: number) =>{
                        const rb = 
                        /* html */`<label class="form-radio-label">
                                    <input name="pronoun" class="form-radio-field" type="radio" required value="${option.value}" />
                                    <i class="form-radio-button"></i>
                                    <span>${option.textContent || option.value}</span>
                                    </label>`
                        buttons.push(rb);
                    });
                    this.root.querySelector('[target]').innerHTML = buttons.join('');
                }
            })
            //slot.assignedNodes().forEach((node : HTMLElement) => {
        },
        change: e => {
          // const element = this.inputElement;
          // if (element && element.matches(".form-element-field")) {
          //   element.classList[element.value ? "add" : "remove"]("-hasvalue");
          // }
          this.de('value', {
            value: (<any>e.target).value
          })
        },
        // input: e => {
        //   //this.emitEvent();
        // }
      });
      get eventContext() {
        return this._eventContext;
      }
    
      get ready() {
        return true;
      }
}
define(XtalRadioGroupMD);
