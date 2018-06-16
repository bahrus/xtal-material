(function(){function getBasePath(){var path,link=self.xtal_material;if(link){path=link.href}else{var cs=document.currentScript;if(cs){path=cs.src}}return path.split("/").slice(0,-1).join("/")}function lispToSnakeCase(s){return s.split("-").join("_")}var _cachedTemplates={},fetchInProgress={};function loadTemplate(template,params){var src=template.dataset.src;if(src){if(_cachedTemplates[src]){template.innerHTML=_cachedTemplates[src];if(params)customElements.define(params.tagName,params.cls)}else{if(fetchInProgress[src]){if(params){setTimeout(function(){loadTemplate(template,params)},100)}return}fetchInProgress[src]=!0;fetch(src,{credentials:"same-origin"}).then(function(resp){resp.text().then(function(txt){fetchInProgress[src]=!1;if(params&&params.preProcessor)txt=params.preProcessor.process(txt);_cachedTemplates[src]=txt;template.innerHTML=txt;template.setAttribute("loaded","");if(params)customElements.define(params.tagName,params.cls)})})}}else{if(params&&params.tagName)customElements.define(params.tagName,params.cls)}}function qsa(css,from){return[].slice.call((from?from:this).querySelectorAll(css))}var TemplMount=function(_HTMLElement){babelHelpers.inherits(TemplMount,_HTMLElement);function TemplMount(){var _this;babelHelpers.classCallCheck(this,TemplMount);_this=babelHelpers.possibleConstructorReturn(this,(TemplMount.__proto__||Object.getPrototypeOf(TemplMount)).call(this));if(!TemplMount._alreadyDidGlobalCheck){TemplMount._alreadyDidGlobalCheck=!0;_this.loadTemplatesOutsideShadowDOM();if("loading"===document.readyState){document.addEventListener("DOMContentLoaded",function(){_this.loadTemplatesOutsideShadowDOM();_this.monitorHeadForTemplates()})}else{_this.monitorHeadForTemplates()}}return _this}babelHelpers.createClass(TemplMount,[{key:"getHost",value:function getHost(){var parent=this.parentNode;return parent.host}},{key:"loadTemplates",value:function loadTemplates(from){qsa("template[data-src]",from).forEach(function(externalRefTemplate){loadTemplate(externalRefTemplate)})}},{key:"loadTemplatesOutsideShadowDOM",value:function loadTemplatesOutsideShadowDOM(){this.loadTemplates(document)}},{key:"loadTemplateInsideShadowDOM",value:function loadTemplateInsideShadowDOM(){var host=this.getHost();if(!host)return;this.loadTemplates(host)}},{key:"monitorHeadForTemplates",value:function monitorHeadForTemplates(){this._observer=new MutationObserver(function(mutationsList){mutationsList.forEach(function(mutationRecord){mutationRecord.addedNodes.forEach(function(node){if("TEMPLATE"===node.tagName)loadTemplate(node)})})})}},{key:"connectedCallback",value:function connectedCallback(){var _this2=this;this.loadTemplateInsideShadowDOM();if("loading"===document.readyState){document.addEventListener("DOMContentLoaded",function(){_this2.loadTemplateInsideShadowDOM()})}}}],[{key:"is",get:function get(){return"templ-mount"}}]);return TemplMount}(HTMLElement);TemplMount._alreadyDidGlobalCheck=!1;if(!customElements.get(TemplMount.is)){customElements.define(TemplMount.is,TemplMount)}var disabled="disabled";function XtallatX(superClass){return function(_superClass){babelHelpers.inherits(_class,_superClass);function _class(){babelHelpers.classCallCheck(this,_class);return babelHelpers.possibleConstructorReturn(this,(_class.__proto__||Object.getPrototypeOf(_class)).apply(this,arguments))}babelHelpers.createClass(_class,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}},{key:"de",value:function de(name,detail){var newEvent=new CustomEvent(name+"-changed",{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);return newEvent}},{key:"_upgradeProperties",value:function _upgradeProperties(props){var _this3=this;props.forEach(function(prop){if(_this3.hasOwnProperty(prop)){var value=_this3[prop];delete _this3[prop];_this3[prop]=value}})}},{key:"disabled",get:function get(){return this._disabled},set:function set(val){if(val){this.setAttribute(disabled,"")}else{this.removeAttribute(disabled)}}}],[{key:"observedAttributes",get:function get(){return[disabled]}}]);return _class}(superClass)}function lispToSnakeCase(s){return s.split("-").join("_")}var BraKet=function(_BraKetMixin){babelHelpers.inherits(BraKet,_BraKetMixin);function BraKet(){var _this4;babelHelpers.classCallCheck(this,BraKet);_this4=babelHelpers.possibleConstructorReturn(this,(BraKet.__proto__||Object.getPrototypeOf(BraKet)).call(this));if(!(Object.getPrototypeOf(babelHelpers.assertThisInitialized(_this4))===BraKet.prototype)){_this4.addTemplate()}return _this4}return BraKet}(function(superClass){return function(_superClass2){babelHelpers.inherits(_class2,_superClass2);function _class2(){babelHelpers.classCallCheck(this,_class2);return babelHelpers.possibleConstructorReturn(this,(_class2.__proto__||Object.getPrototypeOf(_class2)).apply(this,arguments))}babelHelpers.createClass(_class2,[{key:"looksLike",value:function looksLike(){}},{key:"customizeClone",value:function customizeClone(){}},{key:"initShadowRoot",value:function initShadowRoot(){}},{key:"addTemplate",value:function addTemplate(noShadow){if(!noShadow){this.attachShadow({mode:"open"})}if(!this.CE._template){this.CE._template={}}var tn=this.looksLike()||this.tn;if(!this.CE._template[tn]){lispToSnakeCase(tn)+"_template";this.CE._template[tn]=self[lispToSnakeCase(tn)+"_template"]}var clonedNode=this.CE._template[tn].content.cloneNode(!0);this.customizeClone(clonedNode);if(!noShadow){this.shadowRoot.appendChild(clonedNode);this.initShadowRoot()}else{this.appendChild(clonedNode)}}},{key:"tn",get:function get(){return this.tagName.toLowerCase()}},{key:"dynamicSlots",get:function get(){return null}},{key:"CE",get:function get(){if(!this._ce)this._ce=customElements.get(this.tn);return this._ce}}],[{key:"is",get:function get(){return"bra-ket"}}]);return _class2}(superClass)}(HTMLElement));function initCE(tagName,cls,basePath,sharedTemplateTagName){if(customElements.get(tagName))return;var templateTagName=sharedTemplateTagName||tagName,templateID=lispToSnakeCase(templateTagName)+"_template",template=self[templateID];if(!template){template=document.createElement("template");template.id=templateID;template.dataset.src=basePath+"/"+templateTagName+".html";document.head.appendChild(template)}loadTemplate(template,{cls:cls,sharedTemplateTagName:sharedTemplateTagName,tagName:tagName})}var AdoptAChild=function(_BraKet){babelHelpers.inherits(AdoptAChild,_BraKet);function AdoptAChild(){var _this5;babelHelpers.classCallCheck(this,AdoptAChild);_this5=babelHelpers.possibleConstructorReturn(this,(AdoptAChild.__proto__||Object.getPrototypeOf(AdoptAChild)).call(this));_this5._rootElement="div";_this5._targetElementSelector="[target]";return _this5}babelHelpers.createClass(AdoptAChild,[{key:"postAdopt",value:function postAdopt(){}},{key:"addTemplate",value:function addTemplate(){var _this6=this;console.log("addTemplate");babelHelpers.get(AdoptAChild.prototype.__proto__||Object.getPrototypeOf(AdoptAChild.prototype),"addTemplate",this).call(this);if(!this.dynamicSlots)return;this.dynamicSlots.forEach(function(slotSelector){qsa(slotSelector,_this6.shadowRoot).forEach(function(slot){slot.addEventListener("slotchange",function(){slot.assignedNodes().forEach(function(node){var targetEl=_this6.shadowRoot.querySelector(_this6._targetElementSelector);if(node.disabled&&babelHelpers.typeof("undefined"!==node.target)){node.target=targetEl;node.removeAttribute("disabled")}else{if(1===node.nodeType){targetEl.innerHTML="";targetEl.appendChild(node.cloneNode(!0));if(node.parentElement){node.parentElement.removeChild(node)}else{if(1===node.nodeType){node.innerHTML="";node.style.display="none";node.removeAttribute("id")}}}}});_this6.postAdopt()})})})}},{key:"dynamicSlots",get:function get(){return["slot"]}}]);return AdoptAChild}(BraKet),XtalTextInputMD=function(_XtallatX){babelHelpers.inherits(XtalTextInputMD,_XtallatX);function XtalTextInputMD(){babelHelpers.classCallCheck(this,XtalTextInputMD);return babelHelpers.possibleConstructorReturn(this,(XtalTextInputMD.__proto__||Object.getPrototypeOf(XtalTextInputMD)).apply(this,arguments))}babelHelpers.createClass(XtalTextInputMD,[{key:"customizeClone",value:function customizeClone(clonedNode){babelHelpers.get(XtalTextInputMD.prototype.__proto__||Object.getPrototypeOf(XtalTextInputMD.prototype),"customizeClone",this).call(this,clonedNode);var inputEl=this._inputElement=clonedNode.querySelector("input");inputEl.setAttribute("type",this.getType());for(var i=0,ii=this.attributes.length,attrib;i<ii;i++){attrib=this.attributes[i];if("type"===attrib.name)continue;inputEl.setAttribute(attrib.name,attrib.value)}}},{key:"initShadowRoot",value:function initShadowRoot(){var _this7=this;this.addInputListener();this._inputElement.addEventListener("change",function(){var element=_this7._inputElement;if(element&&element.matches(".form-element-field")){element.classList[element.value?"add":"remove"]("-hasvalue")}})}},{key:"getType",value:function getType(){return this.constructor.is.split("-")[1]}},{key:"addInputListener",value:function addInputListener(){var _this8=this;this._inputElement.addEventListener("input",function(){_this8.emitEvent()})}},{key:"emitEvent",value:function emitEvent(){var newEvent=new CustomEvent("value-changed",{detail:{value:this._inputElement.value},bubbles:!0,composed:!1});this.dispatchEvent(newEvent)}},{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties(["value"]);this.addMutationObserver()}},{key:"addMutationObserver",value:function addMutationObserver(){var _this9=this;this._observer=new MutationObserver(function(mutationsList){mutationsList.forEach(function(mutation){_this9._inputElement[mutation.attributeName]=_this9[mutation.attributeName]})});this._observer.observe(this,{attributes:!0})}},{key:"disconnectedCallback",value:function disconnectedCallback(){this._observer.disconnect()}},{key:"value",get:function get(){return this._inputElement.value},set:function set(val){this._inputElement.value=val}}],[{key:"is",get:function get(){return"xtal-text-input-md"}}]);return XtalTextInputMD}(XtallatX(BraKet)),basePath=getBasePath(XtalTextInputMD.is);initCE(XtalTextInputMD.is,XtalTextInputMD,basePath+"/text-input");var XtalEmailInputMD=function(_XtalTextInputMD){babelHelpers.inherits(XtalEmailInputMD,_XtalTextInputMD);function XtalEmailInputMD(){babelHelpers.classCallCheck(this,XtalEmailInputMD);return babelHelpers.possibleConstructorReturn(this,(XtalEmailInputMD.__proto__||Object.getPrototypeOf(XtalEmailInputMD)).apply(this,arguments))}babelHelpers.createClass(XtalEmailInputMD,[{key:"looksLike",value:function looksLike(){return XtalTextInputMD.is}}],[{key:"is",get:function get(){return"xtal-email-input-md"}}]);return XtalEmailInputMD}(XtalTextInputMD);initCE(XtalEmailInputMD.is,XtalEmailInputMD,basePath+"/text-input",XtalTextInputMD.is);var XtalCheckboxInputMD=function(_XtalTextInputMD2){babelHelpers.inherits(XtalCheckboxInputMD,_XtalTextInputMD2);function XtalCheckboxInputMD(){babelHelpers.classCallCheck(this,XtalCheckboxInputMD);return babelHelpers.possibleConstructorReturn(this,(XtalCheckboxInputMD.__proto__||Object.getPrototypeOf(XtalCheckboxInputMD)).apply(this,arguments))}babelHelpers.createClass(XtalCheckboxInputMD,[{key:"emitEvent",value:function emitEvent(){var newEvent=new CustomEvent("checked-changed",{detail:{value:this._inputElement.checked},bubbles:!0,composed:!1});this.dispatchEvent(newEvent)}},{key:"addInputListener",value:function addInputListener(){var _this10=this;this._inputElement.addEventListener("change",function(){_this10.emitEvent()})}},{key:"checked",get:function get(){return this._inputElement.checked},set:function set(val){this._inputElement.checked=val}}],[{key:"is",get:function get(){return"xtal-checkbox-input-md"}}]);return XtalCheckboxInputMD}(XtalTextInputMD);initCE(XtalCheckboxInputMD.is,XtalCheckboxInputMD,getBasePath(XtalCheckboxInputMD.is)+"/checkbox-input");var XtalRadioGroupMD=function(_AdoptAChild){babelHelpers.inherits(XtalRadioGroupMD,_AdoptAChild);babelHelpers.createClass(XtalRadioGroupMD,null,[{key:"is",get:function get(){return"xtal-radio-group-md"}}]);function XtalRadioGroupMD(){babelHelpers.classCallCheck(this,XtalRadioGroupMD);return babelHelpers.possibleConstructorReturn(this,(XtalRadioGroupMD.__proto__||Object.getPrototypeOf(XtalRadioGroupMD)).call(this))}return XtalRadioGroupMD}(AdoptAChild);initCE(XtalRadioGroupMD.is,XtalRadioGroupMD,getBasePath(XtalRadioGroupMD.is)+"/radio-group");var styleFn=function(n,t){return"\ninput[type=\"radio\"][name=\"tabs\"]:nth-of-type(".concat(n+1,"):checked~.slide {\n    left: calc((100% / ").concat(t,") * ").concat(n,");\n}\n")},XtalRadioTabsMD=function(_XtallatX2){babelHelpers.inherits(XtalRadioTabsMD,_XtallatX2);babelHelpers.createClass(XtalRadioTabsMD,null,[{key:"is",get:function get(){return"xtal-radio-tabs-md"}}]);function XtalRadioTabsMD(){babelHelpers.classCallCheck(this,XtalRadioTabsMD);return babelHelpers.possibleConstructorReturn(this,(XtalRadioTabsMD.__proto__||Object.getPrototypeOf(XtalRadioTabsMD)).call(this))}babelHelpers.createClass(XtalRadioTabsMD,[{key:"handleChange",value:function handleChange(e){this.de("selected-tab",e.target)}},{key:"postAdopt",value:function postAdopt(){var _this11=this,q=qsa("input",this.shadowRoot);if(0===q.length){setTimeout(function(){_this11.postAdopt()},100);return}this._changeHandler=this.handleChange.bind(this);q.forEach(function(radio){radio.addEventListener("change",_this11._changeHandler)});var styles=[];console.log("length  = "+q.length);for(var i=0,ii=q.length;i<ii;i++){styles.push(styleFn(i,ii))}styles.push("\n        .slide {\n            width: calc(100% / ".concat(q.length,");\n        }\n        "));var style=document.createElement("style");style.innerHTML=styles.join("");this.shadowRoot.appendChild(style);this.addEventListener("input",function(){debugger})}},{key:"disconnectedCallback",value:function disconnectedCallback(){var _this12=this;babelHelpers.get(XtalRadioTabsMD.prototype.__proto__||Object.getPrototypeOf(XtalRadioTabsMD.prototype),"disconnectedCallback",this).call(this);var q=qsa("input",this.shadowRoot);q.forEach(function(radio){radio.removeEventListener("change",_this12._changeHandler)})}}]);return XtalRadioTabsMD}(XtallatX(AdoptAChild));initCE(XtalRadioTabsMD.is,XtalRadioTabsMD,getBasePath(XtalRadioTabsMD.is)+"/radio-tabs");var XtalTextAreaMD=function(_XtalTextInputMD3){babelHelpers.inherits(XtalTextAreaMD,_XtalTextInputMD3);function XtalTextAreaMD(){babelHelpers.classCallCheck(this,XtalTextAreaMD);return babelHelpers.possibleConstructorReturn(this,(XtalTextAreaMD.__proto__||Object.getPrototypeOf(XtalTextAreaMD)).apply(this,arguments))}babelHelpers.createClass(XtalTextAreaMD,[{key:"customizeClone",value:function customizeClone(clonedNode){for(var textArea=this._inputElement=clonedNode.querySelector("textarea"),i=0,ii=this.attributes.length,attrib;i<ii;i++){attrib=this.attributes[i];textArea.setAttribute(attrib.name,attrib.value)}}}],[{key:"is",get:function get(){return"xtal-text-area-md"}}]);return XtalTextAreaMD}(XtalTextInputMD);initCE(XtalTextAreaMD.is,XtalTextAreaMD,getBasePath(XtalTextAreaMD.is)+"/text-area");var XtalSideNav=function(_XtallatX3){babelHelpers.inherits(XtalSideNav,_XtallatX3);function XtalSideNav(){babelHelpers.classCallCheck(this,XtalSideNav);return babelHelpers.possibleConstructorReturn(this,(XtalSideNav.__proto__||Object.getPrototypeOf(XtalSideNav)).apply(this,arguments))}babelHelpers.createClass(XtalSideNav,[{key:"openMenu",value:function openMenu(){this.setWidth(250)}},{key:"setWidth",value:function setWidth(width){this.shadowRoot.getElementById("mySidenav").style.width=width+"px"}},{key:"closeMenu",value:function closeMenu(){this.setWidth(0)}},{key:"initShadowRoot",value:function initShadowRoot(){this._opener=this.shadowRoot.getElementById("opener");this._boundOpener=this.openMenu.bind(this);this._opener.addEventListener("click",this._boundOpener);this._closer=this.shadowRoot.getElementById("closebtn");this._boundCloser=this.closeMenu.bind(this);this._closer.addEventListener("click",this._boundCloser);this._slot=this.shadowRoot.getElementById("slot");this._slot.addEventListener("click",this._boundCloser)}},{key:"disconnectedCallback",value:function disconnectedCallback(){this._opener.removeEventListener("click",this._boundOpener);this._closer.removeEventListener("click",this._boundCloser);this._slot.removeEventListener("click",this._boundCloser)}}],[{key:"is",get:function get(){return"xtal-side-nav"}}]);return XtalSideNav}(XtallatX(BraKet));initCE(XtalSideNav.is,XtalSideNav,getBasePath(XtalSideNav.is)+"/side-nav")})();