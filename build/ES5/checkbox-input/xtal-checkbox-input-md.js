import{XtalTextInputMD}from"../text-input/xtal-text-input-md.js";import{initCE,basePath}from"../bra-ket.js";export var XtalCheckboxInputMD=function(_XtalTextInputMD){babelHelpers.inherits(XtalCheckboxInputMD,_XtalTextInputMD);function XtalCheckboxInputMD(){babelHelpers.classCallCheck(this,XtalCheckboxInputMD);return babelHelpers.possibleConstructorReturn(this,(XtalCheckboxInputMD.__proto__||Object.getPrototypeOf(XtalCheckboxInputMD)).apply(this,arguments))}babelHelpers.createClass(XtalCheckboxInputMD,[{key:"emitEvent",value:function emitEvent(){var newEvent=new CustomEvent("checked-changed",{detail:{value:this._inputElement.checked},bubbles:!0,composed:!1});this.dispatchEvent(newEvent)}},{key:"addInputListener",value:function addInputListener(){var _this=this;this._inputElement.addEventListener("change",function(){_this.emitEvent()})}},{key:"checked",get:function get(){return this._inputElement.checked},set:function set(val){this._inputElement.checked=val}}],[{key:"is",get:function get(){return"xtal-checkbox-input-md"}}]);return XtalCheckboxInputMD}(XtalTextInputMD);initCE(XtalCheckboxInputMD.is,XtalCheckboxInputMD,basePath+"/checkbox-input");