import{initCE}from"../node_modules/bra-ket/bra-ket.js";import{getBasePath}from"../getBasePath.js";import{AdoptAChild}from"../adopt-a-child.js";import{XtallatX}from"../node_modules/xtal-latx/xtal-latx.js";import{qsa}from"../node_modules/xtal-latx/qsa.js";export class XtalRadioGroupMD extends XtallatX(AdoptAChild){static get is(){return"xtal-radio-group-md"}handleChange(e){this.de("selected-radio",e.target)}postAdopt(){const q=qsa("input",this.shadowRoot);if(0===q.length){setTimeout(()=>{this.postAdopt()},10);return}this._changeHandler=this.handleChange.bind(this);q.forEach(radio=>{radio.addEventListener("change",this._changeHandler)})}disconnectedCallback(){const q=qsa("input",this.shadowRoot);q.forEach(radio=>{radio.removeEventListener("change",this._changeHandler)})}}initCE(XtalRadioGroupMD.is,XtalRadioGroupMD,getBasePath(XtalRadioGroupMD.is)+"/radio-group");