(function(){function a(a){const b=document.createElement('template');b.innerHTML=`
<style>
     :host {
        display: block;
    }
    ${a}
</style>
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
`;class c extends HTMLElement{static get is(){return'xtal-input'}constructor(){super(),this.attachShadow({mode:'open'}),this.addTemplate(this.getType())}getType(){return'input'}addTemplate(a){const c=b.content.cloneNode(!0),d=c.querySelector('input');d.setAttribute('type',a);for(let b=0,c=this.attributes.length;b<c;b++){const a=this.attributes[b];d.setAttribute(a.name,a.value)}this.shadowRoot.appendChild(c)}}customElements.define(c.is,c);class d extends c{static get is(){return'xtal-input-email'}getType(){return'email'}}customElements.define(d.is,d)}const b=self.xtal_input?xtal_input.href:document.currentScript.src,c=b.split('/').slice(0,-1).join('/');fetch(c+'/xtal-material.css',{credentials:'include'}).then((b)=>{b.text().then((b)=>{a(b)})})})();