(function(){function a(b,e){if(!customElements.get(b)){var f=b.split('-').join('_')+'_template',g=self[f];if(g){var h=g.dataset.src;if(!h)customElements.define(b,e);else if(c[h])g.innerHTML=c[h],customElements.define(b,e);else{if(d[h])return void setTimeout(function(){a(b,e)},100);d[h]=!0,fetch(h,{credentials:'include'}).then(function(a){a.text().then(function(a){d[h]=!1,c[h]=a,g.innerHTML=a,customElements.define(b,e)})})}}}}var b=function(a){function b(){babelHelpers.classCallCheck(this,b);var a=babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this));return a.attachShadow({mode:'open'}),a.addTemplate(),a}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:'tn',get:function(){return this.tagName.toLowerCase()}},{key:'CE',get:function(){return this._ce||(this._ce=customElements.get(this.tn)),this._ce}}],[{key:'is',get:function(){return'xtal-shadow'}}]),babelHelpers.createClass(b,[{key:'customizeClone',value:function(){}},{key:'initShadowRoot',value:function(){}},{key:'addTemplate',value:function(){this.CE._template||(this.CE._template={});var a=this.tn;this.CE._template[a]||(this.CE._template[a]=self[a.split('-').join('_')+'_template']);var b=this.CE._template[a].content.cloneNode(!0);this.customizeClone(b),this.shadowRoot.appendChild(b),this.initShadowRoot()}}]),b}(HTMLElement),c={},d={};a(b.is,b);var e=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:'customizeClone',value:function(a){babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'customizeClone',this).call(this,a),this._inputElement=a.querySelector('input'),this._inputElement.setAttribute('type',this.getType());for(var c,d=0,e=this.attributes.length;d<e;d++)c=this.attributes[d],'type'===c.name||this._inputElement.setAttribute(c.name,c.value)}},{key:'initShadowRoot',value:function(){var a=this;this.addInputListener(),this._inputElement.addEventListener('change',function(){var b=a._inputElement;b&&b.matches('.form-element-field')&&b.classList[b.value?'add':'remove']('-hasvalue')})}},{key:'getType',value:function(){return'input'}},{key:'addEventListener',value:function(a,c){a.endsWith('-changed')?babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'addEventListener',this).call(this,a,c):this._inputElement.addEventListener(a,c)}},{key:'addInputListener',value:function(){var a=this;this._inputElement.addEventListener('input',function(){a.emitEvent()})}},{key:'emitEvent',value:function(){var a=new CustomEvent('value-changed',{detail:{value:this._inputElement.value},bubbles:!0,composed:!1});this.dispatchEvent(a)}},{key:'_upgradeProperties',value:function(a){var b=this;a.forEach(function(a){if(b.hasOwnProperty(a)){var c=b[a];delete b[a],b[a]=c}})}},{key:'connectedCallback',value:function(){this._upgradeProperties(['value']),this.addMutationObserver()}},{key:'addMutationObserver',value:function(){var a=this;this._observer=new MutationObserver(function(b){b.forEach(function(b){a._inputElement[b.attributeName]=a[b.attributeName]})}),this._observer.observe(this,{attributes:!0})}},{key:'disconnectedCallback',value:function(){this._observer.disconnect()}},{key:'value',get:function(){return this._inputElement.value},set:function(a){this._inputElement.value=a}}],[{key:'is',get:function(){return'xtal-material-input'}}]),b}(b);a(e.is,e);var f=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:'getType',value:function(){return'email'}}],[{key:'is',get:function(){return'xtal-material-email-input'}}]),b}(e);a(f.is,f);var g=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:'getType',value:function(){return'checkbox'}},{key:'emitEvent',value:function(){var a=new CustomEvent('checked-changed',{detail:{value:this._inputElement.checked},bubbles:!0,composed:!1});this.dispatchEvent(a)}},{key:'addInputListener',value:function(){var a=this;this._inputElement.addEventListener('change',function(){a.emitEvent()})}},{key:'checked',get:function(){return this._inputElement.checked},set:function(a){this._inputElement.checked=a}}],[{key:'is',get:function(){return'xtal-material-checkbox'}}]),b}(e);a(g.is,g)})();