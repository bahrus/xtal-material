(function(){function getBasePath(){let path;const link=self.xtal_material;if(link){path=link.href}else{const cs=document.currentScript;if(cs){path=cs.src}}return path.split("/").slice(0,-1).join("/")}function lispToSnakeCase(s){return s.split("-").join("_")}const _cachedTemplates={},fetchInProgress={};function loadTemplate(template,params){const src=template.dataset.src;if(src){if(_cachedTemplates[src]){template.innerHTML=_cachedTemplates[src];if(params)customElements.define(params.tagName,params.cls)}else{if(fetchInProgress[src]){if(params){setTimeout(()=>{loadTemplate(template,params)},100)}return}fetchInProgress[src]=!0;fetch(src,{credentials:"same-origin"}).then(resp=>{resp.text().then(txt=>{fetchInProgress[src]=!1;if(params&&params.preProcessor)txt=params.preProcessor.process(txt);_cachedTemplates[src]=txt;template.innerHTML=txt;template.setAttribute("loaded","");if(params)customElements.define(params.tagName,params.cls)})})}}else{if(params&&params.tagName)customElements.define(params.tagName,params.cls)}}function qsa(css,from){return[].slice.call((from?from:this).querySelectorAll(css))}class TemplMount extends HTMLElement{constructor(){super();if(!TemplMount._alreadyDidGlobalCheck){TemplMount._alreadyDidGlobalCheck=!0;this.loadTemplatesOutsideShadowDOM();if("loading"===document.readyState){document.addEventListener("DOMContentLoaded",()=>{this.loadTemplatesOutsideShadowDOM();this.monitorHeadForTemplates()})}else{this.monitorHeadForTemplates()}}}static get is(){return"templ-mount"}getHost(){const parent=this.parentNode;return parent.host}loadTemplates(from){qsa("template[data-src]",from).forEach(externalRefTemplate=>{loadTemplate(externalRefTemplate)})}loadTemplatesOutsideShadowDOM(){this.loadTemplates(document)}loadTemplateInsideShadowDOM(){const host=this.getHost();if(!host)return;this.loadTemplates(host)}monitorHeadForTemplates(){this._observer=new MutationObserver(mutationsList=>{mutationsList.forEach(mutationRecord=>{mutationRecord.addedNodes.forEach(node=>{if("TEMPLATE"===node.tagName)loadTemplate(node)})})});this._observer.observe(document.head,{childList:!0})}connectedCallback(){this.loadTemplateInsideShadowDOM();if("loading"===document.readyState){document.addEventListener("DOMContentLoaded",()=>{this.loadTemplateInsideShadowDOM()})}}}TemplMount._alreadyDidGlobalCheck=!1;if(!customElements.get(TemplMount.is)){customElements.define(TemplMount.is,TemplMount)}const disabled="disabled";function XtallatX(superClass){return class extends superClass{constructor(){super(...arguments);this._evCount={}}static get observedAttributes(){return[disabled]}get disabled(){return this._disabled}set disabled(val){this.attr(disabled,val,"")}attr(name,val,trueVal){if(val){this.setAttribute(name,trueVal||val)}else{this.removeAttribute(name)}}incAttr(name){const ec=this._evCount;if(name in ec){ec[name]++}else{ec[name]=0}this.attr(name,ec[name].toString())}attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}de(name,detail){const eventName=name+"-changed",newEvent=new CustomEvent(eventName,{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);this.incAttr(eventName);return newEvent}_upgradeProperties(props){props.forEach(prop=>{if(this.hasOwnProperty(prop)){let value=this[prop];delete this[prop];this[prop]=value}})}}}function lispToSnakeCase(s){return s.split("-").join("_")}function BraKetMixin(superClass){return class extends superClass{static get is(){return"bra-ket"}get tn(){return this.tagName.toLowerCase()}looksLike(){}get dynamicSlots(){return null}get CE(){if(!this._ce)this._ce=customElements.get(this.tn);return this._ce}customizeClone(){}initShadowRoot(){}addTemplate(noShadow){if(!noShadow){this.attachShadow({mode:"open"})}if(!this.CE._template){this.CE._template={}}const tn=this.looksLike()||this.tn;if(!this.CE._template[tn]){lispToSnakeCase(tn)+"_template";this.CE._template[tn]=self[lispToSnakeCase(tn)+"_template"]}const clonedNode=this.CE._template[tn].content.cloneNode(!0);this.customizeClone(clonedNode);if(!noShadow){this.shadowRoot.appendChild(clonedNode);this.initShadowRoot()}else{this.appendChild(clonedNode)}}}}class BraKet extends BraKetMixin(HTMLElement){constructor(){super();if(!(Object.getPrototypeOf(this)===BraKet.prototype)){this.addTemplate()}}}function initCE(tagName,cls,basePath,sharedTemplateTagName){if(customElements.get(tagName))return;const templateTagName=sharedTemplateTagName||tagName,templateID=lispToSnakeCase(templateTagName)+"_template";let template=self[templateID];if(!template){template=document.createElement("template");template.id=templateID;template.dataset.src=basePath+"/"+templateTagName+".html";document.head.appendChild(template)}loadTemplate(template,{cls:cls,sharedTemplateTagName:sharedTemplateTagName,tagName:tagName})}class AdoptAChild extends BraKet{constructor(){super();this._rootElement="div";this._targetElementSelector="[target]"}get dynamicSlots(){return["slot"]}postAdopt(){}addTemplate(){console.log("addTemplate");super.addTemplate();if(!this.dynamicSlots)return;this.dynamicSlots.forEach(slotSelector=>{qsa(slotSelector,this.shadowRoot).forEach(slot=>{slot.addEventListener("slotchange",()=>{slot.assignedNodes().forEach(node=>{const targetEl=this.shadowRoot.querySelector(this._targetElementSelector);if(node.disabled&&typeof("undefined"!==node.target)){node.target=targetEl;node.removeAttribute("disabled")}else{if(1===node.nodeType){targetEl.innerHTML="";targetEl.appendChild(node.cloneNode(!0));if(node.parentElement){node.parentElement.removeChild(node)}else{if(1===node.nodeType){node.innerHTML="";node.style.display="none";node.removeAttribute("id")}}}}});this.postAdopt()})})})}}class XtalTextInputMD extends XtallatX(BraKet){static get is(){return"xtal-text-input-md"}customizeClone(clonedNode){super.customizeClone(clonedNode);const inputEl=this._inputElement=clonedNode.querySelector("input");inputEl.setAttribute("type",this.getType());for(let i=0,ii=this.attributes.length;i<ii;i++){const attrib=this.attributes[i];if("type"===attrib.name)continue;inputEl.setAttribute(attrib.name,attrib.value)}}initShadowRoot(){this.addInputListener();this._inputElement.addEventListener("change",()=>{let element=this._inputElement;if(element&&element.matches(".form-element-field")){element.classList[element.value?"add":"remove"]("-hasvalue")}})}get value(){return this._inputElement.value}set value(val){this._inputElement.value=val}getType(){return this.constructor.is.split("-")[1]}addInputListener(){this._inputElement.addEventListener("input",()=>{this.emitEvent()})}emitEvent(){const newEvent=new CustomEvent("value-changed",{detail:{value:this._inputElement.value},bubbles:!0,composed:!1});this.dispatchEvent(newEvent)}connectedCallback(){this._upgradeProperties(["value"]);this.addMutationObserver()}addMutationObserver(){this._observer=new MutationObserver(mutationsList=>{mutationsList.forEach(mutation=>{this._inputElement[mutation.attributeName]=this[mutation.attributeName]})});this._observer.observe(this,{attributes:!0})}disconnectedCallback(){this._observer.disconnect()}}const basePath=getBasePath(XtalTextInputMD.is);initCE(XtalTextInputMD.is,XtalTextInputMD,basePath+"/text-input");class XtalEmailInputMD extends XtalTextInputMD{static get is(){return"xtal-email-input-md"}looksLike(){return XtalTextInputMD.is}}initCE(XtalEmailInputMD.is,XtalEmailInputMD,basePath+"/text-input",XtalTextInputMD.is);class XtalCheckboxInputMD extends XtalTextInputMD{static get is(){return"xtal-checkbox-input-md"}get checked(){return this._inputElement.checked}set checked(val){this._inputElement.checked=val}emitEvent(){const newEvent=new CustomEvent("checked-changed",{detail:{value:this._inputElement.checked},bubbles:!0,composed:!1});this.dispatchEvent(newEvent)}addInputListener(){this._inputElement.addEventListener("change",()=>{this.emitEvent()})}}initCE(XtalCheckboxInputMD.is,XtalCheckboxInputMD,getBasePath(XtalCheckboxInputMD.is)+"/checkbox-input");class XtalRadioGroupMD extends AdoptAChild{static get is(){return"xtal-radio-group-md"}constructor(){super()}}initCE(XtalRadioGroupMD.is,XtalRadioGroupMD,getBasePath(XtalRadioGroupMD.is)+"/radio-group");const styleFn=(n,t)=>`
input[type="radio"][name="tabs"]:nth-of-type(${n+1}):checked~.slide {
    left: calc((100% / ${t}) * ${n});
}
`;class XtalRadioTabsMD extends XtallatX(AdoptAChild){static get is(){return"xtal-radio-tabs-md"}constructor(){super()}handleChange(e){this.de("selected-tab",e.target)}postAdopt(){const q=qsa("input",this.shadowRoot);if(0===q.length){setTimeout(()=>{this.postAdopt()},100);return}this._changeHandler=this.handleChange.bind(this);q.forEach(radio=>{radio.addEventListener("change",this._changeHandler)});const styles=[];console.log("length  = "+q.length);for(let i=0,ii=q.length;i<ii;i++){styles.push(styleFn(i,ii))}styles.push(`
        .slide {
            width: calc(100% / ${q.length});
        }
        `);const style=document.createElement("style");style.innerHTML=styles.join("");this.shadowRoot.appendChild(style);this.addEventListener("input",()=>{debugger})}disconnectedCallback(){super.disconnectedCallback();const q=qsa("input",this.shadowRoot);q.forEach(radio=>{radio.removeEventListener("change",this._changeHandler)})}}initCE(XtalRadioTabsMD.is,XtalRadioTabsMD,getBasePath(XtalRadioTabsMD.is)+"/radio-tabs");class XtalTextAreaMD extends XtalTextInputMD{static get is(){return"xtal-text-area-md"}customizeClone(clonedNode){const textArea=this._inputElement=clonedNode.querySelector("textarea");for(let i=0,ii=this.attributes.length;i<ii;i++){const attrib=this.attributes[i];textArea.setAttribute(attrib.name,attrib.value)}}}initCE(XtalTextAreaMD.is,XtalTextAreaMD,getBasePath(XtalTextAreaMD.is)+"/text-area");class XtalSideNav extends XtallatX(BraKet){static get is(){return"xtal-side-nav"}openMenu(){this.setWidth(250)}setWidth(width){this.shadowRoot.getElementById("mySidenav").style.width=width+"px"}closeMenu(){this.setWidth(0)}initShadowRoot(){this._opener=this.shadowRoot.getElementById("opener");this._boundOpener=this.openMenu.bind(this);this._opener.addEventListener("click",this._boundOpener);this._closer=this.shadowRoot.getElementById("closebtn");this._boundCloser=this.closeMenu.bind(this);this._closer.addEventListener("click",this._boundCloser);this._slot=this.shadowRoot.getElementById("slot");this._slot.addEventListener("click",this._boundCloser)}disconnectedCallback(){this._opener.removeEventListener("click",this._boundOpener);this._closer.removeEventListener("click",this._boundCloser);this._slot.removeEventListener("click",this._boundCloser)}}initCE(XtalSideNav.is,XtalSideNav,getBasePath(XtalSideNav.is)+"/side-nav")})();