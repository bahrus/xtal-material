import{BraKet,initCE}from"../node_modules/bra-ket/bra-ket.js";import{XtallatX}from"../node_modules/xtal-latx/xtal-latx.js";import{getBasePath}from"../getBasePath.js";export class XtalTextInputMD extends XtallatX(BraKet){static get is(){return"xtal-text-input-md"}customizeClone(clonedNode){super.customizeClone(clonedNode);const inputEl=this._inputElement=clonedNode.querySelector("input");inputEl.setAttribute("type",this.getType());for(let i=0,ii=this.attributes.length;i<ii;i++){const attrib=this.attributes[i];if("type"===attrib.name)continue;inputEl.setAttribute(attrib.name,attrib.value)}}initShadowRoot(){this.addInputListener();this._inputElement.addEventListener("change",()=>{let element=this._inputElement;if(element&&element.matches(".form-element-field")){element.classList[element.value?"add":"remove"]("-hasvalue")}})}get value(){return this._inputElement.value}set value(val){this._inputElement.value=val}getType(){return this.constructor.is.split("-")[1]}addInputListener(){this._inputElement.addEventListener("input",()=>{this.emitEvent()})}emitEvent(){const newEvent=new CustomEvent("value-changed",{detail:{value:this._inputElement.value},bubbles:!0,composed:!1});this.dispatchEvent(newEvent)}connectedCallback(){this._upgradeProperties(["value"]);this.addMutationObserver()}addMutationObserver(){this._observer=new MutationObserver(mutationsList=>{mutationsList.forEach(mutation=>{this._inputElement[mutation.attributeName]=this[mutation.attributeName]})});this._observer.observe(this,{attributes:!0})}disconnectedCallback(){this._observer.disconnect()}}const basePath=getBasePath(XtalTextInputMD.is);initCE(XtalTextInputMD.is,XtalTextInputMD,basePath+"/text-input");export class XtalEmailInputMD extends XtalTextInputMD{static get is(){return"xtal-email-input-md"}looksLike(){return XtalTextInputMD.is}}initCE(XtalEmailInputMD.is,XtalEmailInputMD,basePath+"/text-input",XtalTextInputMD.is);