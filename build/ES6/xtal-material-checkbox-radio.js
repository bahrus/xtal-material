import{XtalMaterialInput}from'./xtal-material-input.js';import{initCE}from'./xtal-shadow.js';export class XtalMaterialCheckbox extends XtalMaterialInput{static get is(){return'xtal-material-checkbox'}getType(){return'checkbox'}get checked(){return this._inputElement.checked}set checked(a){this._inputElement.checked=a}emitEvent(){const a=new CustomEvent('checked-changed',{detail:{value:this._inputElement.checked},bubbles:!0,composed:!1});this.dispatchEvent(a)}addInputListener(){this._inputElement.addEventListener('change',()=>{this.emitEvent()})}}initCE(XtalMaterialCheckbox.is,XtalMaterialCheckbox);