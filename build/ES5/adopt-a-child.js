import{BraKet}from"./node_modules/bra-ket/bra-ket.js";import{qsa}from"./node_modules/templ-mount/templ-mount.js";export var AdoptAChild=function(_BraKet){babelHelpers.inherits(AdoptAChild,_BraKet);function AdoptAChild(){var _this;babelHelpers.classCallCheck(this,AdoptAChild);_this=babelHelpers.possibleConstructorReturn(this,(AdoptAChild.__proto__||Object.getPrototypeOf(AdoptAChild)).call(this));_this._rootElement="div";_this._targetElementSelector="[target]";return _this}babelHelpers.createClass(AdoptAChild,[{key:"postAdopt",value:function postAdopt(){}},{key:"addTemplate",value:function addTemplate(){var _this2=this;babelHelpers.get(AdoptAChild.prototype.__proto__||Object.getPrototypeOf(AdoptAChild.prototype),"addTemplate",this).call(this);if(!this.dynamicSlots)return;this.dynamicSlots.forEach(function(slotSelector){qsa(slotSelector,_this2.shadowRoot).forEach(function(slot){slot.addEventListener("slotchange",function(){slot.assignedNodes().forEach(function(node){var targetEl=_this2.shadowRoot.querySelector(_this2._targetElementSelector);if(node.disabled&&babelHelpers.typeof("undefined"!==node.target)){node.target=targetEl;node.removeAttribute("disabled")}else{if(1===node.nodeType){targetEl.innerHTML="";targetEl.appendChild(node.cloneNode(!0));if(node.parentElement){node.parentElement.removeChild(node)}else{if(1===node.nodeType){node.innerHTML="";node.style.display="none";node.removeAttribute("id")}}}}});_this2.postAdopt()})})})}},{key:"dynamicSlots",get:function get(){return["slot"]}}]);return AdoptAChild}(BraKet);