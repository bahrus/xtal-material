(function(){function a(){function a(){const a=document.createElement('template');a.innerHTML=`
            <label class="form-checkbox-label">
                <input id="input_field" class="form-checkbox-field" type="checkbox" />
                <i class="form-checkbox-button"></i>
                <slot name="label"></slot>
            </label>
            `;const b=document.createElement('template');b.innerHTML=`
    <style>
         :host {
            display: block;
        }
        ${h}
    </style>
            `;class c extends f{static get is(){return'xtal-input-checkbox'}getType(){return'checkbox'}getTemplate(){return a}get checked(){return this._inputElement.checked}set checked(a){this._inputElement.checked=a}getCssTemplate(){return b}emitEvent(){const a=new CustomEvent('checked-changed',{detail:{value:this._inputElement.checked},bubbles:!0,composed:!1});this.dispatchEvent(a)}}customElements.define(c.is,c)}const b=document.createElement('template');b.innerHTML=`
<style>
     :host {
        display: block;
    }
    ${d}
</style>
        `;const e=document.createElement('template');e.innerHTML=`
<div class="form-element form-input">
    
    <input id="input_field" class="form-element-field" placeholder=" " required/>
    <div class="form-element-bar"></div>
    <label class="form-element-label" for="input_field">
    <slot name="label"></slot>
    </label>
    <small class="form-element-hint">
        <slot name="hint"></slot>
    </small>
</div>
`;class f extends HTMLElement{static get is(){return'xtal-input'}constructor(){super(),this.attachShadow({mode:'open'}),this.addTemplate(this.getType())}emitEvent(){const a=new CustomEvent('value-changed',{detail:{value:this._inputElement.value},bubbles:!0,composed:!1});this.dispatchEvent(a)}getType(){return'input'}getCssTemplate(){return b}getTemplate(){return e}get value(){return this._inputElement.value}set value(a){this._inputElement.value=a}addTemplate(a){const b=this.getCssTemplate().content.cloneNode(!0);this.shadowRoot.appendChild(b);const c=this.getTemplate().content.cloneNode(!0);this._inputElement=c.querySelector('input'),this._inputElement.setAttribute('type',a);for(let b=0,c=this.attributes.length;b<c;b++){const a=this.attributes[b];this._inputElement.setAttribute(a.name,a.value)}this.shadowRoot.appendChild(c),this._inputElement.addEventListener('input',()=>{this.emitEvent()}),this._inputElement.addEventListener('change',()=>{let a=this._inputElement;a&&a.matches('.form-element-field')&&a.classList[a.value?'add':'remove']('-hasvalue')})}_upgradeProperties(a){a.forEach((a)=>{if(this.hasOwnProperty(a)){let b=this[a];delete this[a],this[a]=b}})}connectedCallback(){this._upgradeProperties(['value'])}}if(customElements.get(f.is))return;customElements.define(f.is,f);class g extends f{static get is(){return'xtal-input-email'}getType(){return'email'}}customElements.define(g.is,g);let h;fetch(c+'/xtal-material-checkbox-radio.css',{credentials:'include'}).then((b)=>{b.text().then((b)=>{h=b,a()})})}const b=self.xtal_input?xtal_input.href:document.currentScript.src,c=b.split('/').slice(0,-1).join('/');let d;fetch(c+'/xtal-material.css',{credentials:'include'}).then((b)=>{b.text().then((b)=>{d=b,a()})})})();